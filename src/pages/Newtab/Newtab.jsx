import React from 'react';
// import logo from '../../assets/img/logo.svg';
// import './Newtab.css';
// import './Newtab.scss';
import Document from '@/containers/Document';
import { Heading, Center, Text, Button } from '@chakra-ui/react';
import { NewtabLayout } from '@/containers/layout';
import openSettings from '@/lib/openSettings';

const Newtab = () => {
  return (
    <Document>
      <NewtabLayout>
        <Center>
          <Heading>Welcome🤚</Heading>
          <Text>before proceeding to web pages,</Text>
        </Center>
        <Center>
          <Text>Please check these to get focused on your work</Text>
        </Center>
        <Button onClick={openSettings}>
          click this button to open settings
        </Button>
      </NewtabLayout>
    </Document>
  );
};

export default Newtab;
