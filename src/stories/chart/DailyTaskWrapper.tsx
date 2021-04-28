import React from 'react';
import DailyTask from '@/components/chart/DailyTask';
import { BLOCK_MODE_ALLOW_ALL } from '@/constants';

const DailyTaskWrapper = () => {
  return (
    <DailyTask
      width={500}
      height={500}
      padding={20}
      history={[
        {
          timeStart: new Date('2020-01-01 08:00').getTime(),
          timeEnd: new Date('2020-01-01 10:00').getTime(),
          taskId: 'task1',
        },
        {
          timeStart: new Date('2020-01-01 22:00').getTime(),
          timeEnd: -1,
          taskId: 'task2',
        },
      ]}
      tasks={{
        task1: {
          id: 'task1',
          emojiId: 'smile',
          title: 'my first task',
          description: 'this is my first task',
          blockedSiteIds: [],
          allowedSiteIds: [],
          blockMode: BLOCK_MODE_ALLOW_ALL,
          maxDuration: 0,
        },
        task2: {
          id: 'task1',
          emojiId: 'coffee',
          title: 'my second task',
          description: 'this is my second task',
          blockedSiteIds: [],
          allowedSiteIds: [],
          blockMode: BLOCK_MODE_ALLOW_ALL,
          maxDuration: 0,
        },
      }}
    />
  );
};

export default DailyTaskWrapper;
