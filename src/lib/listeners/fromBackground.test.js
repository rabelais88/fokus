import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  URL_MODE_REGEX,
  URL_MODE_TEXT,
} from '../../constants';
import * as fromBackground from './fromBackground';
import getTaskInfo from '../getTaskInfo';
jest.mock('./fromBackground');
jest.mock('../getTaskInfo');

describe('fromBackground', () => {
  beforeAll(() => {
    fromBackground.validateUrl = jest.requireActual(
      './fromBackground'
    ).validateUrl;
    fromBackground.matchUrlRegex = jest.requireActual(
      './fromBackground'
    ).matchUrlRegex;
  });
  it('block a site in allow-all + plain url', async () => {
    const blockedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'blockedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_ALLOW_ALL,
      blockedSites: [blockedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('blockedsite.test');
    expect(isValid).toEqual(false);
  });

  it('allow a site in allow-all + plain url', async () => {
    const blockedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'blockedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_ALLOW_ALL,
      blockedSites: [blockedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('allowedsite.test');
    expect(isValid).toEqual(true);
  });
  it('block a site in block-all + plain url', async () => {
    const allowedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'allowedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_BLOCK_ALL,
      allowedSites: [allowedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('blockedsite.test');
    expect(isValid).toEqual(false);
  });
  it('allow a site in block-all + plain url', async () => {
    const allowedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'allowedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_BLOCK_ALL,
      allowedSites: [allowedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('allowedsite.test');
    expect(isValid).toEqual(true);
  });
});
