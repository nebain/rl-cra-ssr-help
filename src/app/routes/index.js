import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";

function Loading(props) {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return <div>Loading (without any delay)...</div>;
  }
}

const About = Loadable({
  loader: () => import(/* webpackChunkName: "about" */ "./about"),
  loading: Loading,
  timeout: 10000
});

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ "./home"),
  loading: Loading,
  timeout: 10000
});

export default () => (
  <Switch>
    <Route exact path="/about" component={About} />
    <Route exact path="/" component={Home} />
  </Switch>
);
