import { LOAD_FAIL, LOAD_INIT, LOAD_LOADING, LOAD_SUCCESS } from '@/constants';
import { Box, Divider, Input, Stack } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('components/Suggestion');

const Suggestion: React.FC<SuggestionMultipleProps> = ({
  onSuggest,
  keyword,
  value,
  onValueChange,
  onKeywordChange,
  itemComponent: Item,
  loadingComponent: Loading,
  noResultComponent: NoResult,
  hideSelected = true,
}) => {
  const [loadState, setLoadState] = useState(LOAD_INIT);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [focused, setFocus] = useState(false);

  const _requestSuggestion = async (_keyword: string) => {
    const req = await onSuggest(_keyword);
    if (req.error) {
      setLoadState(LOAD_FAIL);
      return;
    }
    logger('_requestSuggestion', { req });
    setSuggestions(req.result);
    setLoadState(LOAD_SUCCESS);
  };

  const requestSuggestion = useDebounceCallback(_requestSuggestion, 300, false);

  const _onKeywordChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const _value = ev.target.value;
    onKeywordChange(_value);
    setLoadState(LOAD_LOADING);
    requestSuggestion(_value);
  };

  const onItemClick = (id: string, text: string) => {
    const newValue = Array.from(new Set([...value, id]));
    onValueChange(newValue);
    onKeywordChange('');
    setFocus(false);
  };

  const onInputFocus = () => {
    setFocus(true);
    requestSuggestion(keyword);
  };

  return (
    <Box>
      <Input
        type="text"
        value={keyword}
        onChange={_onKeywordChange}
        onFocus={onInputFocus}
      />
      {focused && loadState === LOAD_SUCCESS && suggestions.length >= 1 && (
        <Stack
          divider={<Divider />}
          spacing={2}
          boxShadow="md"
          borderRadius="12px"
        >
          {suggestions.map(({ key, text }) => (
            <Item
              id={key}
              key={key}
              text={text}
              onItemClick={onItemClick}
              selected={value.includes(key)}
            />
          ))}
        </Stack>
      )}
      {focused && loadState === LOAD_SUCCESS && suggestions.length === 0 && (
        <NoResult />
      )}
      {focused && loadState === LOAD_LOADING && <Loading />}
    </Box>
  );
};

export default Suggestion;
