import { Box, BoxProps, Divider, Stack } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { resetIdCounter, useCombobox } from 'downshift';
import { Input } from '@chakra-ui/input';
import makeLogger from '@/lib/makeLogger';
import { forwardRef } from '@chakra-ui/system';
import _omit from 'lodash/omit';

const logger = makeLogger('AutoComplete');

interface AutoCompleteItemProps extends BoxProps {
  chosen?: boolean;
}

const AutoCompleteItem = forwardRef<AutoCompleteItemProps, 'div'>(
  (props, ref) => {
    const _props = _omit(props, ['chosen']);
    if (props.chosen)
      return (
        <Box
          ref={ref}
          {..._props}
          backgroundColor="teal"
          color="white"
          p="10px"
          cursor="pointer"
          height="100%"
        ></Box>
      );
    return (
      <Box ref={ref} {..._props} p="10px" cursor="pointer" height="100%"></Box>
    );
  }
);

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onSuggest,
  onChange,
  showSupplement,
  onSupplement,
  supplementItem = { text: 'add new item', key: 'ADD_NEW_ITEM' },
}) => {
  const [suggestions, _setSuggestions] = useState<{ key: any; text: string }[]>(
    []
  );
  const setSuggestions = (s: { key: string; text: string }[]) => {
    if (showSupplement) _setSuggestions([...s, supplementItem]);
    else _setSuggestions(s);
  };

  const {
    getInputProps,
    getMenuProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    isOpen,
    reset,
  } = useCombobox({
    items: suggestions,
    itemToString(item) {
      if (!item) return '';
      return item.text || '';
    },
    async onInputValueChange({ inputValue }) {
      const req = await onSuggest(inputValue || '');
      if (req.error) return;
      setSuggestions(req.result);
    },
    onSelectedItemChange({ selectedItem, inputValue }) {
      if (!selectedItem) {
        onChange('');
        return;
      }
      if (
        selectedItem.key === supplementItem.key &&
        typeof onSupplement === 'function'
      ) {
        reset();
        onSupplement(inputValue || '');
        return;
      }
      onChange(selectedItem.key);
    },
  });

  return (
    <Box {...getComboboxProps()} position="relative">
      <Input
        {...getInputProps()}
        type="text"
        height="2.5rem"
        borderRadius="8px"
      />
      <Stack
        position="absolute"
        {...getMenuProps()}
        divider={<Divider />}
        boxShadow="md"
        maxHeight="200px"
        overflowY="auto"
        backgroundColor="white"
        zIndex={1}
      >
        {isOpen &&
          suggestions.map((item, index) => (
            <AutoCompleteItem
              {...getItemProps({ item, index })}
              key={item.key}
              chosen={index === highlightedIndex ? true : undefined}
            >
              {item.text}
            </AutoCompleteItem>
          ))}
      </Stack>
    </Box>
  );
};

export default AutoComplete;
