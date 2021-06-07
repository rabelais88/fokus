import Emote from '@/components/Emote';
import { QUERY_BLOCKED_URL } from '@/constants';
import useTaskNow from '@/lib/swr/useTaskNow';
import useQuery from '@/lib/useQuery';
import { Center, Heading, HStack, Link, Text, VStack } from '@chakra-ui/layout';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
const Blocked = () => {
  const blockedUrl = useQuery().get(QUERY_BLOCKED_URL) || '';
  const { hasTask, taskNow } = useTaskNow();
  const { t } = useTranslation();

  return (
    <Center height="50vh">
      <VStack>
        {hasTask && (
          <Heading size="sm">{t('site-blocked-current-focus')}</Heading>
        )}
        {!hasTask && (
          <>
            <Emote emoji="scream" size={50} />
            <Heading size="sm">{t('site-blocked-no-task')}</Heading>
            <Text color="gray.500">
              {t('site-blocked-no-task-description')}
            </Text>
          </>
        )}
        <HStack>
          <Emote emoji={taskNow.emojiId} size={32} />
          <Heading size="lg">{taskNow.title}</Heading>
        </HStack>
        <Text fontSize="lg">
          <Trans
            i18nKey="site-blocked-description"
            values={{ blockedUrl }}
            components={[<b />]}
          />
        </Text>

        <Link color="teal" href={blockedUrl}>
          {t('site-blocked-try-again')}
        </Link>
        <Text color="gray.500">{t('site-blocked-try-again-description')}</Text>
      </VStack>
    </Center>
  );
};

export default Blocked;
