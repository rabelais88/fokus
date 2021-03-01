import { STORE_TASK_HISTORY } from '@/constants/storeKey';
import { endTask as _endTask } from '@/lib/controller/task';
import { mutate } from 'swr';

const endTask = async () => {
  const req = await _endTask();
  if (req.error) return req;

  mutate(STORE_TASK_HISTORY, req.result);
  return req;
};

export default endTask;
