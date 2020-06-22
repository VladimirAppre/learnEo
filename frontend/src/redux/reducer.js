import { TEXT_CHANGE } from './actionTypes';

function Reducer(state = {}, action) {
  switch (action.type) {
    case TEXT_CHANGE: {
      const newState = {
        ...state,
        parrotText: action.payload,
      }
      return newState;
    }

    default: {
      return state;
    };
  };
};

export default Reducer
