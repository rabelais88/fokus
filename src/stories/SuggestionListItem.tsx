import React from 'react';

const SuggestionListItem: React.FC<SuggestionItemProps> = ({
  id,
  text,
  onItemClick,
  selected,
}) => {
  const _style = selected ? { backgroundColor: 'red' } : {};
  return (
    <div onClick={() => onItemClick(id, text)} style={_style}>{`${text}`}</div>
  );
};

export default SuggestionListItem;
