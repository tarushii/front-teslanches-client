import {
  BrowserRouter as Router, Route, Switch, Redirect
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';

import SingUp from './pages/signUp';
import SigIn from './pages/singIn';
import Restaurantes from './pages/restaurants';

function RotasProtegidas(props) {
  const { token } = useAuth();

  return (
    <Route
      render={() => (token ? props.children : <Redirect to="/" />)}
    />
  );
}

export default function Routes() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={SigIn} />
          <Route path="/login" component={SigIn} />
          <Route path="/cadastro" component={SingUp} />
          <RotasProtegidas>
            <Route path="/restaurantes" component={Restaurantes} />
            .
          </RotasProtegidas>
        </Switch>
      </Router>
    </AuthProvider>
  );
}
