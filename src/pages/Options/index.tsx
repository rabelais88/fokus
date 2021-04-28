import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
  useHistory,
  Redirect,
} from 'react-router-dom';
import { render } from 'react-dom';

import Document from '@/containers/Document';
import { OptionsLayout } from '@/containers/layout';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  List,
  ListItem,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import Websites from './Websites';
import Website from './Website';
import Tasks from './Tasks';
import Stats from './Stats';
import makeLogger from '@/lib/makeLogger';
import Task from './Task';
import { useTranslation, Trans } from 'react-i18next';
import useQuery from '@/lib/useQuery';
import { QUERY_BLOCKED_URL } from '@/constants';
import Blocked from './Blocked';
import { env } from '@/lib/env';
import { AttachmentIcon, DownloadIcon } from '@chakra-ui/icons';
import send from '@/lib/senders/fromOptions';
import { EXPORT_SETTINGS } from '@/constants/messages';
import importSettings from '@/lib/importSettings';
import Donate from './Donate';

const logger = makeLogger('pages/Options/index.tsx');
logger({ env });

const tabPathMap = ['/tasks', '/websites', '/stats', '/donate'];
const pathToTab = [/task/i, /website/i, /stats/i, /donate/i];

const NavMenu: React.FC = (props) => {
  const loc = useLocation();
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const path = loc.pathname;

  let pathIndex = 0;

  pathToTab.find((re, idx) => {
    const matched = re.test(path);
    if (matched) pathIndex = idx;
    return matched;
  });

  const onTabChange = (index: number) => {
    const _path = tabPathMap[index];
    history.push(_path);
  };

  return (
    <Tabs
      onChange={onTabChange}
      index={pathIndex}
      display="inline-block"
      flexGrow={1}
    >
      <TabList>
        <Tab>{t('tab-tasks')}</Tab>
        <Tab>{t('tab-websites')}</Tab>
        <Tab>{t('tab-stats')}</Tab>
        <Tab>{t('tab-donate')}</Tab>
      </TabList>
    </Tabs>
  );
};

const exportSettings = () => {
  send(EXPORT_SETTINGS);
};

const ToolMenu = () => {
  const toast = useToast();

  const _importSettings = async () => {
    const req = await importSettings();
    if (req.error) {
      toast({ status: 'error', title: 'failed while import settings' });
      return;
    }
    toast({ status: 'success', title: 'setting is now imported' });
    logger(req.result);
  };
  return (
    <HStack>
      <Tooltip label="export settings as json">
        <IconButton
          variant="ghost"
          icon={<DownloadIcon />}
          aria-label="export settings as json"
          onClick={exportSettings}
        />
      </Tooltip>
      <Tooltip label="import json settings">
        <IconButton
          variant="ghost"
          icon={<AttachmentIcon />}
          aria-label="import json settings"
          onClick={_importSettings}
        />
      </Tooltip>
    </HStack>
  );
};

const Options = () => {
  return (
    <Router>
      <Document>
        <OptionsLayout>
          <Flex>
            <Box display="inline-block" marginRight="3" role="logo">
              <Heading>Fokus</Heading>
            </Box>
            <NavMenu />
            <ToolMenu />
          </Flex>
          <OptionsInner />
        </OptionsLayout>
      </Document>
    </Router>
  );
};

const OptionsInner = () => {
  const queryBlockedUrl = useQuery().get(QUERY_BLOCKED_URL);
  const isBlockedUrl = queryBlockedUrl !== '' && queryBlockedUrl;
  if (isBlockedUrl) return <Blocked />;

  return (
    <Switch>
      <Route path="/tasks">
        <Tasks />
      </Route>
      <Route path="/task/:taskId">
        <Task />
      </Route>
      <Route path="/task">
        <Task />
      </Route>
      <Route path="/website/:websiteId">
        <Website />
      </Route>
      <Route path="/website">
        <Website />
      </Route>
      <Route path="/websites">
        <Websites />
      </Route>
      <Route path="/stats">
        <Stats />
      </Route>
      <Route path="/donate">
        <Donate />
      </Route>
      <Redirect to={`/tasks${window.location.search}`} />
    </Switch>
  );
};

render(<Options />, window.document.querySelector('#app-container'));
