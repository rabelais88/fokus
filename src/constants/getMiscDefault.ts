export interface miscState {
  skipTutorial: boolean;
  debug: boolean;
}

function getMiscDefault(): miscState {
  return {
    skipTutorial: false,
    debug: false,
  };
}

export default getMiscDefault;
