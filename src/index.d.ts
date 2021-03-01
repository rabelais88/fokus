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
  maxDuration: number;
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

type resolvable<T = any> = resolved<T> | rejected<T>;

interface SuggestionItemProps {
  id: string;
  text: string;
  onItemClick: (id: string, text: string) => void;
  selected: boolean;
}

interface SuggestionProps<T = any> {
  onSuggest: (keyword: string) => Promise<resolvable<T>>;
  keyword: string;
  value: string;
  onValueChange: (keyword: string) => void;
  onKeywordChange: (keyword: string) => void;
  itemComponent: React.FC<SuggestionItemProps>;
  loadingComponent: React.FC;
  noResultComponent: React.FC;
}

interface SuggestionMultipleProps<T = any> {
  onSuggest: (keyword: string) => Promise<resolvable<T>>;
  keyword: string;
  value: string[];
  onValueChange: (keyword: string[]) => void;
  onKeywordChange: (keyword: string) => void;
  itemComponent: React.FC<SuggestionItemProps>;
  loadingComponent: React.FC;
  noResultComponent: React.FC;
  hideSelected?: boolean;
}
