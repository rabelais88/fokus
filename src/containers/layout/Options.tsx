import * as React from 'react';
import { Box, Center } from '@chakra-ui/react';

const LayoutOptions: React.FC = (props) => {
  return (
    <Center>
      <Box
        width={['95%', '1000px']}
        paddingTop={['5px', '30px']}
        paddingX={['15px', 'none']}
        className="fokus-options--layout"
        h="100vh"
      >
        {props.children}
      </Box>
    </Center>
  );
};

export default LayoutOptions;
