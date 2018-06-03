export default function createRouterReducer(componentsMap) {
  return function routerReducer(state = 'HOME', action = {}) {
    return componentsMap[action.type] || state;
  };
}
