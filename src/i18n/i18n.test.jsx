import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const TimeFormatApp = () => {
  const { t } = useTranslation();
  const time = new Date('2020-01-01 00:00').getTime();
  return (
    <div>
      <h1>{t('tab-tasks')}</h1>
      <p data-testid="date">{t('daily-task-time-format', { time })}</p>
    </div>
  );
};

describe('i18n', () => {
  it('testing dateformat and basic localization', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TimeFormatApp />
      </I18nextProvider>
    );
    expect(screen.getByTestId('date')).toHaveTextContent('00:00');
    expect(screen.getByRole('heading')).toHaveTextContent('tasks');
  });
});
