import React from 'react';
import { Picker, PickerProps } from 'emoji-mart';

interface EmotePickerProps extends PickerProps {}
const EmotePicker = (props: EmotePickerProps) => {
  return <Picker set={'apple'} {...props} />;
};

export default EmotePicker;
