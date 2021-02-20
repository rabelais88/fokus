import { isDevEnv } from './env';
import storageProd from './storageProd';
import storageDev from './storageDev';

export default isDevEnv ? storageDev : storageProd;
