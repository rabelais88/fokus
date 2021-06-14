import Emote from '@/components/Emote';
import { Box, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
const Donate = () => {
  const { t } = useTranslation();
  return (
    <Box
      mt={5}
      borderRadius={3}
      borderColor="teal.500"
      borderWidth={1}
      backgroundColor="teal.100"
      p={5}
    >
      <Link href="https://patreon.com/fokus_extension">
        <Emote emoji="man-bowing" size={24} />
        <Text display="inline">{t('patreon-link')}</Text>
      </Link>
      <br />
      <Trans
        i18nKey="donate-description"
        components={{
          lineBreak: <br />,
          coffeeEmote: <Emote emoji="coffee" size={24} />,
          gitLink: (
            <Link href="https://github.com/rabelais88/fokus" color="teal" />
          ),
        }}
      />
    </Box>
  );
};

export default Donate;
