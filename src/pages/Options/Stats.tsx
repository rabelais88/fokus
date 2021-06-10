import React, { Reducer, useMemo, useReducer, forwardRef } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  StatNumber,
  Switch,
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
import useTasks from '@/lib/swr/useTasks';
import analyzeTime from '@/lib/analyzeTime';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import DatePicker from '@/components/DatePicker';
import useDebugMode from '@/lib/swr/useDebugMode';
import useTask from '@/lib/swr/useTask';
import useTaskHistories from '@/lib/swr/useTaskHistories';

type CurrentTaskDisplayArg = {
  taskId: string;
  hasTask: boolean;
};
const CurrentTaskDisplay: React.FC<CurrentTaskDisplayArg> = ({
  taskId,
  hasTask,
}) => {
  if (!hasTask) return <Text>no task assigned at the moment </Text>;
  const { task } = useTask(taskId);

  return (
    <Table>
      <Tbody>
        <Tr>
          <Td>Current task</Td>
          <Td>{task.title}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

type Action =
  | { type: 'setSize'; size: number }
  | { type: 'setTimeStart'; timeStart: number }
  | { type: 'setTimeEnd'; timeEnd: number };

interface State {
  size: number;
  cursorId?: string;
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
  cursorId: undefined,
  timeStart: today,
  timeEnd: get24hPast(today),
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
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

interface TaskRowProps extends TableRowProps {
  taskId: string;
  taskHistoryId: string;
}

const TaskRow: React.FC<TaskRowProps> = (props) => {
  const { t } = useTranslation();
  const { task } = useTask(props.taskId);
  const { taskHistory } = useTaskHistory(props.taskHistoryId);
  return (
    <Tr>
      <Td>{task.title}</Td>
      <Td>{t('full-time', analyzeTime(taskHistory.timeStart))}</Td>
      <Td>{t('full-time', analyzeTime(taskHistory.timeEnd))}</Td>
    </Tr>
  );
};

const Stats: React.FC = () => {
  const { hasTask, task: taskNow, loadState: taskNowLoadState } = useTaskNow();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { timeStart, timeEnd, size, cursorId } = state;
  const { t } = useTranslation();
  const { items: todayHistory, loadState: taskHistoryLoadState } =
    useTaskHistories({ timeStart, timeEnd, size, cursorId });
  const { items: tasks, loadState: tasksLoadState } = useTasks({ size: 9999 });

  const hasEnoughTask = useMemo(() => todayHistory.length >= 2, [todayHistory]);

  const { debugMode, setDebugMode } = useDebugMode();

  const tableLoaded =
    tasksLoadState === LOAD_SUCCESS && taskHistoryLoadState === LOAD_SUCCESS;

  return (
    <Box mt={5} pb={5}>
      <Heading as="h2" size="md">
        {t('statistics-heading')}
      </Heading>
      {taskNowLoadState === LOAD_SUCCESS && (
        <CurrentTaskDisplay taskId={taskNow.id} hasTask={hasTask} />
      )}
      {!hasEnoughTask && <Text>{t('stats-not-sufficient-record')}</Text>}
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
          tasks={{}}
          width={500}
          height={500}
          padding={50}
        />
      )}
      {tableLoaded && (
        <Table>
          <Thead>
            <Tr>
              <Th>{t('stats-task-name')}</Th>
              <Th>{t('stats-task-start-time')}</Th>
              <Th>{t('stats-task-end-time')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todayHistory.map((hist, i) => (
              <TaskRow key={i} taskId={hist.taskId} taskHistoryId={hist.id} />
            ))}
          </Tbody>
        </Table>
      )}
      <FormControl mt={5}>
        <FormLabel htmlFor="debug-mode">{t('debug-mode')}</FormLabel>
        <Switch
          id="debug-mode"
          onChange={(ev) => {
            if (!ev.target) return;
            setDebugMode(ev.target.checked);
          }}
          isChecked={debugMode}
        />
        <FormHelperText>{t('debug-mode-description')}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default Stats;
