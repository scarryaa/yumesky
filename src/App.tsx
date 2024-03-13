import './App.scss';
import Login from './screens/Login';

function App() {
  const handleLogin = (username: string, password: string) => {
    console.log(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className="app">
      <Login onSubmit={handleLogin} />
    </div>
  );
}

export default App;
