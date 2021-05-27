import React from 'react';
import { useState } from 'react';
import useTasks from '@/lib/useTasks';
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Skeleton,
  Center,
  StackDivider,
  Flex,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  Text,
  Badge,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { NavLink } from '@/components';
import { LOAD_SUCCESS } from '@/constants';
import removeTask from '@/lib/removeTask';
import useTaskNow from '@/lib/swr/useTaskNow';
import Emote from '@/components/Emote';
import { Trans, useTranslation } from 'react-i18next';

const Tasks: React.FC = (props) => {
  const [keyword, setKeyword] = useState('');
  const [removeTargetTaskId, setRemoveTargetTaskId] = useState('');
  const [removeTargetTaskName, setRemoveTargetTaskName] = useState('');

  const { tasks, loadState, noTask } = useTasks({ keyword });
  const { taskNow } = useTaskNow();
  const taskIdNow = (taskNow || {}).id;

  const hasKeyword = keyword.length >= 1;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onRemoveTask = (taskId: string, taskTitle: string) => {
    setRemoveTargetTaskId(taskId);
    setRemoveTargetTaskName(taskTitle);
    onOpen();
  };

  const onRemoveTaskConfirm = () => {
    removeTask(removeTargetTaskId);
    onClose();
  };

  const taskAddable = noTask || keyword === '';
  const { t } = useTranslation();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent>
          <ModalBody>
            <Trans
              i18nKey="modal--remove-task-message"
              components={[<b />]}
              values={{ removeTargetTaskName }}
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
              <Button variant="outline" onClick={onClose}>
                {t('modal--remove-task-cancel')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <InputGroup>
          <InputLeftElement children={<SearchIcon />} />
          <Input
            placeholder={t('tasks--task-find-placeholder')}
            variant="flushed"
            value={keyword}
            onChange={(ev) => setKeyword(ev.target.value)}
            key="task-search-keyword"
          />
          <InputRightElement>
            {taskAddable && (
              <NavLink to={keyword === '' ? '/task' : `task?title=${keyword}`}>
                <Tooltip label="add new task">
                  <IconButton
                    icon={<AddIcon />}
                    size="sm"
                    aria-label="add new task"
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
              <Flex
                key={task.id}
                data-task-id={task.id}
                aria-label="task-item"
                justifyContent="space-between"
              >
                <NavLink to={`/task/${task.id}`}>
                  <HStack>
                    {task.emojiId !== '' && (
                      <Emote emoji={task.emojiId} size={24} />
                    )}
                    <Text>
                      {task.title}
                      {taskIdNow === task.id && (
                        <Badge
                          size="sm"
                          variant="solid"
                          colorScheme="teal"
                          ml={5}
                        >
                          {t('tasks--active-task-badge')}
                        </Badge>
                      )}
                    </Text>
                  </HStack>
                </NavLink>
                <CloseButton
                  onClick={() => onRemoveTask(task.id, task.title)}
                />
              </Flex>
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Tasks;
