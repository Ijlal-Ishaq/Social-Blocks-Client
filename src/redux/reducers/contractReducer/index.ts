type ActionType = {
  type?: string;
  payload?: any;
};

type StateType = {
  contract: any;
};

const initState: StateType = {
  contract: null,
};

const contractReducer = (
  state: StateType = initState,
  action: ActionType
): StateType => {
  switch (action.type) {
    case "SET_CONTRACT_INSTANCE": {
      return {
        ...state,
        contract: action.payload,
      };
    }
  }

  return state;
};

export default contractReducer;
