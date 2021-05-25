import React, { useMemo, useState } from 'react';
import popupSend from '@/lib/senders/fromPopup';
import { LOAD_LOADING, LOAD_SUCCESS, MSG_CHANGE_COLOR } from '@/constants';
import makeLogger from '@/lib/makeLogger';
import openSettings from '@/lib/openSettings';
import Document from '@/containers/Document';
import { PopupLayout } from '@/containers/layout';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import useTaskNow from '@/lib/swr/useTaskNow';
import useTasks from '@/lib/useTasks';
import storage from '@/lib/storage';
import startTask from '@/lib/swr/startTask';
import { STORE_TASKS } from '@/constants/storeKey';
import { analyzeTime, makeResult } from '@/lib';
import endTask from '@/lib/swr/endTask';
import { Trans, useTranslation } from 'react-i18next';
import AutoComplete from '@/components/AutoComplete';
import { CheckIcon, SettingsIcon, SmallCloseIcon } from '@chakra-ui/icons';
import Emote from '@/components/Emote';
import useNow from '@/lib/useNow';
import getTimeDiff from '@/lib/getTimeDiff';
import { TIME_MINUTE } from '@/constants';

const logger = makeLogger('Popup.jsx');

const Popup = () => {
  const { taskNow, hasTask, loadState: taskNowLoadState } = useTaskNow();
  const { tasksCount, loadState: tasksLoadState } = useTasks();
  const { timestampNow } = useNow();
  const { t } = useTranslation();
  const startDiff = useMemo(
    () => getTimeDiff(timestampNow, taskNow.timeStart),
    [taskNow, timestampNow]
  );
  1e3;
  const remainingTime = useMemo(
    () =>
      getTimeDiff(
        timestampNow,
        taskNow.timeStart + taskNow.maxDuration * TIME_MINUTE
      ),
    [taskNow, timestampNow]
  );

  const onTaskChange = (taskId: string) => {
    startTask(taskId);
  };

  const onSuggestTasks = async (keyword: string) => {
    const reqTasks = await storage.get(STORE_TASKS);
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

  const hasTimeLimit = useMemo(() => taskNow.maxDuration > 0, [taskNow]);

  return (
    <Document>
      <PopupLayout>
        <VStack spacing={6}>
          {taskNowLoadState === LOAD_LOADING && (
            <Text>loading current task</Text>
          )}
          {taskNowLoadState === LOAD_SUCCESS && hasTask && (
            <>
              <VStack
                backgroundColor="teal"
                color="white"
                mb={5}
                w="100%"
                boxSizing="border-box"
                pt={3}
                pb={3}
                borderRadius={3}
              >
                <Heading size="sm">Current Task</Heading>
                <HStack>
                  {taskNow.emojiId !== '' && (
                    <Emote emoji={taskNow.emojiId} size={32} />
                  )}
                  <Heading size="md" isTruncated>
                    {taskNow.title}
                  </Heading>
                </HStack>
                <Heading size="sm">
                  {t('hour-minute', startDiff)} since start
                </Heading>
                {hasTimeLimit && (
                  <Heading size="sm">
                    {t('hour-minute', remainingTime)} remaining
                  </Heading>
                )}
              </VStack>
              <ButtonGroup isAttached variant="outline" size="sm">
                <Button
                  colorScheme="teal"
                  onClick={() => onFinishTask()}
                  leftIcon={<CheckIcon />}
                >
                  <Trans>finish-task</Trans>
                </Button>
                <Button
                  onClick={() => onCancelTask()}
                  leftIcon={<SmallCloseIcon />}
                >
                  <Trans>cancel-task</Trans>
                </Button>
              </ButtonGroup>
            </>
          )}
          {taskNowLoadState === LOAD_SUCCESS &&
            tasksLoadState === LOAD_SUCCESS &&
            !hasTask &&
            tasksCount >= 1 && (
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
          {tasksCount === 0 && tasksLoadState === LOAD_SUCCESS && (
            <Box>
              <Text>
                no tasks detected!
                <br />
                add new task from settings page
              </Text>
            </Box>
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
