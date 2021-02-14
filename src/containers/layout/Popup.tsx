import { Container } from '@chakra-ui/react';
import React from 'react';

const LayoutPopup: React.FC = (props) => {
  return (
    <Container w="640px" h="480px" centerContent={true} p="6">
      {props.children}
    </Container>
  );
};

export default LayoutPopup;
