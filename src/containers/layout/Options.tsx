import * as React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';

const LayoutOptions: React.FC = (props) => {
  return (
    <Box p={[5, 30]} className="fokus-options--layout" h="100vh">
      {props.children}
    </Box>
  );
};

export default LayoutOptions;
