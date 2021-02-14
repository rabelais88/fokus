import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import popupSend from '@/lib/senders/fromPopup';
import { MSG_COLOR_CHANGE } from '../../constants';
import useSites from '../../lib/useSites';
import makeLogger from '../../lib/makeLogger';
import addSite from '../../lib/addSite';

const logger = makeLogger('Popup.jsx');

const Popup = () => {
  const { sites, loadState } = useSites();
  const [userData, setUserData] = useState({ description: '', regex: '' });

  const sendMessage = () => {
    popupSend('TEST_MESSAGE');
    popupSend(MSG_COLOR_CHANGE, 'black');
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.js</code> and save to reload.
        </p>
        <button onClick={sendMessage}>send Message</button>
      </header>
      <ul>{liSites}</ul>

      <div>
        <h1>add your site</h1>
        <input
          type="text"
          onChange={(ev) =>
            setUserData({ ...userData, description: ev.target.value })
          }
        />
        <button onClick={onAddSiteClick}>add Site</button>
      </div>
    </div>
  );
};

export default Popup;
