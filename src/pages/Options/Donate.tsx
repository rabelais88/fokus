import Emote from '@/components/Emote';
import { Box, Link, List, ListItem, Text } from '@chakra-ui/layout';
import React from 'react';
import { useTranslation } from 'react-i18next';
const Donate = () => {
  const { t } = useTranslation();
  return (
    <Box mt={5}>
      <Link href="https://patreon.com/fokus_extension">
        <Emote emoji="man-bowing" size={24} />
        <Text display="inline">{t('patreon-link')}</Text>
      </Link>
      <Text>I made this chrome extension because,</Text>
      <List>
        <ListItem>Say no to clunky UIs</ListItem>
        <ListItem>Say no to unnecessary sign-in steps</ListItem>
        <ListItem>No more Pay-to-unlock apps</ListItem>
        <ListItem>
          To put priority on my work, no time to waste for chores
        </ListItem>
        <ListItem>To stay away from addictive internet</ListItem>
        <ListItem>To remain connected to outside world</ListItem>
      </List>
      <Text>
        If you're pleased with this app, <br />
        please buy me a coffee
        <Emote emoji="coffee" size={24} />
        <br />
        or share your thoughts on
        <Link href="https://github.com/rabelais88/fokus" color="teal">
          This Github
        </Link>
      </Text>
      <Text>this extension will stay free forever!</Text>
    </Box>
  );
};

export default Donate;
