import miscStorage from '@/lib/miscStorage';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { Trans } from 'react-i18next';

// react-joyride does not support functional components (yet)
/**
 * @type {React.Component}
 * @augments {React.Component<unknown>}
 */
class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      steps: [],
      stepIndex: 0,
    };
  }

  setSteps() {
    const { t } = this.props;
    const getIntro = (key) => ({
      content: (
        <Trans
          i18nKey={`tutorial--${key}`}
          components={{ lineBreak: <br /> }}
        />
      ),
    });
    const steps = [
      {
        target: 'body',
        title: t('tutorial--welcome-title'),
        disableBeacon: true,
        ...getIntro('welcome'),
        placement: 'center',
      },
      {
        target: '[data-intro--tab-websites]',
        ...getIntro('tab-websites'),
      },
      {
        target: '[data-intro--tab-tasks]',
        ...getIntro('tab-tasks'),
      },
      {
        target: '[data-intro--tab-stats]',
        ...getIntro('tab-stats'),
      },
      {
        target: '[data-intro--tasks--search-box]',
        ...getIntro('tasks--searchbox'),
      },
      // 5
      {
        target: '[data-intro--tasks--btn-add]',
        ...getIntro('tasks--btn-add'),
      },
      {
        target: 'body',
        title: t('tutorial--task-title'),
        ...getIntro('task'),
      },
      {
        target: '[data-intro--task--block-mode]',
        ...getIntro('task--block-mode'),
      },
      {
        target: '[data-intro--task--allowed-sites]',
        ...getIntro('task--allowed-sites'),
      },
      {
        target: '[data-intro--task--blocked-sites]',
        ...getIntro('task--blocked-sites'),
      },
      // 10
      {
        target: '[data-intro--task--max-duration]',
        ...getIntro('task--max-duration'),
      },
      {
        target: '[data-intro--task--submit]',
        ...getIntro('task--submit'),
      },
      {
        target: 'body',
        title: t('tutorial--website-title'),
        content: t('tutorial--website'),
        placement: 'center',
      },
      {
        target: '[data-intro--website--url-mode]',
        ...getIntro('website--url-mode'),
      },
      {
        target: '[data-intro--website--url-regex]',
        ...getIntro('website--url-regex'),
      },
      // 15
      {
        target: '[data-intro--website--url-test]',
        ...getIntro('website--url-test'),
      },
      { target: '[data-intro--tab-donate]', ...getIntro('tab-donate') },
    ];
    this.setState({ ...this.state, steps });
  }

  async componentDidMount() {
    console.log('Tutorial mounted!');
    this.setSteps();
    this.updateValue();
  }

  async updateValue() {
    const skipTutorial = await miscStorage.get('skipTutorial');
    this.setState({ enabled: !skipTutorial });
  }

  async onExit() {
    await miscStorage.set('skipTutorial', true);
    this.updateValue();
  }

  /**
   * @description
   * handles react-joyride callbacks
   * @argument {import('react-joyride').CallBackProps} ev
   */
  onJoyrideCallback(ev) {
    const { joyride } = this.props;
    console.log('tutorial event', ev);

    const isPrev = ev.action === ACTIONS.PREV;
    const redirect = (targetPathName) => {
      console.log('tutorial redirecting');
      if (this.props?.location?.pathname === targetPathName) return;
      this.setState({ ...this.state, enabled: false });
      this.props.history.push(targetPathName);
      setTimeout(() => {
        console.log('tutorial waiting', document.querySelector(ev.step.target));
        // manually wait until components got updated
        this.setState({
          ...this.state,
          enabled: true,
          stepIndex: ev.index + (isPrev ? -1 : 1),
        });
      }, 500);
    };
    if (ev.type === EVENTS.TOUR_END && this.state.enabled) {
      this.onExit();
    } else if (ev.type === EVENTS.STEP_BEFORE) {
      console.log('tutorial before event');
      if (ev.index >= 4 && ev.index <= 5) {
        redirect('/tasks');
      }
      if (ev.index >= 6 && ev.index <= 11) {
        redirect('/task');
      }
      if (ev.index >= 12 && ev.index <= 15) {
        redirect('/website');
      }
    } else if (
      ev.type === EVENTS.STEP_AFTER ||
      ev.type === EVENTS.TARGET_NOT_FOUND
    ) {
      const nextIndex = ev.index + (isPrev ? -1 : 1);
      console.log('tutorial after event -> next index:', nextIndex);
      this.setState({ ...this.state, stepIndex: nextIndex });
    } else if (ev.type === EVENTS.TOOLTIP_CLOSE) {
      console.log('tutorial tooltip close');
      this.setState({ ...this.state, stepIndex: ev.index + 1 });
    }
    if (typeof Joyride.callback === 'function') {
      joyride.callback(ev);
    }
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <div
          data-tutorial-debug
          data-index={this.state.stepIndex}
          data-enabled={this.state.enabled}
        />
        <Joyride
          continuous
          run={this.state.enabled}
          steps={this.state.steps}
          stepIndex={this.state.stepIndex}
          showProgress
          showSkipButton
          callback={this.onJoyrideCallback.bind(this)}
          locale={{
            back: t('tutorial-prev'),
            next: t('tutorial-next'),
            last: t('tutorial-last'),
            skip: t('tutorial-skip'),
          }}
        />
      </>
    );
  }
}

export default withTranslation()(withRouter(Tutorial));
