import React from 'react';
import Document from '@/containers/Document';
import { Heading, Center, Text, Button } from '@chakra-ui/react';
import { NewtabLayout } from '@/containers/layout';
import openSettings from '@/lib/openSettings';
import { Trans } from 'react-i18next';

const Newtab = () => {
  return (
    <Document>
      <NewtabLayout>
        <Center>
          <Heading>
            <Trans>newtab-heading</Trans>🤚
          </Heading>
        </Center>
        <Center>
          <Text>
            <Trans>newtab-description</Trans>
          </Text>
        </Center>
        <Center>
          <Button onClick={() => openSettings()}>
            <Trans>newtab-open-settings</Trans>
          </Button>
        </Center>
      </NewtabLayout>
    </Document>
  );
};

export default Newtab;
