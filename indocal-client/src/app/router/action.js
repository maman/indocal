import {NOT_FOUND} from 'redux-first-router';

export function goToPage(type, param) {
  return {
    type,
    payload: param && {param},
  };
}

export function notFound() {
  return {
    type: NOT_FOUND,
  };
}
