import miscStorage from '@/lib/miscStorage';
import { Steps } from 'intro.js-react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

// intro.js-react does not support typescript (yet)
// also does not support functional components (yet)
/**
 * @type {React.Component}
 * @augments {React.Component<unknown>}
 */
class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
    };
  }

  async componentDidMount() {
    console.log('Tutorial mounted!');
    this.updateValue();
  }

  async updateValue() {
    const skipTutorial = await miscStorage.get('skipTutorial');
    this.setState({ enabled: !skipTutorial });
  }

  render() {
    const { t } = this.props;
    console.log('translation', { t });
    const getIntro = (key) => ({ intro: t(`tutorial--${key}`) });
    const steps = [
      {
        title: t('tutorial--welcome-title'),
        ...getIntro('welcome'),
      },
      {
        element: '[data-intro--tab-websites]',
        ...getIntro('tab-websites'),
      },
      {
        element: '[data-intro--tab-tasks]',
        ...getIntro('tab-tasks'),
      },
      {
        element: '[data-intro--tab-stats]',
        ...getIntro('tab-stats'),
      },
      {
        element: '[data-intro--tasks--search-box]',
        ...getIntro('tasks--searchbox'),
      },
      // 5
      {
        element: '[data-intro--tasks--btn-add]',
        ...getIntro('tasks--btn-add'),
      },
      {
        title: t('tutorial--task-title'),
        ...getIntro('task'),
      },
      {
        element: '[data-intro--task--block-mode]',
        ...getIntro('task--block-mode'),
      },
      {
        element: '[data-intro--task--allowed-sites]',
        ...getIntro('task--allowed-sites'),
      },
      {
        element: '[data-intro--task--blocked-sites]',
        ...getIntro('task--blocked-sites'),
      },
      // 10
      {
        element: '[data-intro--task--max-duration]',
        ...getIntro('task--max-duration'),
      },
      {
        element: '[data-intro--task--submit]',
        ...getIntro('task--submit'),
      },
      { title: t('tutorial--website-title'), ...getIntro('website') },
      {
        element: '[data-intro--website--url-mode]',
        ...getIntro('website--url-mode'),
      },
      {
        element: '[data-intro--website--url-regex]',
        ...getIntro('website--url-regex'),
      },
      // 15
      {
        element: '[data-intro--website--url-test]',
        ...getIntro('website--url-test'),
      },
      { element: '[data-intro--tab-donate]', ...getIntro('tab-donate') },
    ];
    const onExit = async (stepIndex) => {
      await miscStorage.set('skipTutorial', true);
      this.updateValue();
    };
    function onBeforeChange(nextStepIndex) {
      console.log('current route', this?.props.location);
      // return false to prevent step to next
      if (nextStepIndex >= 4 && nextStepIndex <= 5) {
        if (this.props?.location?.pathname !== '/tasks')
          this.props.history.push('/tasks');
      }
      if (nextStepIndex >= 6 && nextStepIndex <= 11) {
        if (this.props?.location?.pathname !== '/task')
          this.props.history.push('/task');
      }
      if (nextStepIndex >= 12 && nextStepIndex <= 15) {
        if (this.props?.location?.pathname !== '/website')
          this.props.history.push('/website');
      }
      if (this.steps) {
        this.steps.updateStepElement(nextStepIndex);
      }
    }

    function setRef(_steps) {
      return (this.steps = _steps);
    }

    if (!this.state.enabled) {
      return <div data-tutorial-loading></div>;
    }

    return (
      <Steps
        steps={steps}
        onExit={onExit.bind(this)}
        initialStep={0}
        onBeforeChange={onBeforeChange.bind(this)}
        ref={setRef.bind(this)}
        options={{
          nextLabel: t('tutorial--next'),
          prevLabel: t('tutorial--prev'),
          doneLabel: t('tutorial--done'),
          skipLabel: t('tutorial--skip'),
        }}
        enabled
      />
    );
  }
}

export default withTranslation()(withRouter(Tutorial));
