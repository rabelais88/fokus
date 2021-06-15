import '@/i18n';
import chakraTheme from '@/lib/chakraTheme';
import { MiscContextProvider } from '@/lib/context/MiscContext';
import { ModalContextProvider } from '@/lib/context/ModalContext';
import { ChakraProvider } from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';
import React from 'react';

interface DocumentProp {
  resetCSS?: boolean;
}

/**
 * @description
 * the top container that includes all default styles & settings for the rest
 */
const Document: React.FC<DocumentProp> = (props) => {
  return (
    <MiscContextProvider>
      <ChakraProvider theme={chakraTheme} resetCSS={props.resetCSS}>
        <ModalContextProvider>{props.children}</ModalContextProvider>
      </ChakraProvider>
    </MiscContextProvider>
  );
};

export default Document;
