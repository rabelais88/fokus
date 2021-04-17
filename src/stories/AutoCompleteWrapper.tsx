import React, { useState } from 'react';
import AutoComplete from '@/components/AutoComplete';
import { Box, Text } from '@chakra-ui/layout';

const AutoCompleteWrapper = () => {
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

  const [value, setValue] = useState('');

  const onChange = (_value: string) => {
    if (_value === '') return;
    setValue(_value);
  };

  return (
    <Box>
      <Text>current value: {value}</Text>
      <AutoComplete
        onSuggest={onSuggest}
        onChange={onChange}
        showSupplement
        onSupplement={() => {
          alert('adding new item');
        }}
      />
      <Text>sample text...</Text>
    </Box>
  );
};

export default AutoCompleteWrapper;
