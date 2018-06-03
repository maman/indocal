// @flow

import {NOT_FOUND} from 'redux-first-router';

const routes = {
  HOME: {
    path: '/',
    component: 'Home',
  },
  USER: {
    path: '/user/:name',
    component: 'User',
  },
  [NOT_FOUND]: {
    component: 'Errors',
  },
};

export default routes;
