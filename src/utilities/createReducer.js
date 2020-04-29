import createNextState from "immer";

function createReducerImmer(initialState, actionsMap) {
  return function reducer(state = initialState, action) {
    return createNextState(state, draft => {
      const caseReducer = actionsMap[action.type];
      if (caseReducer) {
        return caseReducer(draft, action);
      }
      return caseReducer ? caseReducer(draft, action) : undefined;
    });
  };
}

export default createReducerImmer;
