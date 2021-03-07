import React from 'react';
import DailyTask from '@/components/chart/DailyTask';

const DailyTaskWrapper = () => {
  return (
    <DailyTask
      width={500}
      height={500}
      taskHistory={[
        { timeStart: 1000, timeEnd: 3000, taskId: 'ewjkflsjfkl' },
        { timeStart: 3500, timeEnd: -1, taskId: 'ewjkflsjfkl' },
      ]}
    />
  );
};

export default DailyTaskWrapper;
