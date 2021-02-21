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

const Websites: React.FC = (props) => {
  const [keyword, setKeyword] = useState('');
  const { sites, loadState } = useSites({ keyword });

  const noSite = sites.length === 0;
  const hasKeyword = keyword.length >= 1;

  return (
    <Box>
      <InputGroup>
        <InputLeftElement children={<SearchIcon />} />
        <Input
          placeholder="please put the site name here"
          variant="flushed"
          value={keyword}
          onChange={(ev) => setKeyword(ev.target.value)}
          key="website-search-keyword"
        />
        <InputRightElement>
          {noSite && (
            <NavLink
              to={keyword === '' ? '/website' : `/website?title=${keyword}`}
            >
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
      {loadState !== LOAD_SUCCESS && (
        <Stack>
          <Skeleton height="20px"></Skeleton>
          <Skeleton height="20px"></Skeleton>
          <Skeleton height="20px"></Skeleton>
        </Stack>
      )}
      {loadState === LOAD_SUCCESS && noSite && (
        <Center mt="150">no websites found</Center>
      )}
      {loadState === LOAD_SUCCESS && !noSite && (
        <List>
          {sites.map((site) => (
            <ListItem key={site.id} data-site-id={site.id}>
              <NavLink to={`/website/${site.id}`}>{site.title}</NavLink>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Websites;
