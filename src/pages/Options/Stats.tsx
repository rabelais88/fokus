import React from 'react';
import { Box, Heading, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import DailyTask from '@/components/chart/DailyTask';
import useTaskNow from '@/lib/swr/useTaskNow';
import { LOAD_SUCCESS, STORE_TASKS } from '@/constants';
import useTasks from '@/lib/useTasks';
import storage from '@/lib/storage';

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

  return (
    <Box>
      <Box mt={5}>
        <Heading as="h2" size="md">
          Statistics
        </Heading>
        {taskNowLoadState === LOAD_SUCCESS && (
          <CurrentTaskDisplay taskNow={taskNow} hasTask={hasTask} />
        )}
        <DailyTask
          history={taskHistory}
          tasks={tasksById}
          width={500}
          height={500}
          padding={35}
        />
      </Box>
    </Box>
  );
};

export default Stats;
