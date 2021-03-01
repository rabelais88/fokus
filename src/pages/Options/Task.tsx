import React, { useState } from 'react';
import makeLogger from '@/lib/makeLogger';
import { useHistory, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import useQuery from '@/lib/useQuery';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import useTask from '@/lib/useTask';
import SuggestionMultiple from '@/components/SuggestionMultiple';
import storage from '@/lib/storage';
import { STORE_WEBSITES } from '@/constants/storeKey';
import useSite from '@/lib/useSite';
import { LOAD_SUCCESS } from '@/constants';

const logger = makeLogger('pages/Options/Task');

const allowedSiteItem: React.FC<SuggestionItemProps> = ({
  id,
  text,
  onItemClick,
  selected,
}) => {
  return <div onClick={() => onItemClick(id, text)}>{text}</div>;
};

const blockedSiteItem: React.FC<SuggestionItemProps> = ({
  id,
  text,
  onItemClick,
  selected,
}) => {
  return <div onClick={() => onItemClick(id, text)}>{text}</div>;
};

const SelectedSite: React.FC<{ siteId: string; onClick: () => void }> = ({
  siteId,
  onClick,
}) => {
  const { site, loadState } = useSite(siteId);
  if (loadState === LOAD_SUCCESS)
    return (
      <Tag onClick={onClick}>
        <TagLabel>{site.title}</TagLabel>
        <TagCloseButton />
      </Tag>
    );
  return <Tag>{siteId}</Tag>;
};

const Task: React.FC = (props) => {
  const { taskId } = useParams<{ taskId: string | undefined }>();
  const isNewTask = !taskId;

  const { handleSubmit, errors, register, control } = useForm();
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [allowedSiteKeyword, setAllowedSiteKeyword] = useState('');
  const [blockedSiteKeyword, setBlockedSiteKeyword] = useState('');

  const suggestSites = async (keyword: string) => {
    const reqSites = await storage.get<websitesData>(STORE_WEBSITES);
    const reKeyword = new RegExp(keyword, 'i');
    const matchSites = Object.values(reqSites).filter(
      (site) => reKeyword.test(site.title) || reKeyword.test(site.description)
    );
    const result: any = matchSites.map((site) => ({
      key: site.id,
      text: site.title,
    }));
    return {
      result,
      error: null,
      errorCode: '',
    };
  };

  const {
    task = {
      title: '',
      description: '',
      blockedSiteIds: [],
      allowedSiteIds: [],
    },
    loadState,
  } = useTask(taskId || '');

  const onSubmit = (taskData: taskData) => {
    logger('onSubmit', taskData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl
          isRequired
          isInvalid={errors.title}
          id="task-name"
          mt="30px"
        >
          <FormLabel htmlFor="task-title">Name of task</FormLabel>
          <Input
            name="title"
            placeholder="name"
            defaultValue={query.get('title') || task.title}
            ref={register({ required: true })}
          />
          <FormErrorMessage>
            {errors.title && 'task name is required'}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="task-description">
          <FormLabel htmlFor="description">description</FormLabel>
          <Input
            name="description"
            placeholder="description"
            defaultValue={task.description}
            ref={register}
          />
        </FormControl>
        <FormControl id="task-allowed-sites">
          <FormLabel htmlFor="allowed-sites">allowed sites</FormLabel>
          <HStack></HStack>
          <Controller
            name="allowedSiteIds"
            control={control}
            defaultValue={task.allowedSiteIds}
            render={({ onChange: _onChange, value: _value }) => {
              const removeSite = (siteId: string) => {
                _onChange(_value.filter((asid: string) => asid !== siteId));
              };
              return (
                <>
                  <HStack>
                    {_value.map((allowedSiteId: string) => (
                      <SelectedSite
                        siteId={allowedSiteId}
                        key={allowedSiteId}
                        onClick={() => removeSite(allowedSiteId)}
                      />
                    ))}
                  </HStack>
                  <SuggestionMultiple
                    keyword={allowedSiteKeyword}
                    onKeywordChange={(v) => setAllowedSiteKeyword(v)}
                    value={_value}
                    onValueChange={_onChange}
                    itemComponent={allowedSiteItem}
                    loadingComponent={() => <div>loading</div>}
                    noResultComponent={() => <div>no Result</div>}
                    onSuggest={suggestSites}
                  />
                </>
              );
            }}
          ></Controller>
        </FormControl>
        <FormControl id="task-blocked-sites">
          <FormLabel htmlFor="blocked-sites">blocked sites</FormLabel>
          <Controller
            name="blockedSiteIds"
            control={control}
            defaultValue={task.blockedSiteIds}
            render={({ onChange: _onChange, value: _value }) => {
              const removeSite = (siteId: string) => {
                _onChange(_value.filter((asid: string) => asid !== siteId));
              };
              return (
                <>
                  <HStack>
                    {_value.map((blockedSiteId: string) => (
                      <SelectedSite
                        key={blockedSiteId}
                        siteId={blockedSiteId}
                        onClick={() => removeSite(blockedSiteId)}
                      />
                    ))}
                  </HStack>
                  <SuggestionMultiple
                    keyword={blockedSiteKeyword}
                    onKeywordChange={(v) => setBlockedSiteKeyword(v)}
                    value={_value}
                    onValueChange={_onChange}
                    itemComponent={blockedSiteItem}
                    loadingComponent={() => <div>loading</div>}
                    noResultComponent={() => <div>no result</div>}
                    onSuggest={suggestSites}
                  />
                </>
              );
            }}
          />
        </FormControl>
        {isNewTask && (
          <Button type="submit" isLoading={loading} variant="solid">
            Add
          </Button>
        )}
        {!isNewTask && (
          <Button type="submit" isLoading={loading} variant="solid">
            Edit
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default Task;
