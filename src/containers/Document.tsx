import * as React from 'react';
import { ChakraProvider, Container } from '@chakra-ui/react';

/**
 * @description
 * the top container that includes all default styles & settings for the rest
 */
const Document: React.FC = (props) => {
  return <ChakraProvider>{props.children}</ChakraProvider>;
};

export default Document;
