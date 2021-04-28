import React from 'react';
import { Emoji, EmojiProps } from 'emoji-mart';
import { DEFAULT_EMOJI_SET } from '@/constants';

interface EmoteProp extends EmojiProps {}

const Emote = (props: EmoteProp) => {
  return <Emoji set={DEFAULT_EMOJI_SET} {...props} />;
};

export default Emote;
