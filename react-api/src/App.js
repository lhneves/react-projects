import React from 'react';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store';
import History from './services/history';
import Routes from './routes';

import Header from './components/Header';

import GlobalStyles from './styles/GlobalStyles';

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Router history={History}>
                    <Header />
                    <Routes />
                    <GlobalStyles />
                    <ToastContainer
                        autoClose={3000}
                        className="toast-container"
                    />
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default App;
