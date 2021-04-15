import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import '@/i18n';

/**
 * @description
 * the top container that includes all default styles & settings for the rest
 */
const Document: React.FC = (props) => {
  return <ChakraProvider>{props.children}</ChakraProvider>;
};

export default Document;
