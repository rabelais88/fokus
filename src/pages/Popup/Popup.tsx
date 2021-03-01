import React, { useState } from 'react';
import popupSend from '@/lib/senders/fromPopup';
import { LOAD_LOADING, LOAD_SUCCESS, MSG_CHANGE_COLOR } from '@/constants';
import makeLogger from '@/lib/makeLogger';
import openSettings from '@/lib/openSettings';
import Document from '@/containers/Document';
import { PopupLayout } from '@/containers/layout';
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import useTaskNow from '@/lib/swr/useTaskNow';
import useTaskHistory from '@/lib/swr/useTaskHistory';
import Suggestion from '@/components/Suggestion';
import storage from '@/lib/storage';
import startTask from '@/lib/swr/startTask';
import { STORE_TASKS } from '@/constants/storeKey';
import { makeResult } from '@/lib';

const logger = makeLogger('Popup.jsx');

const Popup = () => {
  const sendMessage = () => {
    popupSend('TEST_MESSAGE');
    popupSend(MSG_CHANGE_COLOR, 'black');
  };

  const { taskNow, hasTask, loadState: taskNowLoadState } = useTaskNow();
  const [keyword, setKeyword] = useState('');

  const TaskSuggestItem: React.FC<SuggestionItemProps> = ({
    id,
    text,
    onItemClick,
  }) => {
    return <Box onClick={() => onItemClick(id, text)}>{text}</Box>;
  };

  const onTaskChange = (taskId: string) => {
    startTask(taskId);
  };

  const onSuggestTasks = async (keyword: string) => {
    const reqTasks = await storage.get<tasksData>(STORE_TASKS);
    const reKeyword = new RegExp(keyword, 'i');
    const matchKeywords = Object.values(reqTasks).filter(
      (task) => reKeyword.test(task.title) || reKeyword.test(task.description)
    );
    const result: any = matchKeywords.map((task) => ({
      key: task.id,
      text: task.title,
    }));
    return makeResult(result);
  };

  return (
    <Document>
      <PopupLayout>
        {taskNowLoadState === LOAD_LOADING && <Text>loading current task</Text>}
        {taskNowLoadState === LOAD_SUCCESS && hasTask && (
          <Stack spacing={4}>
            <Text>{taskNow.title}</Text>
          </Stack>
        )}
        {taskNowLoadState === LOAD_SUCCESS && !hasTask && (
          <Stack>
            <Heading textAlign="center">Hey!</Heading>
            <Text>choose a task before browsing</Text>
            <Suggestion
              keyword={keyword}
              onKeywordChange={(v) => setKeyword}
              itemComponent={TaskSuggestItem}
              loadingComponent={() => <Box>loading...</Box>}
              noResultComponent={() => <Box>no task found</Box>}
              value={''}
              onValueChange={onTaskChange}
              onSuggest={onSuggestTasks}
            />
          </Stack>
        )}
        <Button onClick={openSettings}>open settings</Button>
      </PopupLayout>
    </Document>
  );
};

export default Popup;
