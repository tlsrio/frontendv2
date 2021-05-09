import React from "react";
import { Route, Switch } from "react-router-dom";
import Categories from "./containers/Categories/Categories";
import Category from "./containers/Categories/Category";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Profile from "./containers/Profile";
import Search from "./containers/Search";
import SignIn from "./containers/SignIn";
import Summarize from "./containers/Summarize";


export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/signin">
        <SignIn />
      </Route>]
      <Route exact path="/categories">
        <Categories />
      </Route>
      <Route exact path="/summarize">
        <Summarize />
      </Route>
      <Route exact path="/category/:id">
        <Category />
      </Route>
      <Route exact path="/profile/:id">
        <Profile />
      </Route>
      <Route exact path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
