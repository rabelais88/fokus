import React, { Reducer, useMemo, useReducer, forwardRef } from 'react';
import {
  Box,
  Heading,
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
  | { type: 'setSize'; size: number };

interface State {
  size: number;
  page: number;
}

const initialState: State = {
  size: 20,
  page: 0,
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'setPage':
      return { ...state, cursor: action.page };
    case 'setSize':
      return { ...state, size: action.size };
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

  const today = useMemo(() => {
    const { dayjs } = analyzeTime(new Date().getTime());
    return dayjs;
  }, []);

  const todayHistory = useMemo(() => {
    const timeStart = today.clone().hour(0).minute(0).second(0).valueOf();
    const timeEnd = today.clone().hour(23).minute(59).second(59).valueOf();
    return taskHistory.filter(
      (hist) => hist.timeStart >= timeStart && hist.timeStart <= timeEnd
    );
  }, [today, taskHistory]);

  const hasEnoughTask = useMemo(() => todayHistory.length >= 2, [todayHistory]);
  const hasNext = useMemo(() => taskHistory.length < state.page * state.size, [
    taskHistory,
    state,
  ]);
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
