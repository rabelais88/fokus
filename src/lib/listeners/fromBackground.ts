import makeLogger from '../makeLogger';
import sendFromBackground from '../senders/fromBackground';
import { MSG_CHANGE_COLOR } from '../../constants';

const logger = makeLogger('listenFromBackground');
// listen from background
const listenFromBackground = () => {
  logger('listening...');
  chrome.runtime.onMessage.addListener(function (message, sender, reply) {
    logger('onMessage', { message, sender, reply });
    // chrome.runtime.onMessage.removeListener(event);
    sendFromBackground(MSG_CHANGE_COLOR);
    reply({ message: 'hello from background!' });
    // return true;
  });
};

export default listenFromBackground;
