import React from 'react';
import { render } from 'react-dom';

import Document from '@/containers/Document';
import { OptionsLayout } from '@/containers/layout';
import { Heading } from '@chakra-ui/react';

const Options = (
  <Document>
    <OptionsLayout>
      <Heading>Options Page</Heading>
    </OptionsLayout>
  </Document>
);

render(Options, window.document.querySelector('#app-container'));
