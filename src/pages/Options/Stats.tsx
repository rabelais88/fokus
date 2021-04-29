import React, { useMemo } from 'react';
import { Box, Heading, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import DailyTask from '@/components/chart/DailyTask';
import useTaskNow from '@/lib/swr/useTaskNow';
import { LOAD_SUCCESS, STORE_TASKS } from '@/constants';
import useTasks from '@/lib/useTasks';
import analyzeTime from '@/lib/analyzeTime';

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

const Stats: React.FC = () => {
  const {
    taskHistory,
    noTaskHistory,
    loadState: taskHistoryLoadState,
  } = useTaskHistory();
  const { hasTask, taskNow, loadState: taskNowLoadState } = useTaskNow();
  const { tasksById, loadState: tasksLoadState } = useTasks();

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
      </Box>
    </Box>
  );
};

export default Stats;
