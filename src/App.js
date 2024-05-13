import logo from './logo.svg';
import './App.css';
import ProductListing from './Pages/ProductListing';
import { MantineProvider } from '@mantine/core';
function App() {
  return (

    <MantineProvider theme={{ loader: 'oval' }}>
      <div className="App">
        <ProductListing />
      </div>
    </MantineProvider>
  );
}

export default App;
