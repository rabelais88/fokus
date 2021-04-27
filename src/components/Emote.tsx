import React from 'react';
import { Emoji, EmojiProps } from 'emoji-mart';

interface EmoteProp extends EmojiProps {}

const Emote = (props: EmoteProp) => {
  return <Emoji set={'google'} {...props} />;
};

export default Emote;
