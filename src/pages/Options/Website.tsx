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
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  URL_MODE_TEXT,
  URL_MODE_REGEX,
  URL_MODE_REGEX_IGNORE_PROTOCOL,
} from '@/constants';
import useQuery from '@/lib/useQuery';
import makeLogger from '@/lib/makeLogger';
import addSite from '@/lib/swr/addSite';
import useSite from '@/lib/useSite';
import editSite from '@/lib/swr/editSite';
import matchUrlRegex from '@/lib/matchUrlRegex';

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

  const _addNewSite = async (siteData: websiteData) => {
    setLoading(true);
    await addSite(siteData);
    setLoading(false);
    history.push('/websites');
    toast({ status: 'success', title: 'new website has been added' });
  };

  const _editSite = async (siteData: websiteData) => {
    setLoading(true);
    await editSite({ ...siteData, id: site.id });
    setLoading(false);
    history.push('/websites');
    toast({ status: 'success', title: 'website has been edited' });
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
          <FormLabel htmlFor="title">Name of website</FormLabel>
          <Input
            name="title"
            type="text"
            placeholder="name"
            defaultValue={query.get('title') || site.title}
            ref={register({ required: true })}
          />
          <FormErrorMessage>
            {errors.title && 'website name is required'}
          </FormErrorMessage>
        </FormControl>

        <FormControl id="url-regex">
          <FormLabel htmlFor="description">description</FormLabel>
          <Input
            name="description"
            type="text"
            placeholder="description"
            defaultValue={site.description}
            ref={register}
          />
        </FormControl>

        <FormControl as="fieldset" id="url-mode">
          <FormLabel as="legend" htmlFor="urlMode">
            url detection mode
          </FormLabel>
          <RadioGroup name="urlMode" defaultValue={site.urlMode}>
            <HStack spacing="24px">
              <Radio name="urlMode" value={URL_MODE_TEXT} ref={register}>
                plain url
              </Radio>
              <Radio name="urlMode" value={URL_MODE_REGEX} ref={register}>
                regex(js)
              </Radio>
              <Radio
                name="urlMode"
                value={URL_MODE_REGEX_IGNORE_PROTOCOL}
                ref={register}
              >
                regex(js) + ignore protocol(http, https, file...)
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl isRequired isInvalid={errors.urlRegex} id="url-regex">
          <FormLabel htmlFor="urlRegex">url(regex)</FormLabel>
          <Input
            name="urlRegex"
            type="text"
            placeholder="url or regex"
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
          <FormLabel htmlFor="urlRegexTest">test url(regex)</FormLabel>
          <Input
            name="urlRegexTest"
            type="text"
            placeholder="test any url with given url(regex)"
            value={sampleUrl}
            onChange={(ev) => {
              if (ev.target) setSampleUrl(ev.target.value);
            }}
          />
          {sampleUrlMatch && (
            <FormHelperText>url matches with given regex(url)</FormHelperText>
          )}
          {!sampleUrlMatch && (
            <FormErrorMessage>
              url does not match with given regex(url)
            </FormErrorMessage>
          )}
        </FormControl>

        {isNewWebsite && (
          <Button type="submit" isLoading={loading} variant="solid">
            Add
          </Button>
        )}
        {!isNewWebsite && (
          <Button type="submit" isLoading={loading} variant="solid">
            Edit
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default Website;
