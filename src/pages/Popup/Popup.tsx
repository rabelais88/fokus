import React, { useState } from 'react';
import popupSend from '@/lib/senders/fromPopup';
import { LOAD_LOADING, LOAD_SUCCESS, MSG_CHANGE_COLOR } from '@/constants';
import makeLogger from '@/lib/makeLogger';
import openSettings from '@/lib/openSettings';
import Document from '@/containers/Document';
import { PopupLayout } from '@/containers/layout';
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import useTaskNow from '@/lib/swr/useTaskNow';
import storage from '@/lib/storage';
import startTask from '@/lib/swr/startTask';
import { STORE_TASKS } from '@/constants/storeKey';
import { makeResult } from '@/lib';
import endTask from '@/lib/swr/endTask';
import { Trans } from 'react-i18next';
import AutoComplete from '@/components/AutoComplete';

const logger = makeLogger('Popup.jsx');

const Popup = () => {
  const sendMessage = () => {
    popupSend('TEST_MESSAGE');
    popupSend(MSG_CHANGE_COLOR, 'black');
  };

  const { taskNow, hasTask, loadState: taskNowLoadState } = useTaskNow();

  const onTaskChange = (taskId: string) => {
    startTask(taskId);
  };

  const onSuggestTasks = async (keyword: string) => {
    const reqTasks = await storage.get<tasksData>(STORE_TASKS);
    const reKeyword = new RegExp(keyword, 'i');
    const matchKeywords = Object.values<taskData>(reqTasks).filter(
      (task) => reKeyword.test(task.title) || reKeyword.test(task.description)
    );
    const result: any = matchKeywords.map((task) => ({
      key: task.id,
      text: task.title,
    }));
    return makeResult(result);
  };

  logger({ taskNow, hasTask, taskNowLoadState });

  const onFinishTask = () => {
    endTask();
  };

  const onCancelTask = () => {};

  return (
    <Document>
      <PopupLayout>
        {taskNowLoadState === LOAD_LOADING && <Text>loading current task</Text>}
        {taskNowLoadState === LOAD_SUCCESS && hasTask && (
          <Stack spacing={4}>
            <Text>{taskNow.title}</Text>
            <Button onClick={() => onFinishTask()}>
              <Trans>finish-task</Trans>
            </Button>
            <Button onClick={() => onCancelTask()}>
              <Trans>cancel-task</Trans>
            </Button>
          </Stack>
        )}
        {taskNowLoadState === LOAD_SUCCESS && !hasTask && (
          <Stack>
            <Heading textAlign="center">
              <Trans>no-task-heading</Trans>
            </Heading>
            <Text>
              <Trans>no-task-text</Trans>
            </Text>
            <AutoComplete onSuggest={onSuggestTasks} onChange={onTaskChange} />
          </Stack>
        )}
        <Button onClick={() => openSettings()}>
          <Trans>open-settings</Trans>
        </Button>
      </PopupLayout>
    </Document>
  );
};

export default Popup;
