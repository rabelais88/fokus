import makeLogger from '../makeLogger';

const logger = makeLogger('backgroundSend');
// to content script(tab)
const backgroundSend = (code = 'NO_CODE') => {
  logger('message sent', code);
  const tabQuery = {};
  // for active ones only: { active: true, currentWindow: true }
  chrome.tabs.query(tabQuery, function (tabs) {
    if (tabs.length === 0) return null;
    const [activeTab] = tabs;
    const activeTabId = activeTab.id || 0;
    const message = { code };
    const responseHandler = (resp: any) => logger(resp);
    // to silence error
    chrome.tabs.sendMessage(activeTabId, message, responseHandler);
  });
};

export default backgroundSend;
