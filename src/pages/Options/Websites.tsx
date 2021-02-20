import { Fragment, useState } from 'react';
import { LOAD_SUCCESS } from '@/constants';
import useSites from '@/lib/useSites';
import {
  Box,
  Button,
  Center,
  IconButton,
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
import { SearchIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
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

const Body: React.FC<{ filteredSites: websiteData[] }> = (props) => {
  if (props.filteredSites.length === 0)
    return <Center mt="150">no websites found</Center>;
  return (
    <Fragment>
      {props.filteredSites.map((site) => (
        <ListItem>{site.description}</ListItem>
      ))}
    </Fragment>
  );
};

const SearchBar: React.FC<{
  keyword: string;
  setKeyword: Function;
  noSite: boolean;
  hasKeyword: boolean;
}> = ({ keyword, setKeyword, noSite, hasKeyword }) => (
  <InputGroup>
    <InputLeftElement children={<SearchIcon />} />
    <Input
      placeholder="sitename"
      variant="flushed"
      value={keyword}
      onChange={(ev) => setKeyword(ev.target.value)}
      key="website-search-keyword"
    />
    <InputRightElement>
      {noSite && (
        <NavLink to="/website">
          <IconButton
            icon={<AddIcon />}
            size="sm"
            aria-label="add new website"
            variant="ghost"
          />
        </NavLink>
      )}
      {hasKeyword && (
        <IconButton
          onClick={() => setKeyword('')}
          icon={<CloseIcon />}
          size="sm"
          aria-label="reset website search keyword"
          variant="ghost"
        />
      )}
    </InputRightElement>
  </InputGroup>
);

const WebsitesLoaded: React.FC = (props) => {
  const { sites } = useSites();
  const [keyword, setKeyword] = useState('');
  const reTitle = new RegExp(keyword, 'ig');
  const filteredSites = sites.filter((site) => reTitle.test(site.description));
  const noSite = filteredSites.length === 0;
  const hasKeyword = keyword.length >= 1;

  return (
    <Fragment>
      <SearchBar {...{ noSite, hasKeyword, keyword, setKeyword }} />
      <Body {...{ filteredSites }} />
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
