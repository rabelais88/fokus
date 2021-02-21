import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { URL_MODE_TEXT, URL_MODE_REGEX } from '@/constants';
import useQuery from '@/lib/useQuery';
import makeLogger from '@/lib/makeLogger';
import addSite from '@/lib/addSite';
import useSite from '@/lib/useSite';
import editSite from '@/lib/editSite';

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
  const { handleSubmit, errors, register } = useForm();
  const formMargin = '30px';
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const _addNewSite = async (siteData: websiteData) => {
    setLoading(true);
    await addSite(siteData);
    setLoading(false);
    history.push('/websites');
  };

  const _editSite = async (siteData: websiteData) => {
    setLoading(true);
    await editSite({ ...siteData, id: site.id });
    setLoading(false);
    history.push('/websites');
  };

  const onSubmit = (siteData: websiteData) => {
    logger(siteData);
    if (isNewWebsite) {
      _addNewSite(siteData);
      return;
    }
    _editSite(siteData);
  };
  // https://codesandbox.io/s/chakra-ui-react-hook-form-v382z?file=/src/HookForm.js
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isRequired
        isInvalid={errors.title}
        id="website-name"
        mt="30px"
        mb={formMargin}
      >
        <FormLabel htmlFor="title">Name of website</FormLabel>
        <Input
          name="title"
          placeholder="name"
          defaultValue={query.get('title') || site.title}
          ref={register({ required: true })}
        />
        <FormErrorMessage>
          {errors.title && 'website name is required'}
        </FormErrorMessage>
      </FormControl>

      <FormControl id="url-regex" mb={formMargin}>
        <FormLabel htmlFor="description">description</FormLabel>
        <Input
          name="description"
          placeholder="description"
          defaultValue={site.description}
          ref={register}
        />
      </FormControl>

      <FormControl as="fieldset" id="url-mode" mb={formMargin}>
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
          </HStack>
        </RadioGroup>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={errors.urlRegex}
        id="url-regex"
        mb={formMargin}
      >
        <FormLabel htmlFor="urlRegex">url(regex)</FormLabel>
        <Input
          name="urlRegex"
          placeholder="url or regex"
          defaultValue={site.urlRegex}
          ref={register({ required: true })}
        />
        <FormErrorMessage>
          {errors.urlRegex && errors.urlRegex.message}
        </FormErrorMessage>
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
    </form>
  );
};

export default Website;
