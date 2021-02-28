import { LOAD_FAIL, LOAD_INIT, LOAD_LOADING, LOAD_SUCCESS } from '@/constants';
import { Box, Input, Stack } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('components/Suggestion');

const Suggestion: React.FC<SuggestionProps> = ({
  onSuggest,
  keyword,
  value,
  onValueChange,
  onKeywordChange,
  itemComponent: Item,
  loadingComponent: Loading,
  noResultComponent: NoResult,
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
    onValueChange(id);
    onKeywordChange(text);
    setFocus(false);
  };

  const onInputFocus = () => {
    setFocus(true);
    requestSuggestion(keyword);
  };

  return (
    <Box>
      <Input
        value={keyword}
        onChange={_onKeywordChange}
        onFocus={onInputFocus}
      />
      {focused && loadState === LOAD_SUCCESS && suggestions.length >= 1 && (
        <Stack>
          {suggestions.map(({ key, text }) => (
            <Item
              id={key}
              key={key}
              text={text}
              onItemClick={onItemClick}
              selected={value === key}
            />
          ))}
        </Stack>
      )}
      {focused && loadState === LOAD_SUCCESS && suggestions.length === 0 && (
        <Loading />
      )}
      {focused && loadState === LOAD_LOADING && <NoResult />}
    </Box>
  );
};

export default Suggestion;
