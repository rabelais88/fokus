import listenFromContent from '@/lib/listeners/fromContent';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('Content/index.js');

logger('Content script works!');
logger('Must reload extension for modifications to take effect.');

listenFromContent();
