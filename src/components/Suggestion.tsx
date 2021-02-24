import { Input } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

interface SuggestionProps {
  onSuggest: suggest;
  value: string;
  onKeywordChange: ChangeEvent;
}

const Suggestion: React.FC<SuggestionProps> = ({
  onSuggest,
  value,
  onKeywordChange,
}) => {
  const _onKeywordChange = (ev) => {
    const _value = ev.target.value;
    onKeywordChange(_value);
  };

  return (
    <div>
      <Input onChange={_onKeywordChange} />
    </div>
  );
};

export default Suggestion;
