import { Fragment } from 'react';
import { LOAD_SUCCESS } from '@/constants';
import useSites from '@/lib/useSites';
import {
  Box,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { NavLink } from '@/components';

const WebsitesLoading: React.FC = (props) => {
  return (
    <Stack>
      <Skeleton height="20px"></Skeleton>
      <Skeleton height="20px"></Skeleton>
      <Skeleton height="20px"></Skeleton>
    </Stack>
  );
};

const WebsitesLoaded: React.FC = (props) => {
  const { sites } = useSites();

  const Body = () => {
    if (sites.length === 0) return <Center>no websites registered</Center>;
    return (
      <Fragment>
        {sites.map((site) => (
          <ListItem>{site.description}</ListItem>
        ))}
      </Fragment>
    );
  };
  return (
    <Fragment>
      <InputGroup>
        <InputLeftElement children={<SearchIcon />} />
        <Input placeholder="sitename" variant="flushed" />
        <InputRightElement>
          <NavLink to="/website">
            <AddIcon />
          </NavLink>
        </InputRightElement>
      </InputGroup>
      <Body />
    </Fragment>
  );
};

const Websites: React.FC = (props) => {
  const { loadState } = useSites();
  return (
    <Box>
      <List>
        {loadState === LOAD_SUCCESS && <WebsitesLoaded />}
        {loadState !== LOAD_SUCCESS && <WebsitesLoading />}
      </List>
    </Box>
  );
};

export default Websites;
