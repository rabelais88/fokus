import React from 'react';
import { ACTION_REVALIDATE } from '@/constants';
import makeId from '../makeId';

// SWR revalidator
// validId = randomized number to check if newer validity check is required
// validType = keyof swr request type

interface miscState {
  validId: string;
}

const getDefaultState = (): miscState => ({
  validId: '',
});

interface setRevalidation {
  type: typeof ACTION_REVALIDATE;
}

export type miscActions = setRevalidation; // | ... so on

function miscReducer(state: miscState, action: miscActions): miscState {
  if (action.type === ACTION_REVALIDATE) {
    return {
      validId: makeId(),
    };
  }
  return state;
}

export const MiscContext = React.createContext<{
  state: miscState;
  dispatch: React.Dispatch<miscActions>;
}>({ state: getDefaultState(), dispatch: () => undefined });

export const MiscContextProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(miscReducer, getDefaultState());
  return (
    <MiscContext.Provider value={{ state, dispatch }}>
      {props.children}
    </MiscContext.Provider>
  );
};
