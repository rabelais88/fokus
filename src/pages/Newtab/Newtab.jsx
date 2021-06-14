import React from 'react';
import Document from '@/containers/Document';
import { Heading, Center, Text, Button } from '@chakra-ui/react';
import { NewtabLayout } from '@/containers/layout';
import changeCurrentTab from '@/lib/changeCurrentTab'
import getSettingsUrl from '@/lib/getSettingsUrl';
import Emote from '@/components/Emote';
import { useTranslation } from 'react-i18next';

const Newtab = () => {
  const { t } = useTranslation();
  return (
    <Document>
      <NewtabLayout>
        <Center>
          <Heading>
            <Text display="inline">{t('newtab-heading')}</Text>
            <Emote emoji="hand" size={40} />
          </Heading>
        </Center>
        <Center>
          <Text
            dangerouslySetInnerHTML={{ __html: t('newtab-description') }}
          ></Text>
        </Center>
        <Center>
          <Button onClick={() => changeCurrentTab(getSettingsUrl())}>
            {t('newtab-open-settings')}
          </Button>
        </Center>
      </NewtabLayout>
    </Document>
  );
};

export default Newtab;
