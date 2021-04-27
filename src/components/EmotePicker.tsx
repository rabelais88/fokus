import React from 'react';
import { Picker, PickerProps } from 'emoji-mart';
import { Box } from '@chakra-ui/layout';

interface EmotePickerProps extends PickerProps {}
const EmotePicker = (props: EmotePickerProps) => {
  return (
    <Box position="relative">
      <Box zIndex="dropdown" position="absolute">
        <Picker set={'apple'} {...props} />
      </Box>
    </Box>
  );
};

export default EmotePicker;
