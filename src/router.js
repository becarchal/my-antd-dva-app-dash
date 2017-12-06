import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import(/* webpackChunkName: "IndexPage" */ './routes/IndexPage'),
  });

  const Users = dynamic({
    app,
    models: () => [
      import(/* webpackChunkName: "usersmodel" */'./models/users'),
    ],
    component: () => import(/* webpackChunkName: "Users" */'./routes/Users'),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/users" component={Users} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
