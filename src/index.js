import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import A2HS from "./components/addToHomePrompt2"
import store from './store/store'
import { Provider } from "react-redux";

ReactDOM.render((
  <BrowserRouter>
    <A2HS />
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
), document.getElementById('root'));

// serviceWorker.register();
