import React, { Component } from "react";
import SearchBar from "./SearchBar.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const NotFoundPage = () => (
  <div className="container text-center">
    <h2>Page not found</h2>
    <div>please send help</div>
  </div>
);

export default class App extends Component {
  render() {
    console.log("Props:", this.props);
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={SearchBar} />
          <Route exact path="/wiki/:phrase" component={SearchBar} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}
