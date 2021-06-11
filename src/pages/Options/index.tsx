import { ACTION_REVALIDATE, QUERY_BLOCKED_URL } from '@/constants';
import Document from '@/containers/Document';
import { OptionsLayout } from '@/containers/layout';
import { MiscContext } from '@/lib/context/MiscContext';
import { env } from '@/lib/env';
import exportSettings from '@/lib/exportSettings';
// import send from '@/lib/senders/fromOptions';
// import { EXPORT_SETTINGS } from '@/constants/messages';
import importSettings from '@/lib/importSettings';
import makeLogger from '@/lib/makeLogger';
import useQuery from '@/lib/useQuery';
import { AttachmentIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Tab,
  TabList,
  Tabs,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { render } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import Blocked from './Blocked';
import Donate from './Donate';
import Stats from './Stats';
import Task from './Task';
import Tasks from './Tasks';
import Website from './Website';
import Websites from './Websites';

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

const onExportSettings = async () => {
  // send(EXPORT_SETTINGS);
  const data = await exportSettings();
  logger('exportSettings', data);
};

const ToolMenu = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const { dispatch } = useContext(MiscContext);

  const _importSettings = async () => {
    const req = await importSettings();
    if (req.error) {
      toast({ status: 'error', title: t('json-import-fail') });
      return;
    }
    toast({ status: 'success', title: t('json-import-success') });
    logger(req.result);

    dispatch({ type: ACTION_REVALIDATE });
  };
  return (
    <HStack>
      <Tooltip label={t('export-json')}>
        <IconButton
          variant="ghost"
          icon={<DownloadIcon />}
          aria-label={t('export-json-description')}
          onClick={onExportSettings}
        />
      </Tooltip>
      <Tooltip label={t('import-json')}>
        <IconButton
          variant="ghost"
          icon={<AttachmentIcon />}
          aria-label={t('import-json-description')}
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
