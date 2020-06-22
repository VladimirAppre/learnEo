import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import Reducer from './reducer';

const enchancers = composeWithDevTools(
  applyMiddleware(thunkMiddleware)
);

const Store = createStore(Reducer, enchancers)

export default Store;
