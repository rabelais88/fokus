import React, { useState } from 'react';
import makeLogger from '@/lib/makeLogger';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useQuery from '@/lib/useQuery';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import useTask from '@/lib/useTask';

const logger = makeLogger('pages/Options/Task');

const Task: React.FC = (props) => {
  const { taskId } = useParams<{ taskId: string | undefined }>();
  const isNewTask = !taskId;

  const { handleSubmit, errors, register } = useForm();
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const {
    task = {
      title: '',
      description: '',
      blockedSiteIds: [],
      allowedSiteIds: [],
    },
    loadState,
  } = useTask(taskId || '');

  const onSubmit = (taskData: taskData) => {
    logger('onSubmit', taskData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl
          isRequired
          isInvalid={errors.title}
          id="task-name"
          mt="30px"
        >
          <FormLabel htmlFor="title">Name of task</FormLabel>
          <Input
            name="title"
            placeholder="name"
            defaultValue={query.get('title') || task.title}
            ref={register({ required: true })}
          />
          <FormErrorMessage>
            {errors.title && 'task name is required'}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="task-description">
          <FormLabel htmlFor="description">description</FormLabel>
          <Input
            name="description"
            placeholder="description"
            defaultValue={task.description}
            ref={register}
          />
        </FormControl>
        {isNewTask && (
          <Button type="submit" isLoading={loading} variant="solid">
            Add
          </Button>
        )}
        {!isNewTask && (
          <Button type="submit" isLoading={loading} variant="solid">
            Edit
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default Task;
