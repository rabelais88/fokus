const getCurrentTab = (): Promise<chrome.tabs.Tab | undefined> =>
  new Promise((resolve, reject) => {
    chrome.tabs.getCurrent((tab) => resolve(tab));
  });

const changeCurrentTab = (url: string) =>
  new Promise(async (resolve, reject) => {
    const currentTab = await getCurrentTab();
    if (currentTab?.id === undefined) {
      reject();
      return;
    }
    chrome.tabs.update(currentTab.id, { url }, (tab) => {
      resolve(undefined);
    });
  });

export default changeCurrentTab;
