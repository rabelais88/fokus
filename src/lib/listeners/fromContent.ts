import makeLogger from '../makeLogger';

const logger = makeLogger('listenFromContent');

const onListen = async (
  message: chromeMessage,
  sender: chrome.runtime.MessageSender,
  reply: (response: any) => void
) => {
  // currently unused
};

// listen from content
const listenFromContent = () => {
  logger('listening...');
  chrome.runtime.onMessage.addListener(onListen);

  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
  // chrome.tabs.onUpdated.addListener()
  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onCreated
  // chrome.tabs.onCreated.addListener()
};

export default listenFromContent;
