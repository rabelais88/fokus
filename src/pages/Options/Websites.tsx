import { useState } from 'react';
import { LOAD_SUCCESS } from '@/constants';
import useSites from '@/lib/useSites';
import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { SearchIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { NavLink } from '@/components';
import removeSite from '@/lib/removeSite';
import { Trans, useTranslation } from 'react-i18next';

interface siteItemProps {
  site: websiteData;
  onRemoveSite: Function;
}
const SiteItem: React.FC<siteItemProps> = ({ site, onRemoveSite }) => {
  return (
    <HStack
      key={site.id}
      data-site-id={site.id}
      aria-label="website-item"
      justifyContent="space-between"
    >
      <NavLink to={`/website/${site.id}`}>
        <Text>{site.title}</Text>
      </NavLink>
      <CloseButton onClick={() => onRemoveSite(site.id, site.title)} />
    </HStack>
  );
};

const Websites: React.FC = (props) => {
  const [keyword, setKeyword] = useState('');
  const [removeTargetSiteId, setRemoveTargetSiteId] = useState('');
  const [removeTargetSiteName, setRemoveTargetSiteName] = useState('');
  const { sites, loadState, noSite } = useSites({ keyword });
  const { t } = useTranslation();

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

  const siteAddable = noSite || keyword === '';

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent>
          <ModalBody>
            <Trans
              i18nKey="modal--remove-website-message"
              values={{ removeTargetSiteName }}
              components={[<b />]}
            />
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                variant="solid"
                colorScheme="red"
                onClick={onRemoveSiteConfirm}
              >
                {t('modal--remove-website-confirm')}
              </Button>
              <Button variant="outline" onClick={onClose}>
                {t('modal--cancel')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <InputGroup>
          <InputLeftElement children={<SearchIcon />} />
          <Input
            placeholder={t('websites--search-keyword-placeholder')}
            variant="flushed"
            value={keyword}
            onChange={(ev) => setKeyword(ev.target.value)}
            key="website-search-keyword"
          />
          <InputRightElement>
            {siteAddable && (
              <NavLink
                to={keyword === '' ? '/website' : `/website?title=${keyword}`}
              >
                <Tooltip label={t('add-new-site')}>
                  <IconButton
                    icon={<AddIcon />}
                    size="sm"
                    aria-label={t('add-new-site')}
                    variant="ghost"
                  />
                </Tooltip>
              </NavLink>
            )}
            {hasKeyword && (
              <IconButton
                onClick={() => setKeyword('')}
                icon={<CloseIcon />}
                size="sm"
                aria-label={t('websites--reset-search-keyword')}
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
          <Center mt="150">
            <Text>{t('websites--no-website')}</Text>
          </Center>
        )}
        {loadState === LOAD_SUCCESS && !noSite && (
          <Stack divider={<StackDivider borderColor="gray.200" />} spacing={2}>
            {sites.map((site) => (
              <SiteItem key={site.id} {...{ site, onRemoveSite }} />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Websites;
