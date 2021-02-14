import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useLocation,
} from 'react-router-dom';
import { render } from 'react-dom';

import Document from '@/containers/Document';
import { OptionsLayout } from '@/containers/layout';
import { Heading, Stack, Tab, TabList, Tabs } from '@chakra-ui/react';
import Websites from './Websites';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('pages/Options/index.tsx');

const NavItem: React.FC<{ to: string }> = (props) => {
  return (
    <Tab>
      <Link {...props} />
    </Tab>
  );
};

const NavMenu: React.FC = (props) => {
  const path = useLocation().pathname;
  const pathIndexMap: { [key: string]: number } = {
    '/tasks': 0,
    '/websites': 1,
  };
  const pathIndex = pathIndexMap[path];

  return (
    <Tabs>
      <TabList index={pathIndex}>
        <NavItem to="/tasks">tasks</NavItem>
        <NavItem to="/websites">websites</NavItem>
        <NavItem to="/donate">donate</NavItem>
      </TabList>
    </Tabs>
  );
};

const Options = (
  <Document>
    <OptionsLayout>
      <Router>
        <Heading>Fokus</Heading>
        <NavMenu />
        <Switch>
          <Route path="/tasks">tasks</Route>
          <Route path="/task">task</Route>
          <Route path="/website">website</Route>
          <Route path="/websites">
            <Websites />
          </Route>
          <Route path="/">
            <Websites />
          </Route>
          <Route path="/donate">donate</Route>
        </Switch>
      </Router>
    </OptionsLayout>
  </Document>
);

render(Options, window.document.querySelector('#app-container'));
