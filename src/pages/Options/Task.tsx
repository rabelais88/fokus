import React from 'react';
import makeLogger from '@/lib/makeLogger';
import { useParams } from 'react-router-dom';

const logger = makeLogger('pages/Options/Task');

const Task: React.FC = (props) => {
  const { taskId } = useParams<{ taskId: string | undefined }>();
  const isNewTask = !taskId;

  return <form></form>;
};

export default Task;
