import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';

import createReduxRouter, {
  createRouterReducer,
  goToPage,
  notFound,
  getComponents,
  getRoutes,
} from './router';

function composeEnhancers(...args) {
  return typeof window !== 'undefined'
    ? composeWithDevTools({actionCreators: {goToPage, notFound}})(...args)
    : compose(...args);
}

export default function configureStore({history, routes, preloadState}) {
  const routesMap = getRoutes(routes);
  const componentsMap = getComponents(routes);
  const {reducer, middleware, enhancer} = createReduxRouter(routesMap, history);
  const rootReducer = combineReducers({
    page: createRouterReducer(componentsMap),
    location: reducer,
  });
  const middlewares = applyMiddleware(middleware);
  const enhancers = composeEnhancers(enhancer, middlewares);
  const store = createStore(rootReducer, preloadState, enhancers);
  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept();
    const rootReducer = combineReducers({
      page: createRouterReducer(componentsMap),
      location: reducer,
    });
    store.replaceReducer(rootReducer);
  }
  return store;
}
