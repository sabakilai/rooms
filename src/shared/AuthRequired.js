// core
import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import SocialLoginForm from '../components/SocialLoginForm';
import RegistrationForm from '../components/RegistrationForm';
import { Modal, Tabs, Tab } from 'react-bootstrap';

// services
import { LocalStorageService } from '../services/localStorage';

const firebase = window.firebase;

class AuthRequired extends Component {
  constructor(props) {
    super(props);
    this._render = this.render;
    this.state = { user: firebase.auth().currentUser, isRegister: false }
  }

  fakeRender() {
    return '';
  }

  updateRenderMethod() {
    this.render = !this.state.user ? this.fakeRender.bind(this) : this._render;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user: user});
      this.updateRenderMethod();
      if(user && this.onLogin) this.onLogin(); 
      window.DialogManager.showDialog(this.getLoginDialog());
    });
    this.updateRenderMethod();
    if(this.state.user && this.onLogin) this.onLogin(); 
  }

  componentWillUpdate() {
    window.DialogManager.showDialog(this.getLoginDialog());
    this.updateRenderMethod();
  }

  getLoginDialog() {
    let redirectUrl = window.location.pathname;
    if (window.location.hash) {
      redirectUrl += window.location.hash;
    }
    LocalStorageService.setRedirectUrl(redirectUrl);

    return (
      <Modal show={this.state.user == null}>
        <Modal.Header>
          <Modal.Title>Аuthorization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Login">
            <LoginForm /> <SocialLoginForm />
            </Tab>
            <Tab eventKey={2} title="Register">
              <RegistrationForm />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    )
  }
}

export default AuthRequired;