import axios from 'axios';
import React, { Component } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';
import MyProvider from "./contexts/MyProvider";

// ================= VERSION 1: SIMPLE CUSTOMER PAGE =================
class CustomerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Loading...'
    };
  }

  componentDidMount() {
    axios.get('/hello').then((res) => {
      const result = res.data;
      this.setState({ message: result.message });
    });
  }

  handleClick = () => {
    alert('Button clicked!');
  };

  handleHomeClick = () => {
    alert('Home button clicked!');
  };

  handleContactClick = () => {
    alert('Contact button clicked!');
  };

  handleInfo1Click = () => {
    alert('Thông tin 1 button clicked!');
  };

  handleInfo2Click = () => {
    alert('Thông tin 2 button clicked!');
  };

  handleInfo3Click = () => {
    alert('Thông tin 3 button clicked!');
  };

  handleMenu1Click = () => {
    alert('Menu Item 1 button clicked!');
  };

  handleMenu2Click = () => {
    alert('Menu Item 2 button clicked!');
  };

  render() {
    return (
      <div>
        <h2>Customer page</h2>
        <p>{this.state.message}</p>
        <button onClick={this.handleClick}>Nút</button>
        <button onClick={this.handleHomeClick}>Home</button>
        <button onClick={this.handleContactClick}>Contact</button>
        <button onClick={this.handleInfo1Click}>Thông tin 1</button>
        <button onClick={this.handleInfo2Click}>Thông tin 2</button>
        <button onClick={this.handleInfo3Click}>Thông tin 3</button>
        <button onClick={this.handleMenu1Click}>Menu Item 1</button>
        <button onClick={this.handleMenu2Click}>Menu Item 2</button>
        {/* Xóa hoặc thay thế các thẻ <a href="#"> */}
        {/* <a href="#">Home</a> */}
        {/* <a href="#">Contact</a> */}
        <a href="/about">About</a>
      </div>
    );
  }
}

// ================= VERSION 2: MAIN COMPONENT WRAPPER =================
class App extends Component {
  render() {
    return (
      <HelmetProvider>
        <MyProvider>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </MyProvider>
      </HelmetProvider>
    );
  }
}

export { CustomerApp };
export default App;