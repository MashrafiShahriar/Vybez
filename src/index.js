
import './index.css';
import App from './App';
import router from './Helpers/router';
import ReactDOM from 'react-dom/client';

export const root = ReactDOM.createRoot(document.getElementById('root'));


const path = window.location.pathname
const pa = path.split("/")
pa.splice(0,1)
router(pa)


