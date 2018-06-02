import {AppRegistry} from 'react-native-web';
import createHistory from 'history/createBrowserHistory';
import startJsApp from './startJsApp';

const history = createHistory();

const Indocal = startJsApp(history);

AppRegistry.registerComponent('indocal', () => Indocal);
AppRegistry.runApplication('indocal', {
  rootTag: document.getElementById('html'),
});
