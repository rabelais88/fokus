import {
  URL_MODE_REGEX,
  URL_MODE_REGEX_IGNORE_PROTOCOL,
  URL_MODE_TEXT,
} from '@/constants';
import { addSite, editSite } from '@/lib/controller/site';
import makeLogger from '@/lib/makeLogger';
import matchUrlRegex from '@/lib/matchUrlRegex';
import useSite from '@/lib/swr/useSite';
import useQuery from '@/lib/useQuery';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

const logger = makeLogger('pages/Options/Website');

const Website: React.FC = (props) => {
  const { websiteId } = useParams<{ websiteId: string | undefined }>();
  const isNewWebsite = !websiteId;
  const {
    site = {
      title: '',
      description: '',
      urlMode: URL_MODE_TEXT,
      urlRegex: '',
      id: '',
    },
    loadState,
  } = useSite(websiteId || '');
  logger({ site, websiteId });
  const { handleSubmit, errors, register, watch } = useForm();
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [sampleUrl, setSampleUrl] = useState('');
  const history = useHistory();
  const toast = useToast();
  const { t } = useTranslation();

  const _addNewSite = async (siteData: websiteData) => {
    setLoading(true);
    await addSite(siteData);
    setLoading(false);
    history.push('/websites');
    toast({ status: 'success', title: t('toast--new-website-added') });
  };

  const _editSite = async (siteData: websiteData) => {
    setLoading(true);
    await editSite({ ...siteData, id: site.id });
    setLoading(false);
    history.push('/websites');
    toast({ status: 'success', title: t('toast--website-edited') });
  };

  const onSubmit = (siteData: websiteData) => {
    logger('onSubmit', siteData);
    if (isNewWebsite) {
      _addNewSite(siteData);
      return;
    }
    _editSite(siteData);
  };

  const tempUrlRegex = watch('urlRegex', '');
  const tempUrlMode = watch('urlMode', URL_MODE_TEXT);
  const sampleUrlMatch = matchUrlRegex(tempUrlMode, tempUrlRegex, sampleUrl);
  logger({ sampleUrlMatch });

  // https://codesandbox.io/s/chakra-ui-react-hook-form-v382z?file=/src/HookForm.js
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={errors.title} id="website-name">
          <FormLabel htmlFor="title">
            {t('edit-website--website-name')}
          </FormLabel>
          <Input
            name="title"
            type="text"
            placeholder={t('edit-website--website-name-placeholder')}
            defaultValue={query.get('title') || site.title}
            ref={register({ required: true })}
          />
        </FormControl>

        <FormControl id="url-regex">
          <FormLabel htmlFor="description">
            {t('edit-website--website-description')}
          </FormLabel>
          <Input
            name="description"
            type="text"
            placeholder={t('edit-website--website-description-placeholder')}
            defaultValue={site.description}
            ref={register}
          />
        </FormControl>

        <FormControl as="fieldset" id="url-mode">
          <FormLabel as="legend" htmlFor="urlMode">
            {t('edit-website--url-detection-mode')}
          </FormLabel>
          <RadioGroup name="urlMode" defaultValue={site.urlMode}>
            <HStack spacing="24px">
              <Radio name="urlMode" value={URL_MODE_TEXT} ref={register}>
                {t('edit-website--url-mode-plain-url')}
              </Radio>
              <Radio name="urlMode" value={URL_MODE_REGEX} ref={register}>
                {t('edit-website--url-mode-regex')}
              </Radio>
              <Radio
                name="urlMode"
                value={URL_MODE_REGEX_IGNORE_PROTOCOL}
                ref={register}
              >
                {t('edit-website--url-mode-regex-ignore-protocol')}
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl isRequired isInvalid={errors.urlRegex} id="url-regex">
          <FormLabel htmlFor="urlRegex">
            {t('edit-website--url-regex')}
          </FormLabel>
          <Input
            name="urlRegex"
            type="text"
            placeholder={t('edit-website--url-regex-placeholder')}
            defaultValue={site.urlRegex}
            ref={register({ required: true })}
          />
          {tempUrlMode === URL_MODE_REGEX && (
            <FormHelperText>
              {'i.g. (http|https):'}\/\/google\.com
            </FormHelperText>
          )}
          {tempUrlMode === URL_MODE_TEXT && (
            <FormHelperText>i.g. google.com, test.net</FormHelperText>
          )}
          {tempUrlMode === URL_MODE_REGEX_IGNORE_PROTOCOL && (
            <FormHelperText>
              i.g. ^(www\.|)google.com, ^(www\.|)test.net
            </FormHelperText>
          )}
          <FormErrorMessage>
            {errors.urlRegex && errors.urlRegex.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl id="url-regex-test" isInvalid={!sampleUrlMatch}>
          <FormLabel htmlFor="urlRegexTest">
            {t('edit-website--test-url-regex')}
          </FormLabel>
          <Input
            name="urlRegexTest"
            type="text"
            placeholder={t('edit-website--test-url-regex-placeholder')}
            value={sampleUrl}
            onChange={(ev) => {
              if (ev.target) setSampleUrl(ev.target.value);
            }}
          />
          {sampleUrlMatch && (
            <FormHelperText>{t('edit-website--url-match')}</FormHelperText>
          )}
          {!sampleUrlMatch && (
            <FormErrorMessage>
              {t('edit-website--url-not-match')}
            </FormErrorMessage>
          )}
        </FormControl>

        {isNewWebsite && (
          <Button type="submit" isLoading={loading} variant="solid">
            {t('edit-website--create-website')}
          </Button>
        )}
        {!isNewWebsite && (
          <Button type="submit" isLoading={loading} variant="solid">
            {t('edit-website--save-website')}
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default Website;
