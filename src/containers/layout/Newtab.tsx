import * as React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

const LayoutNewtab: React.FC = (props) => {
  return (
    <Grid
      p={[5, 25]}
      className="wisetimer-newtab--layout"
      h="100vh"
      templateRows="repeat(3,1fr)"
    >
      <GridItem rowSpan={1} />
      <GridItem rowSpan={1}>{props.children}</GridItem>
      <GridItem rowSpan={1} />
    </Grid>
  );
};

export default LayoutNewtab;
