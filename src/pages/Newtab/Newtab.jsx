import React from 'react';
import Document from '@/containers/Document';
import { Heading, Center, Text, Button } from '@chakra-ui/react';
import { NewtabLayout } from '@/containers/layout';
import openSettings from '@/lib/openSettings';
import Emote from '@/components/Emote';
import { useTranslation } from 'react-i18next';

const Newtab = () => {
  const { t } = useTranslation();
  return (
    <Document>
      <NewtabLayout>
        <Center>
          <Heading>
            <Text>{t('newtab-heading')}</Text>
            <Emote emoji="hand" size={40} />
          </Heading>
        </Center>
        <Center>
          <Text>{t('newtab-description')}</Text>
        </Center>
        <Center>
          <Button onClick={() => openSettings()}>
            {t('newtab-open-settings')}
          </Button>
        </Center>
      </NewtabLayout>
    </Document>
  );
};

export default Newtab;
