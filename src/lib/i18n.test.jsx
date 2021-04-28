import React from 'react';
import { render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const TimeFormatApp = () => {
  const { t } = useTranslation();
  const time = new Date('2020-01-01 00:00').getTime();
  return <div>{t('daily-task-time-format', { time })}</div>;
};

describe('dailyTimeFormat', () => {
  it('2000-01-01 00:00', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TimeFormatApp />
      </I18nextProvider>
    );
  });
});
