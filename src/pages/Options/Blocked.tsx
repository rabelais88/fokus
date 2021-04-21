import { QUERY_BLOCKED_URL } from '@/constants';
import useTaskNow from '@/lib/swr/useTaskNow';
import useQuery from '@/lib/useQuery';
import { Center, Heading, Text, VStack } from '@chakra-ui/layout';
import React from 'react';
import { Trans } from 'react-i18next';
const Blocked = () => {
  const blockedUrl = useQuery().get(QUERY_BLOCKED_URL);
  const { hasTask, taskNow } = useTaskNow();

  return (
    <Center height="50vh">
      <VStack>
        <Heading size="sm">you're now focusing for</Heading>
        <Heading size="lg">{taskNow.title}</Heading>
        <Text fontSize="lg">
          <Trans
            i18nKey="site-blocked-description"
            values={{ blockedUrl }}
            components={[<b />]}
          />
        </Text>
      </VStack>
    </Center>
  );
};

export default Blocked;
