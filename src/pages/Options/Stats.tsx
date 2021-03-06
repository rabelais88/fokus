import AutoComplete from '@/components/AutoComplete';
import DailyTask from '@/components/chart/DailyTask';
import DatePicker from '@/components/DatePicker';
import Emote from '@/components/Emote';
import { LOAD_SUCCESS } from '@/constants';
import i18n, { availableLanguages } from '@/i18n';
import { makeResult } from '@/lib';
import analyzeTime from '@/lib/analyzeTime';
import changeCurrentTab from '@/lib/changeCurrentTab';
import { MiscContext } from '@/lib/context/MiscContext';
import { setDebugMode } from '@/lib/controller';
import getSettingsUrl from '@/lib/getSettingsUrl';
import miscStorage from '@/lib/miscStorage';
import useDebugMode from '@/lib/swr/useDebugMode';
import useTask from '@/lib/swr/useTask';
import useTaskHistories from '@/lib/swr/useTaskHistories';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import useTaskNow from '@/lib/swr/useTaskNow';
import useLogger from '@/lib/useLogger';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Spinner,
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
import dayjs from 'dayjs';
import React, {
  Reducer,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';

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
  const {
    task,
    loadState: taskLoadState,
    revalidate: taskRevalidate,
  } = useTask(props.taskId);
  const {
    taskHistory,
    loadState: taskHistoryLoadState,
    revalidate: taskHistoryRevalidate,
  } = useTaskHistory(props.taskHistoryId);

  const { state } = useContext(MiscContext);
  useEffect(() => {
    taskRevalidate();
    taskHistoryRevalidate();
  }, [state.validId]);

  const hasFinished = taskHistory.timeEnd !== -1;
  if (taskLoadState !== LOAD_SUCCESS || taskHistoryLoadState !== LOAD_SUCCESS) {
    return (
      <Tr data-task-id={props.taskId}>
        <Td col={3}>
          <Spinner />
        </Td>
      </Tr>
    );
  }
  return (
    <Tr>
      <Td>{task.title}</Td>
      <Td>{t('full-time', analyzeTime(taskHistory.timeStart))}</Td>
      <Td>
        {hasFinished && (
          <span>{t('full-time', analyzeTime(taskHistory.timeEnd))}</span>
        )}
        {!hasFinished && <span>-</span>}
      </Td>
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

  const hasEnoughTask = useMemo(() => todayHistory.length >= 2, [todayHistory]);

  const { debugMode } = useDebugMode();

  const tableLoaded = taskHistoryLoadState === LOAD_SUCCESS;
  const logger = useLogger('pages/Options/Stats.tsx');
  logger({ todayHistory });

  const onRestartTutorial = async () => {
    await miscStorage.set('skipTutorial', false);
    changeCurrentTab(getSettingsUrl());
  };

  const suggestLanguages = async (keyword: string) => {
    const re = new RegExp(keyword, 'i');
    const langs = availableLanguages
      .map((key) => ({
        key,
        text: t(`lang-${key}`),
      }))
      .filter(({ text }) => re.test(text));

    return makeResult(langs);
  };

  const setLanguage = async (key: string) => {
    await i18n.changeLanguage(key);
    changeCurrentTab(getSettingsUrl());
  };

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
        <Emote emoji="mag" size={14} />
        <Text>{t('stats--time-scope')}</Text>
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
        <Text>-</Text>
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
      {false && (
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
          defaultChecked={debugMode}
        />
        <FormHelperText>{t('debug-mode-description')}</FormHelperText>
      </FormControl>
      <FormControl mt={5}>
        <FormLabel htmlFor="btn-restart-tutorial">
          {t('restart-tutorial')}
        </FormLabel>
        <Button name="btn-restart-tutorial" onClick={onRestartTutorial}>
          {t('restart-tutorial')}
        </Button>
        <FormHelperText>{t('restart-tutorial-description')}</FormHelperText>
      </FormControl>
      <FormControl mt={5}>
        <FormLabel htmlFor="language">{t('language')}</FormLabel>
        <AutoComplete onSuggest={suggestLanguages} onChange={setLanguage} />
        <FormHelperText>
          <Trans
            i18nKey={'lang-current'}
            values={[t(`lang-${i18n.language}`)]}
          />
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default Stats;
