import axios from 'axios';
import { useAtom } from 'jotai';
import { Fragment, useEffect } from 'react';
import { HashRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { loadUserAtom, userAsyncStatusAtom, userIsLoggedAtom } from 'components/App/App.atoms';
import { getUser } from 'services/conduit';
import { EditArticle } from '../Pages/EditArticle/EditArticle';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Home } from '../Pages/Home/Home';
import { Login } from '../Pages/Login/Login';
import { NewArticle } from '../Pages/NewArticle/NewArticle';
import { Register } from '../Pages/Register/Register';
import { Settings } from '../Pages/Settings/Settings';
import { ProfilePage } from '../Pages/ProfilePage/ProfilePage';
import { ArticlePage } from '../Pages/ArticlePage/ArticlePage';

export function App() {
  const [userIsLogged] = useAtom(userIsLoggedAtom);
  const [loading] = useAtom(userAsyncStatusAtom);

  useLoadUser();

  return (
    <HashRouter>
      {!loading && (
        <Fragment>
          <Header />
          <Switch>
            <GuestOnlyRoute exact path='/login' userIsLogged={userIsLogged}>
              <Login />
            </GuestOnlyRoute>
            <GuestOnlyRoute exact path='/register' userIsLogged={userIsLogged}>
              <Register />
            </GuestOnlyRoute>
            <UserOnlyRoute exact path='/settings' userIsLogged={userIsLogged}>
              <Settings />
            </UserOnlyRoute>
            <UserOnlyRoute exact path='/editor' userIsLogged={userIsLogged}>
              <NewArticle />
            </UserOnlyRoute>
            <UserOnlyRoute exact path='/editor/:slug' userIsLogged={userIsLogged}>
              <EditArticle />
            </UserOnlyRoute>
            <Route path='/profile/:username'>
              <ProfilePage />
            </Route>
            <Route path='/article/:slug'>
              <ArticlePage />
            </Route>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
          <Footer />
        </Fragment>
      )}
    </HashRouter>
  );
}

const useLoadUser = () => {
  const [userAsyncStatus, setUserAsyncStatus] = useAtom(userAsyncStatusAtom);
  const [_, loadUser] = useAtom(loadUserAtom);

  useEffect(() => {
    const asyncHandle = async () => {
      const token = localStorage.getItem('token');
      if (!userAsyncStatus || !token) {
        setUserAsyncStatus(false);
        return;
      }

      axios.defaults.headers.Authorization = `Token ${token}`;

      try {
        const user = await getUser();
        loadUser(user);
      } catch {
        setUserAsyncStatus(false);
      }
    };

    asyncHandle();
  });
};

/* istanbul ignore next */
function GuestOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: { children: JSX.Element | JSX.Element[]; userIsLogged: boolean } & RouteProps) {
  return (
    <Route {...rest}>
      {children}
      {userIsLogged && <Redirect to='/' />}
    </Route>
  );
}

/* istanbul ignore next */
function UserOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: { children: JSX.Element | JSX.Element[]; userIsLogged: boolean } & RouteProps) {
  return (
    <Route {...rest}>
      {children}
      {!userIsLogged && <Redirect to='/' />}
    </Route>
  );
}
