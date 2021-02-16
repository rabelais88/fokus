import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

const NavLink: React.FC<{ to: string }> = (props) => {
  return (
    <ChakraLink as={RouterLink} to={props.to}>
      {props.children}
    </ChakraLink>
  );
};

export default NavLink;
