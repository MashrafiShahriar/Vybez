import logo from './logo.svg';
import './App.css';
// import {Helmet} from "react-helmet";

function App() {
  return (
    <div className="App">
      {/* <Helmet> */}
                <meta charSet="utf-8" />
                <title>Artist Portal</title>
                <link rel="canonical" href="#" />
            {/* </Helmet> */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
       
      </header>
    </div>
  );
}

export default App;
