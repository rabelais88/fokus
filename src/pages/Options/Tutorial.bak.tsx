import intro from 'intro.js';
import React, { useRef, useEffect } from 'react';
import useRouter from '@/lib/useRouter';

const getEl = (q: string) => document.querySelector(q) as Element;
const hintEl = (elQuery: string, description: string) => ({
  element: getEl(elQuery),
  intro: description,
});

const Tutorial: React.FC = () => {
  const refMain = useRef<HTMLDivElement>(null);
  const { redirect } = useRouter();

  useEffect(() => {
    if (refMain.current !== null && refMain.current !== undefined) {
      const steps = [
        {
          title: 'welcome!',
          intro:
            'learn how to use this extension from this short tutorial. click next when you are ready!',
        },
        hintEl(
          '.tab-websites',
          'this tab shows all the website groups you have registered. try create website group first before creating a task.'
        ),
        hintEl(
          '.tab-tasks',
          'this tab shows all the tasks you have registered. create task that blocks websites according to website groups you have created earlier.'
        ),
        hintEl(
          '.tab-stats',
          'this tab shows statistics of your daily task assignments, and provides miscellaneous options.'
        ),
      ];
      intro()
        .setOptions({
          steps,
        })
        .onbeforechange(function () {
          // if (this._currentStep === 1) {
          //   redirect()
          // };
        })
        .oncomplete(() => {
          redirect('/tasks');
        })
        .start();
    }
  }, [refMain.current]);
  return <div ref={refMain} style={{ display: 'none' }}></div>;
};

export default Tutorial;
