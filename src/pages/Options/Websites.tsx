import useSites from '@/lib/useSites';
import { Box, Heading, List, ListItem } from '@chakra-ui/react';
import React from 'react';

const Websites: React.FC = (props) => {
  const { loadState, sites } = useSites();
  const _sites = sites || [];
  return (
    <Box>
      <Heading>Websites</Heading>
      <List>
        {_sites.map((site) => (
          <ListItem>{site.description}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Websites;
