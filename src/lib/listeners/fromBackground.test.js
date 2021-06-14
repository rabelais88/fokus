import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  URL_MODE_REGEX,
  URL_MODE_TEXT,
} from '../../constants';
import * as fromBackground from './fromBackground';
import * as taskController from '@/lib/controller/task';
import * as siteController from '@/lib/controller/site';
jest.mock('./fromBackground');
jest.mock('@/lib/controller/task');
jest.mock('@/lib/controller/site');

describe('fromBackground', () => {
  beforeAll(() => {
    fromBackground.validateUrl =
      jest.requireActual('./fromBackground').validateUrl;
    fromBackground.matchUrlRegex =
      jest.requireActual('./fromBackground').matchUrlRegex;
  });
  it('block a site in allow-all + plain url', async () => {
    const blockedSites = {
      items: [
        {
          urlMode: URL_MODE_TEXT,
          urlRegex: 'blockedsite.test',
          id: '1',
        },
      ],
    };
    const testData = {
      blockMode: BLOCK_MODE_ALLOW_ALL,
      blockedSiteIds: [blockedSites.items[0].id],
    };
    siteController.getSites.mockImplementation(() =>
      Promise.resolve(blockedSites)
    );
    taskController.getTask.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('blockedsite.test');
    expect(isValid).toEqual(false);
  });

  it('allow a site in allow-all + plain url', async () => {
    const blockedSites = {
      items: [
        {
          urlMode: URL_MODE_TEXT,
          urlRegex: 'blockedsite.test',
          id: '1',
        },
      ],
    };
    const testData = {
      blockMode: BLOCK_MODE_ALLOW_ALL,
      blockedSiteIds: [blockedSites.items[0].id],
    };
    siteController.getSites.mockImplementation(() =>
      Promise.resolve(blockedSites)
    );
    taskController.getTask.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('allowedsite.test');
    expect(isValid).toEqual(true);
  });
  it('block a site in block-all + plain url', async () => {
    const allowedSites = {
      items: [
        {
          id: '222',
          urlMode: URL_MODE_TEXT,
          urlRegex: 'allowedsite.test',
        },
      ],
    };
    const testData = {
      blockMode: BLOCK_MODE_BLOCK_ALL,
      allowedSites: [allowedSites.items[0].id],
    };
    siteController.getSites.mockImplementation(() =>
      Promise.resolve(allowedSites)
    );
    taskController.getTask.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('blockedsite.test');
    expect(isValid).toEqual(false);
  });
  it('allow a site in block-all + plain url', async () => {
    const allowedSites = {
      items: [
        {
          id: '222',
          urlMode: URL_MODE_TEXT,
          urlRegex: 'allowedsite.test',
        },
      ],
    };
    const testData = {
      blockMode: BLOCK_MODE_BLOCK_ALL,
      allowedSites: [allowedSites.items[0].id],
    };
    siteController.getSites.mockImplementation(() =>
      Promise.resolve(allowedSites)
    );
    taskController.getTask.mockImplementation(() => Promise.resolve(testData));
    const isValid = await fromBackground.validateUrl('allowedsite.test');
    expect(isValid).toEqual(true);
  });
});
