import { Fragment, useState } from 'react';
import { LOAD_SUCCESS } from '@/constants';
import useSites from '@/lib/useSites';
import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Skeleton,
  Stack,
  StackDivider,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { SearchIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { NavLink } from '@/components';
import removeSite from '@/lib/removeSite';

const Websites: React.FC = (props) => {
  const [keyword, setKeyword] = useState('');
  const [removeTargetSiteId, setRemoveTargetSiteId] = useState('');
  const [removeTargetSiteName, setRemoveTargetSiteName] = useState('');
  const { sites, loadState } = useSites({ keyword });

  const noSite = sites.length === 0;
  const hasKeyword = keyword.length >= 1;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onRemoveSite = (siteId: string, siteTitle: string) => {
    setRemoveTargetSiteId(siteId);
    setRemoveTargetSiteName(siteTitle);
    onOpen();
  };

  const onRemoveSiteConfirm = () => {
    removeSite(removeTargetSiteId);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent>
          <ModalBody>
            would you like to remove <b>{removeTargetSiteName}</b> ?
          </ModalBody>
          <ModalFooter>
            <Button variant="solid" onClick={onRemoveSiteConfirm}>
              Remove
            </Button>
            <Button variant="outline" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
        <Box height="30px" />
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
          <Stack divider={<StackDivider borderColor="gray.200" />} spacing={2}>
            {sites.map((site) => (
              <Flex
                key={site.id}
                data-site-id={site.id}
                aria-label="website-item"
                justifyContent="space-between"
              >
                <NavLink to={`/website/${site.id}`}>{site.title}</NavLink>
                <CloseButton
                  onClick={() => onRemoveSite(site.id, site.title)}
                />
              </Flex>
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Websites;
