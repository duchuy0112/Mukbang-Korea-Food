import './App.css';
import React, { Component } from 'react';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

class App extends Component {
  render() {
    return (
      <HelmetProvider>
        <MyProvider>
          <Login />
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </MyProvider>
      </HelmetProvider>
    );
  }
}

export default App;
