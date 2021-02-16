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
import { Box, Heading, Stack, Tab, TabList, Tabs } from '@chakra-ui/react';
import Websites from './Websites';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('pages/Options/index.tsx');

const pathIndexMap: { [key: string]: number } = {
  '/tasks': 0,
  '/task': 0,
  '/websites': 1,
  '/website': 1,
  '/donate': 2,
};

const tabPathMap = ['/tasks', '/websites', '/donate'];

const NavMenu: React.FC = (props) => {
  const loc = useLocation();
  const path = loc.pathname;
  const history = useHistory();

  const pathIndex = pathIndexMap[path];

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
          <Box display="inline-block" marginRight="3">
            <Heading>Fokus</Heading>
          </Box>
          <NavMenu />
        </Box>
        <Switch>
          <Route path="/tasks">tasks</Route>
          <Route path="/task">task</Route>
          <Route path="/website">website</Route>
          <Route path="/websites">
            <Websites />
          </Route>
          <Route path="/donate">donate</Route>
          <Redirect to="/tasks" />
        </Switch>
      </Router>
    </OptionsLayout>
  </Document>
);

render(Options, window.document.querySelector('#app-container'));
