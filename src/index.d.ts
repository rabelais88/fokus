interface onStorageChange {
  (changes: object, areaName: string): void;
}

interface defaultChromeMessage {
  code: string;
}

interface defaultChromeMessageWithData extends defaultChromeMessage {
  data: any;
}

interface msgColorChange {
  code: 'MSG_CHANGE_COLOR';
  color: string;
}

type chromeMessage =
  | defaultChromeMessage
  | defaultChromeMessageWithData
  | msgColorChange;

interface websiteData {
  id: string;
  title: string;
  description: string;
  urlRegex: string;
  urlMode: 'URL_MODE_TEXT' | 'URL_MODE_REGEX';
}

interface websitesData {
  [key: string]: websiteData;
}

// stores order of website ids
type websitesIndex = string[];

interface taskData {
  id: string;
  title: string;
  description: string;
  blockedSiteIds: string[];
  allowedSiteIds: string[];
}
interface tasksData {
  [key: string]: taskData;
}

type tasksIndex = string[];

interface resolved<T = any> {
  result: T;
  error: null;
  errorCode: '';
}

interface rejected<T = any> {
  result: null;
  error: T;
  errorCode: string;
}

type resolvable = resolved | rejected;

interface suggest {
  <T>(keyword: string): Promise<T>;
}
