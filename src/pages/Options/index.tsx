import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
  useHistory,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import { render } from 'react-dom';

import Document from '@/containers/Document';
import { OptionsLayout } from '@/containers/layout';
import { Box, Heading, Link, Tab, TabList, Tabs } from '@chakra-ui/react';
import Websites from './Websites';
import Website from './Website';
import Tasks from './Tasks';
import Stats from './Stats';
import makeLogger from '@/lib/makeLogger';
import Task from './Task';

const logger = makeLogger('pages/Options/index.tsx');

const tabPathMap = ['/tasks', '/websites', '/stats', '/donate'];

const NavMenu: React.FC = (props) => {
  const loc = useLocation();
  const history = useHistory();

  const path = loc.pathname;
  const isTabTask = /task/i.test(path);
  const isTabWebsite = /website/i.test(path);
  const isTabDonate = /donate/i.test(path);
  const isTabStats = /stats/i.test(path);
  let pathIndex = 0;
  if (isTabTask) pathIndex = 0;
  if (isTabWebsite) pathIndex = 1;
  if (isTabStats) pathIndex = 2;
  if (isTabDonate) pathIndex = 3;

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
        <Tab>tasks</Tab>
        <Tab>websites</Tab>
        <Tab>stats</Tab>
        <Tab>donate</Tab>
      </TabList>
    </Tabs>
  );
};

const Options = (
  <Document>
    <OptionsLayout>
      <Router>
        <Box display="flex">
          <Box display="inline-block" marginRight="3" role="logo">
            <Heading>Fokus</Heading>
          </Box>
          <NavMenu />
        </Box>
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
                🙇‍♂️please support this extension on pateron!🥳
              </Link>
            </Box>
          </Route>
          <Redirect to="/tasks" />
        </Switch>
      </Router>
    </OptionsLayout>
  </Document>
);

render(Options, window.document.querySelector('#app-container'));
