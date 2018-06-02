import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import startJsApp from './startJsApp';

const history = createHistory();

ReactDOM.hydrate(startJsApp(history), document.getElementById('html'));
