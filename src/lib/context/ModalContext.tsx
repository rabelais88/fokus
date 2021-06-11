import React from 'react';
import { ACTION_SHOW_MODAL, ACTION_HIDE_MODAL } from '@/constants';
import ModalBase from '@/components/ModalBase';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

// Context For Modal

interface modalState {
  visible: boolean;
  content: ReactJSXElement;
}

const getDefaultState = (): modalState => ({
  visible: false,
  content: <div />,
});

interface showModal {
  type: typeof ACTION_SHOW_MODAL;
  content: ReactJSXElement;
}

interface hideModal {
  type: typeof ACTION_HIDE_MODAL;
}

export type modalActions = showModal | hideModal;

function modalReducer(state: modalState, action: modalActions): modalState {
  if (action.type === ACTION_SHOW_MODAL) {
    return { visible: true, content: action.content };
  }
  if (action.type === ACTION_HIDE_MODAL) {
    return { visible: false, content: getDefaultState().content };
  }
  return state;
}

export const ModalContext = React.createContext<{
  state: modalState;
  dispatch: React.Dispatch<modalActions>;
}>({ state: getDefaultState(), dispatch: () => undefined });

export const ModalContextProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(modalReducer, getDefaultState());
  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {props.children}
      <ModalBase
        children={state.content}
        isOpen={state.visible}
        onClose={() =>
          dispatch({
            type: ACTION_HIDE_MODAL,
          })
        }
      />
    </ModalContext.Provider>
  );
};
