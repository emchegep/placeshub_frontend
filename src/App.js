import React, { Suspense} from 'react';
import { Route,Redirect,Switch} from 'react-router-dom'
import './App.css';
//import Users from "./user/pages/Users";
//import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/Navigation/MainNavigation";
//import UserPlaces from "./places/pages/UserPlaces";
//import UpdatePlace from "./places/pages/UpdatePlace";
//import Auth from "./user/pages/Auth";
import {AuthContext} from "./shared/context/auth-context";
import {useAuth} from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/UIElements/LoadingSpinner";

const Users = React.lazy(()=> import('./user/pages/Users'))
const NewPlace = React.lazy(()=> import('./places/pages/NewPlace'))
const UserPlaces = React.lazy(()=> import('./places/pages/UserPlaces'))
const UpdatePlace = React.lazy(()=> import('./places/pages/UpdatePlace'))
const Auth = React.lazy(()=> import('./user/pages/Auth'))

const App=()=> {
   const {login, logout, token, userId} = useAuth()
    let routes;
    if(token){
       routes = (
           <Switch>
               <Route path="/" exact component={Users}/>
               <Route path="/:userId/places" component={UserPlaces}/>
               <Route path="/places/new" exact>
                   <NewPlace/>
               </Route>
               <Route path="/places/:placeId">
                   <UpdatePlace/>
               </Route>
               <Redirect to="/"/>
           </Switch>
       )
    } else {
        routes = (
            <Switch>
                <Route path="/" exact component={Users}/>
                <Route path="/:userId/places" component={UserPlaces}/>
                <Route path="/auth" exact>
                    <Auth/>
                </Route>
                <Redirect to="/auth"/>
            </Switch>
        )
    }
  return (
      <AuthContext.Provider value={{isLoggedIn: !!token, token: token,userId:userId, login: login,logout:logout}}>
      <div>
          <MainNavigation/>
          <main>
              <Suspense fallback={<div className="center"><LoadingSpinner/></div> }>
                {routes}
              </Suspense>
          </main>
      </div>
      </AuthContext.Provider>
  );
}

export default App;
