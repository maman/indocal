import {connectRoutes} from 'redux-first-router';
import _createRouterReducer from './reducer';

export const createRouterReducer = _createRouterReducer;
export {goToPage, notFound} from './action';

export function getRoutes(routes) {
  return Object.keys(routes).reduce(
    (prev, curr) => ({
      ...prev,
      ...(routes[curr].path
        ? {
            [curr]: {
              path: routes[curr].path,
            },
          }
        : {}),
    }),
    {}
  );
}

export function getComponents(routes) {
  return Object.keys(routes).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: routes[curr].component,
    }),
    {}
  );
}

export default function createReduxRouter(routes, history) {
  const options = {
    onBeforeChange: () => {},
    onAfterChange: () => {},
  };
  const {reducer, middleware, enhancer} = connectRoutes(
    history,
    routes,
    options
  );
  return {reducer, middleware, enhancer};
}
