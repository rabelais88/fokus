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
  Switch,
  NumberInput,
  NumberInputField,
  Text,
  RadioGroup,
  Radio,
  useToast,
  ButtonGroup,
  Box,
  IconButton,
} from '@chakra-ui/react';
import useTask from '@/lib/useTask';
import storage from '@/lib/storage';
import { STORE_TASK_HISTORY_NOW, STORE_WEBSITES } from '@/constants/storeKey';
import useSite from '@/lib/useSite';
import {
  BLOCK_MODE_ALLOW_ALL,
  BLOCK_MODE_BLOCK_ALL,
  LOAD_SUCCESS,
} from '@/constants';
import addTask from '@/lib/swr/addTask';
import editTask from '@/lib/swr/editTask';
import { makeResult } from '@/lib';
import useTaskNow from '@/lib/swr/useTaskNow';
import startTask from '@/lib/swr/startTask';
import endTask from '@/lib/swr/endTask';
import AutoComplete from '@/components/AutoComplete';
import Emote from '@/components/Emote';
import EmotePicker from '@/components/EmotePicker';
import { EmojiData } from 'emoji-mart';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const logger = makeLogger('pages/Options/Task');

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
  const { taskNow, hasTask, loadState: taskNowLoadState } = useTaskNow();
  let taskInProgress = false;
  if (taskNowLoadState === LOAD_SUCCESS && hasTask && !isNewTask) {
    taskInProgress = taskNow.taskId === taskId;
  }

  const { handleSubmit, errors, register, control, watch } = useForm();
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const [openEmotePicker, setOpenEmotePicker] = useState(false);
  const { t } = useTranslation();

  const suggestSites = async (keyword: string) => {
    const reqSites = await storage.get(STORE_WEBSITES);
    const reKeyword = new RegExp(keyword, 'i');
    const matchSites = Object.values(reqSites).filter(
      (site) => reKeyword.test(site.title) || reKeyword.test(site.description)
    );
    const result: any = matchSites.map((site) => ({
      key: site.id,
      text: site.title,
    }));
    return makeResult(result);
  };

  const {
    task = {
      title: '',
      description: '',
      emojiId: '',
      blockedSiteIds: [],
      allowedSiteIds: [],
      maxDuration: -1,
      blockMode: BLOCK_MODE_BLOCK_ALL,
    },
    loadState,
  } = useTask(taskId || '');

  const _addNewTask = async (taskData: taskData) => {
    setLoading(true);
    await addTask(taskData);
    setLoading(false);
    history.push('/tasks');
    toast({ status: 'success', title: t('toast--new-task-added') });
  };

  const _editTask = async (taskData: taskData) => {
    setLoading(true);
    await editTask(taskData);
    setLoading(false);
    history.push('/tasks');
    toast({ status: 'success', title: t('toast--task-edited') });
  };

  const onSubmit = (taskData: taskData) => {
    logger('onSubmit', taskData);
    if (isNewTask) {
      _addNewTask(taskData);
      return;
    }
    _editTask({ ...task, ...taskData });
  };

  const onTaskStart = () => {
    if (!taskId) return;
    startTask(taskId);
  };

  const onTaskStop = () => {
    endTask();
  };

  // temporary state while editing form
  const tempBlockMode = watch('blockMode', task.blockMode);

  const onAddNewSite = () => {
    history.push('/website');
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
          <FormLabel htmlFor="task-title">
            {t('edit-task--task-name')}
          </FormLabel>
          <Input
            name="title"
            placeholder="name"
            defaultValue={query.get('title') || task.title}
            ref={register({ required: true })}
          />
          <FormErrorMessage>
            {errors.title && t('edit-task--task-name-required')}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="emoji-id">
          <FormLabel htmlFor="emoji-id">{t('edit-task--task-icon')}</FormLabel>
          <Controller
            name="emojiId"
            control={control}
            defaultValue={task.emojiId || ''}
            render={({ onChange: _onChange, value: _value }) => {
              const onAddIcon = () => {
                _onChange('thumbsup');
                setOpenEmotePicker(true);
              };

              if (_value === '')
                return (
                  <Button size="sm" onClick={onAddIcon}>
                    Add Icon
                  </Button>
                );

              const onEmoteSelect = (emoji: EmojiData) => {
                _onChange(emoji.id || '');
                setOpenEmotePicker(false);
              };

              return (
                <HStack>
                  <Emote emoji={_value} size={16} />
                  {openEmotePicker && (
                    <EmotePicker onSelect={onEmoteSelect} emoji={_value} />
                  )}
                  <ButtonGroup isAttached size="sm">
                    <IconButton
                      onClick={() => setOpenEmotePicker(true)}
                      icon={<EditIcon />}
                      aria-label="edit icon"
                      variant="outline"
                    />
                    <IconButton
                      onClick={() => _onChange('')}
                      icon={<DeleteIcon />}
                      aria-label="delete icon"
                      variant="outline"
                    />
                  </ButtonGroup>
                </HStack>
              );
            }}
          ></Controller>
        </FormControl>
        <FormControl id="task-description">
          <FormLabel htmlFor="description">
            {t('edit-task--task-description')}
          </FormLabel>
          <Input
            name="description"
            placeholder="description"
            defaultValue={task.description}
            ref={register}
          />
        </FormControl>
        <FormControl id="task-block-mode">
          <FormLabel htmlFor="block-mode">
            {t('edit-task--block-mode')}
          </FormLabel>
          <Controller
            name="blockMode"
            control={control}
            defaultValue={task.blockMode}
            render={({ onChange: _onChange, value: _value }) => {
              return (
                <RadioGroup spacing="10px" onChange={_onChange} value={_value}>
                  <Stack direction="row">
                    <Radio value={BLOCK_MODE_ALLOW_ALL}>
                      {t('edit-task--allow-all-sites')}
                    </Radio>
                    <Radio value={BLOCK_MODE_BLOCK_ALL}>
                      {t('edit-task--block-all-sites')}
                    </Radio>
                  </Stack>
                </RadioGroup>
              );
            }}
          />
        </FormControl>
        <FormControl id="task-allowed-sites">
          <FormLabel htmlFor="allowed-sites">
            {t('edit-task--allowed-sites')}
          </FormLabel>
          <Controller
            name="allowedSiteIds"
            control={control}
            defaultValue={task.allowedSiteIds}
            render={({ onChange: _onChange, value: _value }) => {
              const removeSite = (siteId: string) => {
                _onChange(_value.filter((asid: string) => asid !== siteId));
              };
              const addSite = (siteId: string) => {
                if (!siteId || siteId === '') return;
                if (_value.includes(siteId)) return;
                _onChange([..._value, siteId]);
              };
              return (
                <Stack spacing="10px">
                  <HStack>
                    {_value.map((allowedSiteId: string) => (
                      <SelectedSite
                        siteId={allowedSiteId}
                        key={allowedSiteId}
                        onClick={() => removeSite(allowedSiteId)}
                      />
                    ))}
                  </HStack>
                  <AutoComplete
                    onSuggest={suggestSites}
                    onChange={addSite}
                    disabled={
                      tempBlockMode === BLOCK_MODE_ALLOW_ALL || undefined
                    }
                    showSupplement
                    supplementItem={{
                      text: t('edit-task--add-new-site'),
                      key: 'ADD_NEW_SITE',
                    }}
                    onSupplement={onAddNewSite}
                  />
                </Stack>
              );
            }}
          ></Controller>
        </FormControl>
        <FormControl id="task-blocked-sites">
          <FormLabel htmlFor="blocked-sites">
            {t('edit-task--blocked-sites')}
          </FormLabel>
          <Controller
            name="blockedSiteIds"
            control={control}
            defaultValue={task.blockedSiteIds}
            render={({ onChange: _onChange, value: _value }) => {
              const removeSite = (siteId: string) => {
                _onChange(_value.filter((asid: string) => asid !== siteId));
              };
              const addSite = (siteId: string) => {
                if (!siteId || siteId === '') return;
                if (_value.includes(siteId)) return;
                _onChange([..._value, siteId]);
              };
              return (
                <Stack spacing="10px">
                  <HStack>
                    {_value.map((blockedSiteId: string) => (
                      <SelectedSite
                        key={blockedSiteId}
                        siteId={blockedSiteId}
                        onClick={() => removeSite(blockedSiteId)}
                      />
                    ))}
                  </HStack>
                  <AutoComplete
                    onSuggest={suggestSites}
                    onChange={addSite}
                    disabled={
                      tempBlockMode === BLOCK_MODE_BLOCK_ALL || undefined
                    }
                    showSupplement
                    supplementItem={{
                      text: t('edit-task--add-new-site'),
                      key: 'ADD_NEW_SITE',
                    }}
                    onSupplement={onAddNewSite}
                  />
                </Stack>
              );
            }}
          />
        </FormControl>
        <FormControl id="task-max-duration">
          <FormLabel htmlFor="max-duration">
            {t('edit-task--maximum-duration')}
          </FormLabel>
          <Controller
            name="maxDuration"
            control={control}
            defaultValue={task.maxDuration}
            render={({ onChange: _onChange, value: _value }) => {
              const isUsed = _value !== -1;
              return (
                <Stack spacing="10px">
                  <Switch
                    onChange={(ev) => {
                      logger({ ev, target: ev.target });
                      _onChange(ev.target.checked ? 1 : -1);
                    }}
                    defaultChecked={isUsed}
                  />
                  {isUsed && (
                    <NumberInput
                      value={_value}
                      onChange={(strVal) => _onChange(Number(strVal))}
                      min={-1}
                    >
                      <NumberInputField />
                    </NumberInput>
                  )}
                  {!isUsed && (
                    <Text>{t('edit-task--maximum-duration-not-limited')}</Text>
                  )}
                </Stack>
              );
            }}
          />
        </FormControl>
        {isNewTask && (
          <Button type="submit" isLoading={loading} variant="solid">
            {t('edit-task--submit-new')}
          </Button>
        )}
        {!isNewTask && (
          <Button type="submit" isLoading={loading} variant="solid">
            {t('edit-task--submit-change')}
          </Button>
        )}
        {!isNewTask && !taskInProgress && (
          <Button variant="solid" colorScheme="teal" onClick={onTaskStart}>
            {t('edit-task--start-task')}
          </Button>
        )}
        {!isNewTask && taskInProgress && (
          <Button onClick={onTaskStop}>{t('edit-task--stop-task')}</Button>
        )}
      </Stack>
    </form>
  );
};

export default Task;
