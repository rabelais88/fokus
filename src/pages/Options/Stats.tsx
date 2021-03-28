import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import DailyTask from '@/components/chart/DailyTask';

const Stats: React.FC = () => {
  const { taskHistory, noTaskHistory, loadState } = useTaskHistory();
  return (
    <Box>
      <Box>
        <Heading>Daily Task</Heading>
        <DailyTask taskHistory={taskHistory} width={500} height={500} />
      </Box>
    </Box>
  );
};

export default Stats;
