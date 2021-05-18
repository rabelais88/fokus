import React, { HTMLAttributes } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { useColorMode } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

// the component is written by igoro00
// https://gist.github.com/igoro00/99e9d244677ccafbf39667c24b5b35ed

const DatePicker = ({ ...props }: ReactDatePickerProps) => {
  const isLight = useColorMode().colorMode === 'light'; //you can check what theme you are using right now however you want
  return (
    // if you don't want to use chakra's colors or you just wwant to use the original ones,
    // set className to "light-theme-original" ↓↓↓↓
    <div className={isLight ? 'light-theme' : 'dark-theme'}>
      <ReactDatePicker
        className="react-datapicker__input-text" //input is white by default and there is no already defined class for it so I created a new one
        {...props}
      />
    </div>
  );
};

export default DatePicker;
