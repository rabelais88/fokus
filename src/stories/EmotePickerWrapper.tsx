import React, { useState } from 'react';
import EmotePicker from '@/components/EmotePicker';
import Emote from '@/components/Emote';

const EmotePickerWrapper = () => {
  const [emoji, setEmoji] = useState('happy');
  return (
    <div>
      <p>
        <span>selected Emoji:</span>
        <Emote emoji={emoji} size={32} />
      </p>
      <EmotePicker
        emoji={emoji}
        onSelect={(emoji) => {
          if (!emoji) return;
          setEmoji(emoji.id || '');
        }}
      />
    </div>
  );
};

export default EmotePickerWrapper;
