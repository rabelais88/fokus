import AutoComplete from '@/components/AutoComplete';
import Emote from '@/components/Emote';
import { LOAD_LOADING, LOAD_SUCCESS, TIME_MINUTE } from '@/constants';
import Document from '@/containers/Document';
import { PopupLayout } from '@/containers/layout';
import { makeResult } from '@/lib';
import { searchTaskTitle } from '@/lib/controller/task';
import getTimeDiff from '@/lib/getTimeDiff';
import makeLogger from '@/lib/makeLogger';
import openSettings from '@/lib/openSettings';
import useTaskNow from '@/lib/swr/useTaskNow';
import useTasks from '@/lib/swr/useTasks';
import useNow from '@/lib/useNow';
import { CheckIcon, SettingsIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const logger = makeLogger('Popup.jsx');

const Popup = () => {
  const {
    task: taskNow,
    taskHistory: taskHistoryNow,
    hasTask,
    loadState: taskNowLoadState,
    startTask,
    endTask,
  } = useTaskNow();
  const { count: tasksCount, loadState: tasksLoadState } = useTasks({});
  const { timestampNow } = useNow();
  const { t } = useTranslation();
  const startDiff = useMemo(
    () => getTimeDiff(timestampNow, taskHistoryNow.timeStart),
    [taskNow, timestampNow]
  );
  1e3;
  const remainingTime = useMemo(
    () =>
      getTimeDiff(
        timestampNow,
        taskHistoryNow.timeStart + taskNow.maxDuration * TIME_MINUTE
      ),
    [taskNow, timestampNow]
  );

  const onTaskChange = (taskId: string) => {
    startTask(taskId);
  };

  const onSuggestTasks = async (keyword: string) => {
    const reqTasks = await searchTaskTitle(keyword).getAll({ size: 50 });
    const result: any = reqTasks.items.map((task) => ({
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
                <Heading size="sm">{t('popup--current-task')}</Heading>
                <HStack>
                  {taskNow.emojiId !== '' && (
                    <Emote emoji={taskNow.emojiId} size={32} />
                  )}
                  <Heading size="md" isTruncated>
                    {taskNow.title}
                  </Heading>
                </HStack>
                <Heading size="sm">
                  {t('popup--task-duration', {
                    duration: t('hour-minute', startDiff),
                  })}
                </Heading>
                {hasTimeLimit && (
                  <Heading size="sm">
                    {t('popup--remaining-time', {
                      remainingTime: t('hour-minute', remainingTime),
                    })}
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
                <Trans
                  i18nKey="popup--no-task"
                  components={{ lineBreak: <br /> }}
                />
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
