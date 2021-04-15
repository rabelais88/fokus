import React from 'react';
import { Box, Heading, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import DailyTask from '@/components/chart/DailyTask';
import useTaskNow from '@/lib/swr/useTaskNow';
import { LOAD_SUCCESS } from '@/constants';


type CurrentTaskDisplayArg = {
  taskNow: taskNowType
  hasTask: boolean
}
const CurrentTaskDisplay: React.FC<CurrentTaskDisplayArg> = ({ taskNow, hasTask }) => {
  if (!hasTask) return <Text>no task assigned at the moment </Text>

  return <Table>
    <Tbody>
      <Tr>
        <Td>Current task</Td>
        <Td>{taskNow.title}</Td>
      </Tr>
    </Tbody>
  </Table>
}

const Stats: React.FC = () => {
  const { taskHistory, noTaskHistory, loadState: taskHistoryLoadState } = useTaskHistory();
  const { hasTask, taskNow, loadState: taskNowLoadState } = useTaskNow();
  return (
    <Box>
      <Box mt={5}>
        <Heading as="h2" size="md">
          Statistics
        </Heading>
        {taskNowLoadState === LOAD_SUCCESS && <CurrentTaskDisplay taskNow={taskNow} hasTask={hasTask} />}
        <DailyTask taskHistory={taskHistory} width={500} height={500} />
      </Box>
    </Box>
  );
};

export default Stats;
