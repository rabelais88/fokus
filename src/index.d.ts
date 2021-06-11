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

type newWebsiteData = Omit<websiteData, 'id'>;

// stores order of website ids
type websitesIndex = string[];

interface taskData {
  id: string;
  emojiId: string;
  title: string;
  description: string;
  blockedSiteIds: string[];
  allowedSiteIds: string[];
  blockMode: 'BLOCK_MODE_BLOCK_ALL' | 'BLOCK_MODE_ALLOW_ALL';
  maxDuration: number;
}

type newTaskData = Omit<taskData, 'id'>;

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

type resolvable<T = any> = resolved<T> | rejected<T>;

interface AutoCompleteProps<T = any> {
  onSuggest: (keyword: string) => Promise<resolvable<T>>;
  onChange: (key: string) => void;
  showSupplement?: boolean;
  onSupplement?: (key: string) => void;
  supplementItem?: { key: string; text: string };
  disabled?: boolean;
}

interface taskHistory {
  id: string;
  timeStart: number;
  timeEnd: number;
  taskId: string;
}

type newTaskHistory = Omit<taskHistory, 'id'>;

type queryType = {
  [key: string]: string;
};

interface paging<V> {
  items: V[];
  count: number;
  hasNext: boolean;
}

interface pagingArg {
  size?: number;
  cursorId?: string;
}

type pagingSearchFunc<V> = (arg: V) => boolean;
type loadStateType =
  | 'LOAD_SUCCESS'
  | 'LOAD_FAIL'
  | 'LOAD_LOADING'
  | 'LOAD_INIT';

type mapAsArray<Type> = {
  [Property in keyof Type]: Type[Property][];
};

type revalidateTypeAlt = () => Promise<boolean>;
// interface openModalFunc {
//   (arg: { type: string; onYes?: () => {}; onNo?: () => {} }): void;
// }

// interface defaultModalState {
//   modalType: string;
//   modalBody: JSX.Element;
//   openModal: openModalFunc;
//   closeModal: () => {};
//   onYes: () => {};
//   onNo: () => {};
// }
