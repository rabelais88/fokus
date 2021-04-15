const checkChromeUrl = (url: string) =>
  new RegExp('^chrome.*://', 'i').test(url);

export default checkChromeUrl;
