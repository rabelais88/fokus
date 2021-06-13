import { NavLink } from '@/components';
import Emote from '@/components/Emote';
import {
  ACTION_HIDE_MODAL,
  ACTION_SHOW_MODAL,
  LOAD_SUCCESS,
} from '@/constants';
import { MiscContext } from '@/lib/context/MiscContext';
import { ModalContext } from '@/lib/context/ModalContext';
import { removeTask } from '@/lib/controller/task';
import useTaskNow from '@/lib/swr/useTaskNow';
import useTasks from '@/lib/swr/useTasks';
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ModalBody,
  ModalFooter,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface taskItemProps {
  task: taskData;
  taskIdNow: string;
  onRemoveTask: Function;
}
const TaskItem: React.FC<taskItemProps> = ({
  task,
  taskIdNow,
  onRemoveTask,
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      key={task.id}
      data-task-id={task.id}
      aria-label="task-item"
      justifyContent="space-between"
    >
      <NavLink to={`/task/${task.id}`}>
        <HStack>
          {task.emojiId !== '' && <Emote emoji={task.emojiId} size={24} />}
          <Text>
            {task.title}
            {taskIdNow === task.id && (
              <Badge size="sm" variant="solid" colorScheme="teal" ml={5}>
                {t('tasks--active-task-badge')}
              </Badge>
            )}
          </Text>
        </HStack>
      </NavLink>
      <CloseButton onClick={() => onRemoveTask(task.id, task.title)} />
    </Flex>
  );
};

const Tasks: React.FC = (props) => {
  const [keyword, setKeyword] = useState('');
  const {
    items: tasks,
    loadState,
    count,
    revalidate: revalidateTasks,
  } = useTasks({ title: keyword });
  const noTask = count === 0;
  const { task: taskNow } = useTaskNow();
  const taskIdNow = (taskNow || {}).id;

  const hasKeyword = keyword.length >= 1;
  const { dispatch: dispatchOnModal } = useContext(ModalContext);
  const { state } = useContext(MiscContext);

  const onRemoveTask = (taskId: string, taskTitle: string) => {
    const onRemoveTaskConfirm = () => {
      removeTask(taskId);
      revalidateTasks();
      dispatchOnModal({ type: ACTION_HIDE_MODAL });
    };
    const ModalContent = (
      <>
        <ModalBody pb={6}>
          <Trans
            i18nKey="modal--remove-task-message"
            components={[<b />]}
            values={{ removeTargetTaskName: taskTitle }}
          />
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={onRemoveTaskConfirm}
            >
              {t('modal--remove-task-confirm')}
            </Button>
            <Button
              variant="outline"
              onClick={() => dispatchOnModal({ type: ACTION_HIDE_MODAL })}
            >
              {t('modal--remove-task-cancel')}
            </Button>
          </HStack>
        </ModalFooter>
      </>
    );
    dispatchOnModal({ type: ACTION_SHOW_MODAL, content: ModalContent });
  };

  useEffect(() => {
    revalidateTasks();
  }, [state.validId]);

  const taskAddable = noTask || keyword === '';
  const { t } = useTranslation();

  return (
    <Box>
      <InputGroup>
        <InputLeftElement children={<SearchIcon />} />
        <Input
          data-intro--tasks--search-box
          placeholder={t('tasks--task-find-placeholder')}
          variant="flushed"
          value={keyword}
          onChange={(ev) => setKeyword(ev.target.value)}
          key="task-search-keyword"
        />
        <InputRightElement>
          {taskAddable && (
            <NavLink to={keyword === '' ? '/task' : `task?title=${keyword}`}>
              <Tooltip label={t('add-new-task')}>
                <IconButton
                  data-intro--tasks--btn-add
                  icon={<AddIcon />}
                  size="sm"
                  aria-label={t('add-new-task')}
                  variant="ghost"
                />
              </Tooltip>
            </NavLink>
          )}
          {hasKeyword && (
            <IconButton
              onClick={() => setKeyword('')}
              icon={<CloseIcon />}
              size="sm"
              aria-label={t('tasks--reset-task-search-keyword')}
              variant="ghost"
            />
          )}
        </InputRightElement>
      </InputGroup>
      <Box height="30px" />
      {loadState !== LOAD_SUCCESS && (
        <Stack>
          <Skeleton height="20px"></Skeleton>
          <Skeleton height="20px"></Skeleton>
          <Skeleton height="20px"></Skeleton>
        </Stack>
      )}
      {loadState === LOAD_SUCCESS && noTask && (
        <Center mt="150">
          <Text>{t('tasks--no-task')}</Text>
        </Center>
      )}
      {loadState === LOAD_SUCCESS && !noTask && (
        <Stack divider={<StackDivider borderColor="gray.200" />} spacing={2}>
          {tasks.map((task) => (
            <TaskItem key={task.id} {...{ taskIdNow, task, onRemoveTask }} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Tasks;
