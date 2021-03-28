import makeLogger from '@/lib/makeLogger';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TaskHistoryChartProps {
  taskHistory: taskHistory[];
  width: number;
  height: number;
}

interface d3states {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null;
}

const translate = (x: number = 0, y: number = 0, k: number = 0) => {
  let t = `translate(${x}, ${y})`;
  if (k >= 1) t = [t, `scale(${k})`].join(' ');
  return k;
};

const logger = makeLogger('DailyTask');

const TaskHistoryChart: React.FC<TaskHistoryChartProps> = (props) => {
  const { taskHistory, width, height } = props;
  const refChart = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<d3states>({
    svg: null,
  });

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

  const enterTask = (scaleY: d3.ScaleLinear<number, number>) => (
    tsk: d3.Selection<d3.EnterElement, taskHistory, SVGSVGElement, unknown>
  ) => {
    return tsk
      .append('text')
      .text((d) => JSON.stringify(d))
      .attr('dominant-baseline', 'hanging')
      .attr('transform', (d) => translate(0, scaleY(d.timeStart)));
  };

  function d3render() {
    if (!nodes.svg) return null;
    logger('render d3');
    nodes.svg.attr('width', width).attr('height', height);
    const times = taskHistory.reduce(
      (ac, cv) => [...ac, cv.timeStart, cv.timeEnd],
      new Array<number>()
    );
    const timeMin = d3.min(times) || -1;
    const timeMax = d3.max(times) || -1;

    const scaleY = d3.scaleLinear<number, number>().domain([timeMin, timeMax]);
    logger(times);
    nodes.svg
      .selectAll<SVGSVGElement, taskHistory[]>('.text')
      .data(taskHistory)
      .join(enterTask(scaleY));
  }

  d3render();

  return <Box ref={refChart} />;
};

export default TaskHistoryChart;
