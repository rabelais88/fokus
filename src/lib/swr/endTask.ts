import { STORE_TASKS, STORE_TASK_HISTORY } from '@/constants/storeKey';
import { endTask as _endTask } from '@/lib/controller/task';
import { mutate } from 'swr';
import makeLogger from '@/lib/makeLogger';
const logger = makeLogger('lib/swr/endTask');

const endTask = async () => {
  const reqHistory = await _endTask();
  logger({ reqHistory });
  if (reqHistory.error) return reqHistory;

  mutate(STORE_TASK_HISTORY, reqHistory.result);
  logger('taskHistoryModified', reqHistory.result);
  return reqHistory;
};

export default endTask;
