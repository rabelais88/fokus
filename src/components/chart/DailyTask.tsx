import makeLogger from '@/lib/makeLogger';
import { Box } from '@chakra-ui/react';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import * as d3 from 'd3';
import strToHexColor from '@/lib/_strToHexColor';
import { useTranslation } from 'react-i18next';

interface TaskHistoryChartProps {
  history: taskHistory[];
  tasks: tasksData;
  width: number;
  height: number;
  padding?: number;
}

interface chartHistory extends taskHistory {
  yFiltered: number;
}

interface d3states {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null;
}

const translate = (x: number = 0, y: number = 0, k: number = 0) => {
  let t = `translate(${x}, ${y})`;
  if (k >= 1) t = [t, `scale(${k})`].join(' ');
  return t;
};

function dodge(
  positions: number[],
  separation = 30,
  maxiter = 10,
  maxerror = 1e-1
) {
  let n = positions.length;
  if (!positions.every(isFinite)) throw new Error('invalid position');
  if (!(n > 1)) return positions;
  let index = d3.range(positions.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    index.sort((i, j) => d3.ascending(positions[i], positions[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = positions[index[i]] - positions[index[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        positions[index[i - 1]] -= delta;
        positions[index[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return positions;
}

const logger = makeLogger('DailyTask');

const TaskHistoryChart: React.FC<TaskHistoryChartProps> = (props) => {
  const { history, width, height, padding = 0, tasks } = props;
  const refChart = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<d3states>({
    svg: null,
  });
  const chartXstart = padding;
  const chartYstart = padding;
  const chartXend = useMemo(() => width - padding * 2, [width, padding]);
  const chartYend = useMemo(() => height - padding * 2, [height, padding]);
  const { t } = useTranslation();

  useEffect(() => {
    if (refChart.current !== null && refChart.current !== undefined) {
      logger('mounted', refChart.current);
      const targetEl = d3.select(refChart.current);
      const svgEmpty = targetEl.select('svg').empty();
      logger({ targetEl, svgEmpty });
      if (svgEmpty) {
        logger('append svg');
        const svg = targetEl.append('svg');
        setNodes({ ...nodes, svg });
      }
    }
  }, [refChart.current]);

  const times = useMemo(
    () =>
      history
        .reduce(
          (ac, cv) => [...ac, cv.timeStart, cv.timeEnd],
          new Array<number>()
        )
        .filter((t) => t !== -1),
    [history]
  );
  const timeMin = useMemo(() => d3.min(times) || -1, [times]);
  const timeMax = useMemo(() => d3.max(times) || -1, [times]);
  logger({ timeMin, timeMax });

  const scaleY = useCallback(
    d3.scaleLinear().domain([timeMin, timeMax]).range([chartYstart, chartYend]),
    [timeMin, timeMax, height]
  );

  const historyCoordsY = useMemo(
    () => dodge(history.map((hist) => scaleY(hist.timeStart))),
    [history]
  );
  const historyWithCoords = useMemo(
    () =>
      history.map((hist, i) => ({
        ...hist,
        yFiltered: historyCoordsY[i],
      })),
    [historyCoordsY]
  );

  const drawTaskDot = useCallback(
    (tsk) =>
      tsk
        .append('circle')
        .attr('r', 14)
        .attr('cx', 14)
        .attr('cy', 7)
        .attr('fill', (d: chartHistory) => strToHexColor(d.taskId)),
    [tasks]
  );

  const drawTaskTitle = useCallback(
    (tsk) =>
      tsk
        .append('text')
        .text((d: chartHistory) => tasks[d.taskId].title)
        .attr('dominant-baseline', 'hanging')
        .attr('transform', translate(35)),
    [tasks]
  );

  const drawTaskDate = useCallback(
    (tsk) =>
      tsk
        .append('text')
        .text((d: chartHistory) =>
          t('daily-task-time-format', { time: d.timeStart })
        )
        .attr('dominant-baseline', 'hanging')
        .attr('transform', translate(200)),
    [history]
  );

  const enterTask = useCallback(
    (
      tsk: d3.Selection<d3.EnterElement, chartHistory, SVGSVGElement, unknown>
    ) => {
      return tsk
        .append('g')
        .attr('class', 'task')
        .attr('transform', (d: chartHistory) =>
          translate(chartXstart + 15, d.yFiltered)
        )
        .call(drawTaskDot)
        .call(drawTaskTitle)
        .call(drawTaskDate);
    },
    [history, tasks]
  );

  const d3render = useCallback(() => {
    if (!nodes.svg) return null;
    logger('render d3');
    nodes.svg.attr('width', width).attr('height', height);
    logger(times);
    nodes.svg
      .selectAll<SVGSVGElement, chartHistory>('.task')
      .data(historyWithCoords, ({ taskId }: chartHistory) => taskId)
      .join(enterTask);
  }, [nodes, history, tasks]);

  d3render();

  return <Box ref={refChart} />;
};

export default TaskHistoryChart;
