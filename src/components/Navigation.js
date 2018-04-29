import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

// config
import { Config } from '../config';

// services
import { AuthService } from '../services/auth';
import { LocalStorageService } from '../services/localStorage';

const firebase = window.firebase;

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { user: firebase.auth().currentUser };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (firebase.auth().currentUser) {
        this.setState({ user: LocalStorageService.getUser() });
      }
    });
  }
  openChatWindow() {
    window.open(Config.chatUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=300,width=1000,height=500");
  }

  logout(event) {
    event.preventDefault();
    AuthService.logout();
  }

  render() {
    let userMenu = (
      <Nav pullRight>
        <NavItem eventKey={1} href="/login">Login</NavItem>
        <NavItem eventKey={1} href="/register">Register</NavItem>
      </Nav>
    )
    if(this.state.user) {
      userMenu = (
        <Nav pullRight>
          <NavItem eventKey={1} href="/profile">{this.state.user.displayName}</NavItem>
          <NavItem eventKey={1} href="/" onClick={this.logout.bind(this)}>Logout</NavItem>
        </Nav>
      )
    }
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Rooms.kg</Link>
          </Navbar.Brand>
        </Navbar.Header>
        {userMenu }
      </Navbar>
    )
  }
}

export default Navigation;