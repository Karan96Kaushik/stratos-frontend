import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import A2HS from "./components/addToHomePrompt2"

ReactDOM.render((
  <BrowserRouter>
    <A2HS />
    <App />
  </BrowserRouter>
), document.getElementById('root'));

// serviceWorker.register();
