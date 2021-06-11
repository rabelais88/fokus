import { NavLink } from '@/components';
import {
  ACTION_HIDE_MODAL,
  ACTION_SHOW_MODAL,
  LOAD_SUCCESS,
} from '@/constants';
import { MiscContext } from '@/lib/context/MiscContext';
import { ModalContext } from '@/lib/context/ModalContext';
import { removeSite } from '@/lib/controller/site';
import useSites from '@/lib/swr/useSites';
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  CloseButton,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ModalBody,
  ModalFooter,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
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
  const {
    items: sites,
    loadState,
    count,
    revalidate: revalidateSites,
  } = useSites({ title: keyword });
  const noSite = count === 0;
  const { state } = useContext(MiscContext);

  const { t } = useTranslation();

  const hasKeyword = keyword.length >= 1;
  const { dispatch: dispatchOnModal } = useContext(ModalContext);

  const onRemoveSite = (siteId: string, siteTitle: string) => {
    const onRemoveSiteConfirm = () => {
      removeSite(siteId);
      revalidateSites();
      dispatchOnModal({ type: ACTION_HIDE_MODAL });
    };
    const ModalContent = (
      <>
        <ModalBody>
          <Trans
            i18nKey="modal--remove-website-message"
            values={{ removeTargetSiteName: siteTitle }}
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
            <Button
              variant="outline"
              onClick={() => dispatchOnModal({ type: ACTION_HIDE_MODAL })}
            >
              {t('modal--cancel')}
            </Button>
          </HStack>
        </ModalFooter>
      </>
    );
    dispatchOnModal({ type: ACTION_SHOW_MODAL, content: ModalContent });
  };

  useEffect(() => {
    revalidateSites();
  }, [state.validId]);

  const siteAddable = noSite || keyword === '';

  return (
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
  );
};

export default Websites;
