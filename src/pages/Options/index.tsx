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
  Tab,
  TabList,
  Tabs,
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
import readFile from '@/lib/file/readFile';
import send from '@/lib/senders/fromOptions';
import { EXPORT_SETTINGS } from '@/constants/messages';

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
const importSettings = async () => {
  const req = await readFile('.json');
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
            <HStack>
              <IconButton
                variant="ghost"
                icon={<DownloadIcon />}
                aria-label="export settings as json"
                onClick={exportSettings}
              />
              <IconButton
                variant="ghost"
                icon={<AttachmentIcon />}
                aria-label="import json settings"
                onClick={importSettings}
              />
            </HStack>
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
        <Box mt={5}>
          <Link href="https://patreon.com/fokus_extension">
            🙇‍♂️<Trans>patreon-link</Trans>🥳
          </Link>
        </Box>
      </Route>
      <Redirect to={`/tasks${window.location.search}`} />
    </Switch>
  );
};

render(<Options />, window.document.querySelector('#app-container'));
