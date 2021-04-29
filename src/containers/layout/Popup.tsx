import { Center } from '@chakra-ui/react';
import React from 'react';

const POPUP_WIDTH = 320;
const POPUP_HEIGHT = (POPUP_WIDTH * 3) / 2;
const px = (val: number) => `${val}px`;
const LayoutPopup: React.FC = (props) => {
  return (
    <Center w={px(POPUP_WIDTH)} h={px(POPUP_HEIGHT)} p="6">
      {props.children}
    </Center>
  );
};

export default LayoutPopup;
