import strToRangedNumber from './strToRangedNumber';
import { getDebugMode } from '@/lib/controller';

const colors = [
  '#264653',
  '#2a9d8f',
  '#e9c46a',
  '#f4a261',
  '#e76f51',
  '#606c38',
];

interface consoleInterface {
  (...arg: any[]): void;
}

const makeLogger = (
  loggerName: string,
  forceDebugMode: boolean = false
): consoleInterface => {
  const colorIndex = strToRangedNumber(loggerName, colors.length);
  const color = colors[colorIndex];
  const colorStyle = `color: ${color};`;
  return async (...args: any[]) => {
    if (!(await getDebugMode()) && forceDebugMode === false) return;
    return console.log(`%c${loggerName}:`, colorStyle, ...args);
  };
};

export default makeLogger;
