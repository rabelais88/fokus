import React, { Reducer, useMemo, useReducer, forwardRef } from 'react';
import {
  Box,
  Heading,
  HStack,
  StatNumber,
  Table,
  TableRowProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import DailyTask from '@/components/chart/DailyTask';
import useTaskNow from '@/lib/swr/useTaskNow';
import { LOAD_SUCCESS, STORE_TASKS } from '@/constants';
import useTasks from '@/lib/useTasks';
import analyzeTime from '@/lib/analyzeTime';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import DatePicker from '@/components/DatePicker';

type CurrentTaskDisplayArg = {
  taskNow: taskNowType;
  hasTask: boolean;
};
const CurrentTaskDisplay: React.FC<CurrentTaskDisplayArg> = ({
  taskNow,
  hasTask,
}) => {
  if (!hasTask) return <Text>no task assigned at the moment </Text>;

  return (
    <Table>
      <Tbody>
        <Tr>
          <Td>Current task</Td>
          <Td>{taskNow.title}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

type Action =
  | { type: 'setPage'; page: number }
  | { type: 'setSize'; size: number }
  | { type: 'setTimeStart'; timeStart: number }
  | { type: 'setTimeEnd'; timeEnd: number };

interface State {
  size: number;
  page: number;
  timeStart: number;
  timeEnd: number;
}

const get24hPast = (timestamp: number) =>
  dayjs(timestamp).add(1, 'day').valueOf();

const today = dayjs(new Date())
  .set('hour', 0)
  .set('minute', 0)
  .set('second', 0)
  .valueOf();

const initialState: State = {
  size: 20,
  page: 0,
  timeStart: today,
  timeEnd: get24hPast(today),
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'setPage':
      return { ...state, cursor: action.page };
    case 'setSize':
      return { ...state, size: action.size };
    case 'setTimeStart':
      return { ...state, timeStart: action.timeStart };
    case 'setTimeEnd':
      return { ...state, timeEnd: action.timeEnd };
    default:
      throw new Error();
  }
};

interface TaskRowProps extends TableRowProps, taskHistory {
  taskName: string;
}

const TaskRow: React.FC<TaskRowProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Tr>
      <Td>{props.taskName}</Td>
      <Td>{t('full-time', analyzeTime(props.timeStart))}</Td>
      <Td>{t('full-time', analyzeTime(props.timeEnd))}</Td>
    </Tr>
  );
};

const Stats: React.FC = () => {
  const {
    taskHistory,
    noTaskHistory,
    loadState: taskHistoryLoadState,
  } = useTaskHistory();
  const { hasTask, taskNow, loadState: taskNowLoadState } = useTaskNow();
  const { tasksById, loadState: tasksLoadState } = useTasks();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { timeStart, timeEnd } = state;

  const todayHistory = useMemo(() => {
    return taskHistory.filter(
      (hist) => hist.timeStart >= timeStart && hist.timeStart <= timeEnd
    );
  }, [timeStart, timeEnd]);

  const hasEnoughTask = useMemo(() => todayHistory.length >= 2, [todayHistory]);
  const hasNext = useMemo(
    () => taskHistory.length < state.page * state.size,
    [taskHistory, state]
  );
  const filteredHistory = useMemo(() => {
    const startIndex = state.page * state.size;
    const endIndex = startIndex + state.size;
    return taskHistory.slice(startIndex, endIndex);
  }, [taskHistory, state]);

  const tableLoaded =
    tasksLoadState === LOAD_SUCCESS && taskHistoryLoadState === LOAD_SUCCESS;

  return (
    <Box>
      <Box mt={5}>
        <Heading as="h2" size="md">
          Statistics
        </Heading>
        {taskNowLoadState === LOAD_SUCCESS && (
          <CurrentTaskDisplay taskNow={taskNow} hasTask={hasTask} />
        )}
        {!hasEnoughTask && (
          <Text>
            not enough history!
            <br />
            run more task to accumulate history
          </Text>
        )}
        <HStack>
          <DatePicker
            selected={new Date(timeStart)}
            onChange={(v) => {
              if (!v) return;
              if (Array.isArray(v)) {
                dispatch({ type: 'setTimeStart', timeStart: v[0].getTime() });
                return;
              }
              dispatch({ type: 'setTimeStart', timeStart: v.getTime() });
            }}
          />
          <DatePicker
            selected={new Date(timeEnd)}
            onChange={(v) => {
              if (!v) return;
              if (Array.isArray(v)) {
                dispatch({ type: 'setTimeEnd', timeEnd: v[0].getTime() });
                return;
              }
              dispatch({ type: 'setTimeEnd', timeEnd: v.getTime() });
            }}
          />
        </HStack>
        {hasEnoughTask && (
          <DailyTask
            history={todayHistory}
            tasks={tasksById}
            width={500}
            height={500}
            padding={50}
          />
        )}
        {tableLoaded && (
          <Table>
            <Thead>
              <Tr>
                <Th>task name</Th>
                <Th>start time</Th>
                <Th>end time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredHistory.map((hist, i) => (
                <TaskRow
                  key={i}
                  taskName={(tasksById[hist.taskId] || {}).title || ''}
                  {...hist}
                />
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default Stats;
