/**
 * @description
 * this only works for backgrouds.html
 */
const makeBlobUrl = (data: any, filename: string) => {
  if (!data) throw Error('lib/saveJson - must provide data');
  const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename });
};

export default makeBlobUrl;
