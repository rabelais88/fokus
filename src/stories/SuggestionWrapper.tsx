import Suggestion from '@/components/Suggestion.tsx';
import { Box, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import SuggestionListItem from './SuggestionListItem';

const LoadingComponent = () => {
  return <div>loading</div>;
};

const noResultComponent = () => {
  return <div>no result</div>;
};

const SuggestionWrapper = () => {
  const [keyword, setKeyword] = useState('');
  const [value, setValue] = useState('');
  const onSuggest = async (keyword: string) => {
    try {
      const url = 'https://jsonplaceholder.typicode.com/posts';
      const req = await fetch(url);
      const listData = await req.json();
      const re = new RegExp(keyword, 'i');
      interface sampleItem {
        title: string;
        body: string;
        id: string;
      }
      const result = listData
        .filter((itm: sampleItem) => re.test(itm.title) || re.test(itm.body))
        .map((itm: sampleItem) => ({ key: itm.id, text: itm.body }))
        .slice(0, 15);
      return { result, error: null, errorCode: '' };
    } catch (error) {
      return { error, errorCode: 'NO_ERROR_CODE', result: null };
    }
  };

  return (
    <Box height="100%">
      <Text>current value: {`${value}`}</Text>
      <Suggestion
        keyword={keyword}
        onKeywordChange={(v) => setKeyword(v)}
        value={value}
        onValueChange={(v) => setValue(v)}
        itemComponent={SuggestionListItem}
        onSuggest={onSuggest}
        loadingComponent={LoadingComponent}
        noResultComponent={noResultComponent}
      />
    </Box>
  );
};

export default SuggestionWrapper;
