import makeLogger from '../makeLogger';

const logger = makeLogger('popupSend');
const popupSend = (code = 'NO_CODE', data?: any) => {
  logger('message sent', code);
  let message: chromeMessage;
  if (data) message = { code, data };
  else message = { code };
  chrome.runtime.sendMessage(message, function (response) {
    logger('response of message', response);

    // response.farewell
  });
};

export default popupSend;
