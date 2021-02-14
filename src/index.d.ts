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
