import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login.jsx';
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Login />
    </GoogleOAuthProvider>
  );
}

export default App;
