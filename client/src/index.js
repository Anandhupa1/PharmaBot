import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <ChakraProvider>
    <CSSReset />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>
);

reportWebVitals();
