import { STORE_TASK_HISTORY } from '@/constants/storeKey';
import { startTask as _startTask } from '@/lib/controller/task';
import { mutate } from 'swr';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('lib/swr/startTask');
const startTask = async (taskId: string) => {
  const req = await _startTask(taskId);
  logger({ req });
  if (req.error) {
    return req;
  }

  mutate(STORE_TASK_HISTORY, req.result);
  return req;
};

export default startTask;
