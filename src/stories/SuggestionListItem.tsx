import { Box } from '@chakra-ui/react';
import React from 'react';

const SuggestionListItem: React.FC<SuggestionItemProps> = ({
  id,
  text,
  onItemClick,
  selected,
}) => {
  if (selected)
    return (
      <Box
        onClick={() => onItemClick(id, text)}
        paddingX="4"
        paddingY="4"
        backgroundColor="gray"
        role="li"
      >{`${text}`}</Box>
    );
  return (
    <Box
      onClick={() => onItemClick(id, text)}
      paddingX="4"
      paddingY="4"
      role="li"
    >{`${text}`}</Box>
  );
};

export default SuggestionListItem;
