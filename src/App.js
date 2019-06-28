import React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.css';

function App() {
  return <>Hello from App</>;
}

export default (process.env.NODE_ENV === 'development' ? hot(App) : App);
