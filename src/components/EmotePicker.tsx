import React from 'react';
import { Picker, PickerProps } from 'emoji-mart';
import { Box } from '@chakra-ui/layout';
import { DEFAULT_EMOJI_SET } from '@/constants';

interface EmotePickerProps extends PickerProps {}
const EmotePicker = (props: EmotePickerProps) => {
  return (
    <Box position="relative">
      <Box zIndex="dropdown" position="absolute">
        <Picker set={DEFAULT_EMOJI_SET} {...props} />
      </Box>
    </Box>
  );
};

export default EmotePicker;
