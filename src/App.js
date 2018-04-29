import React, { Component } from 'react';
import { Navigation } from './components';
// import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Main, Login, LoginVk, LoginOk, Registration, Room, Terms, Profile, VideoChat } from './routes';
import DialogManagerComponent from './shared/DialogManagerComponent';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <DialogManagerComponent />
          <Navigation />

          <div className="container">
            <Switch>
              <Route exact path="/" component={ Main } />
              <Route exact path="/login" component={ Login } />
              <Route exact path="/login/vk" component={ LoginVk } />
              <Route exact path="/login/ok" component={ LoginOk } />
              <Route exact path="/register" component={ Registration } />
              <Route exact path="/profile" component={ Profile } />
              <Route exact path="/terms" component={ Terms } />
              <Route exact path="/video-chat" component={ VideoChat } />

              <Route path="/room/:id" component={ Room } />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
