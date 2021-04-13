import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  URL_MODE_TEXT,
} from '../../constants';
import * as fromBackground from './fromBackground';
import getTaskInfo from '../getTaskInfo';
jest.mock('./fromBackground');
jest.mock('../getTaskInfo');

describe('fromBackground', () => {
  it('should block the site in allow all sites mode', async () => {
    const blockedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'blockedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_ALLOW_ALL,
      blockedSites: [blockedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    fromBackground.validateUrl = jest.requireActual(
      './fromBackground'
    ).validateUrl;
    const isValid = await fromBackground.validateUrl('blockedsite.test');
    expect(isValid).toEqual(false);
  });

  it('should allow the site in allow all sites mode', async () => {
    const blockedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'blockedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_ALLOW_ALL,
      blockedSites: [blockedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    fromBackground.validateUrl = jest.requireActual(
      './fromBackground'
    ).validateUrl;
    const isValid = await fromBackground.validateUrl('allowedsite.test');
    expect(isValid).toEqual(true);
  });
  it('should block the site in block all sites mode', async () => {
    const allowedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'allowedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_BLOCK_ALL,
      allowedSites: [allowedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    fromBackground.validateUrl = jest.requireActual(
      './fromBackground'
    ).validateUrl;
    const isValid = await fromBackground.validateUrl('blockedsite.test');
    expect(isValid).toEqual(false);
  });
  it('should allow the site in block all sites mode', async () => {
    const allowedSite = {
      urlMode: URL_MODE_TEXT,
      urlRegex: 'allowedsite.test',
    };
    const testData = {
      blockMode: BLOCK_MODE_BLOCK_ALL,
      allowedSites: [allowedSite],
    };
    getTaskInfo.mockImplementation(() => Promise.resolve(testData));
    fromBackground.validateUrl = jest.requireActual(
      './fromBackground'
    ).validateUrl;
    const isValid = await fromBackground.validateUrl('allowedsite.test');
    expect(isValid).toEqual(true);
  });
});
