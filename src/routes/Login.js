import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import SocialLoginForm from '../components/SocialLoginForm';

// services
import { AuthService } from '../services/auth';

class Login extends Component {
  constructor(props) {
    super(props);
    AuthService.isCheckAuthRedirectToProfile();
}
  render() {
    return (
      <div>
        <div>
            <LoginForm />
        </div>
        <div>
            <SocialLoginForm />
        </div>
      </div>
    )
  }
}

export default Login;