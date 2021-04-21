import React, { useState } from 'react';
import popupSend from '@/lib/senders/fromPopup';
import { LOAD_LOADING, LOAD_SUCCESS, MSG_CHANGE_COLOR } from '@/constants';
import makeLogger from '@/lib/makeLogger';
import openSettings from '@/lib/openSettings';
import Document from '@/containers/Document';
import { PopupLayout } from '@/containers/layout';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import useTaskNow from '@/lib/swr/useTaskNow';
import storage from '@/lib/storage';
import startTask from '@/lib/swr/startTask';
import { STORE_TASKS } from '@/constants/storeKey';
import { makeResult } from '@/lib';
import endTask from '@/lib/swr/endTask';
import { Trans } from 'react-i18next';
import AutoComplete from '@/components/AutoComplete';
import { CheckIcon, SettingsIcon, SmallCloseIcon } from '@chakra-ui/icons';

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
        <VStack spacing={2}>
          {taskNowLoadState === LOAD_LOADING && (
            <Text>loading current task</Text>
          )}
          {taskNowLoadState === LOAD_SUCCESS && hasTask && (
            <>
              <Heading>{taskNow.title}</Heading>
              <HStack>
                <Button onClick={() => onFinishTask()} leftIcon={<CheckIcon />}>
                  <Trans>finish-task</Trans>
                </Button>
                <Button
                  onClick={() => onCancelTask()}
                  leftIcon={<SmallCloseIcon />}
                >
                  <Trans>cancel-task</Trans>
                </Button>
              </HStack>
            </>
          )}
          {taskNowLoadState === LOAD_SUCCESS && !hasTask && (
            <>
              <Heading textAlign="center">
                <Trans>no-task-heading</Trans>
              </Heading>
              <Text>
                <Trans>no-task-text</Trans>
              </Text>
              <AutoComplete
                onSuggest={onSuggestTasks}
                onChange={onTaskChange}
              />
            </>
          )}
          <Button onClick={() => openSettings()} leftIcon={<SettingsIcon />}>
            <Trans>open-settings</Trans>
          </Button>
        </VStack>
      </PopupLayout>
    </Document>
  );
};

export default Popup;
