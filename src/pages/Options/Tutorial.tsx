import intro from 'intro.js';
import React, { useRef, useEffect } from 'react';

const Tutorial: React.FC = () => {
  const refMain = useRef<HTMLDivElement>(null);

  const getEl = (q: string) => document.querySelector(q) as Element;

  useEffect(() => {
    console.log('useEffect');
    if (!refMain.current !== null && refMain.current !== undefined) {
      console.log('start intro');
      const steps = [
        {
          title: 'welcome!',
          intro:
            'learn how to use this extension from this short tutorial. click next when you are ready!',
        },
        {
          element: getEl('.tab-websites'),
          intro:
            'this tab shows all the website groups you have registered. try create website group first before create a task.',
        },
        {
          element: getEl('.tab-tasks'),
          intro:
            'this tab shows all the tasks you have registered. create task that blocks websites according to website groups you have created earlier.',
        },
      ];
      intro()
        .setOptions({
          steps,
        })
        .start();
    }
  }, [refMain.current]);
  return <></>;
};

export default Tutorial;
