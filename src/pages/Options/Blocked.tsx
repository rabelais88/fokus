import { QUERY_BLOCKED_URL } from '@/constants';
import useQuery from '@/lib/useQuery';
import { Box, Text } from '@chakra-ui/layout';
import React from 'react';
import { Trans } from 'react-i18next';
const Blocked = () => {
  const blockedUrl = useQuery().get(QUERY_BLOCKED_URL);
  return (
    <Box>
      <Trans
        i18nKey="site-blocked-description"
        values={{ blockedUrl }}
        components={[<b />]}
      />
    </Box>
  );
};

export default Blocked;
