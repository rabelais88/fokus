import React, { useState } from 'react';
import './Popup.css';
import popupSend from '@/lib/senders/fromPopup';
import { MSG_CHANGE_COLOR } from '@/constants';
import useSites from '@/lib/useSites';
import makeLogger from '@/lib/makeLogger';
import addSite from '@/lib/addSite';
import Document from '@/containers/Document';
import { PopupLayout } from '@/containers/layout';
import { Button, Heading, Input } from '@chakra-ui/react';

const logger = makeLogger('Popup.jsx');

const Popup = () => {
  const { sites, loadState } = useSites();
  const [userData, setUserData] = useState({ description: '', regex: '' });

  const sendMessage = () => {
    popupSend('TEST_MESSAGE');
    popupSend(MSG_CHANGE_COLOR, 'black');
  };

  const onAddSiteClick = async () => {
    logger('adding new site...', { userData });
    await addSite(userData.regex, userData.description);
  };

  const liSites = Object.entries(sites || {}).map(
    ([key, { description, regex }]) => (
      <li>
        {key} - {description}
      </li>
    )
  );

  return (
    <Document>
      <PopupLayout>
        <Button onClick={sendMessage}>send Message</Button>
        <ul>{liSites}</ul>

        <div>
          <Heading>add your site</Heading>
          <Input
            type="text"
            onChange={(ev) =>
              setUserData({ ...userData, description: ev.target.value })
            }
          />
          <Button onClick={onAddSiteClick}>add Site</Button>
        </div>
      </PopupLayout>
    </Document>
  );
};

export default Popup;
