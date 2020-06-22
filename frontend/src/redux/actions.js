import { TEXT_CHANGE } from './actionTypes';

export const textChange = function (text) {
  return {
    type: TEXT_CHANGE,
    payload: text,
  }
}
