import React from 'react';
import { ACTION_REVALIDATE, ACTION_REVALIDATE_DONE } from '@/constants';
const getDefaultState = () => ({
  revalidationRequired: false,
});

function miscReducer(state, action) {
  if (action.type === ACTION_REVALIDATE) {
    return {
      revalidationRequired: true,
    };
  }
  if (action.type === ACTION_REVALIDATE_DONE) {
    return { revalidationRequired: false };
  }
  return state;
}

const MiscContext = React.createContext(getDefaultState());

const MiscContextProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(miscReducer, getDefaultState());
  return (
    <MiscContext.Provider value={{ state, dispatch }}>
      {props.children}
    </MiscContext.Provider>
  );
};
