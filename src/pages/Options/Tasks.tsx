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
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { NavLink } from '@/components';
import { LOAD_SUCCESS } from '@/constants';

const Tasks: React.FC = (props) => {
  const [keyword, setKeyword] = useState('');

  const { tasks, loadState, noTask } = useTasks({ keyword });
  const hasKeyword = keyword.length >= 1;
  return (
    <>
      <Box>
        <InputGroup>
          <InputLeftElement children={<SearchIcon />} />
          <Input
            placeholder="please put the task name here"
            variant="flushed"
            value={keyword}
            onChange={(ev) => setKeyword(ev.target.value)}
            key="task-search-keyword"
          />
          <InputRightElement>
            {noTask && (
              <NavLink to={keyword === '' ? '/task' : `task?title=${keyword}`}>
                <IconButton
                  icon={<AddIcon />}
                  size="sm"
                  aria-label="add new task"
                  variant="ghost"
                />
              </NavLink>
            )}
            {hasKeyword && (
              <IconButton
                onClick={() => setKeyword('')}
                icon={<CloseIcon />}
                size="sm"
                aria-label="reset task search keyword"
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
          <Center mt="150">no tasks found</Center>
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
                <NavLink to={`/task/${task.id}`}>{task.title}</NavLink>
                <CloseButton onClick={() => {}} />
              </Flex>
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Tasks;
