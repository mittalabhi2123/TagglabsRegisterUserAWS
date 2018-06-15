import {Route, NavLink, HashRouter} from "react-router-dom";
import UserStats from '../UserStats';
import Homepage from '../Homepage';
import React from 'react';

export default class Main extends React.Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h2 style={{textAlign:"center", color:"#306BB7"}}>Welcome to User Authorization Portal</h2>
          <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/stats">User statistics</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={Homepage}/>
            <Route path="/stats" component={UserStats}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
