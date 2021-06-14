import { Steps } from 'intro.js-react';
import React from 'react';
import { withRouter } from 'react-router-dom';
// import { withTranslation } from 'react-i18next';

// intro.js-react does not support typescript (yet)
// also does not support functional components (yet)
/**
 * @type {React.Component}
 * @augments {React.Component<unknown>}
 */
class Tutorial extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Tutorial mounted!');
  }

  render() {
    const { t } = this.props;
    console.log('translation', { t });
    const steps = [
      {
        title: 'welcome!',
        intro:
          'learn how to use this extension from this short tutorial. click next when you are ready!',
      },
      {
        element: '[data-intro--tab-websites]',
        intro:
          'this is where you have to visit first. this tab shows all the website groups you have registered. try create website group first before creating a task.',
      },
      {
        element: '[data-intro--tab-tasks]',
        intro:
          'this tab shows all the tasks you have registered. create task that blocks websites according to website groups you have created earlier.',
      },
      {
        element: '[data-intro--tab-stats]',
        intro:
          'this tab shows statistics of your daily task assignments, and provides miscellaneous options.',
      },
      {
        element: '[data-intro--tasks--search-box]',
        intro: 'searchbox',
      },
      // 5
      {
        element: '[data-intro--tasks--btn-add]',
        intro: 'addbutton',
      },
      {
        title: 'adding/editing task',
        intro: '...',
      },
      { element: '[data-intro--task--block-mode]', intro: 'block mode' },
      { element: '[data-intro--task--allowed-mode]', intro: 'allowed sites' },
      { element: '[data-intro--task--blocked-sites]', intro: 'blocked sites' },
      // 10
      { element: '[data-intro--task--max-duration]', intro: 'max duration' },
      { element: '[data-intro--task--submit]', intro: 'submit task' },
      { title: 'adding/editing website', intro: '...' },
      { element: '[data-intro--website--url-mode]', intro: 'url mode' },
      { element: '[data-intro--website--url-regex]', intro: 'url regex' },
      // 15
      { element: '[data-intro--website--url-test]', intro: 'url test' },
      { element: '[data-intro--tab-donate]', intro: '' },
    ];
    const onExit = () => {
      // blank
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

    return (
      <Steps
        steps={steps}
        onExit={onExit}
        initialStep={0}
        onBeforeChange={onBeforeChange.bind(this)}
        ref={setRef.bind(this)}
        enabled
      />
    );
  }
}

export default withRouter(Tutorial);