// core
import React, { Component } from 'react';
import RegistrationForm from '../components/RegistrationForm';

// services
import { FileService } from '../services/file';
import { LocalStorageService } from '../services/localStorage';
import { AuthService } from '../services/auth';

const firebase = window.firebase;

class Registration extends Component {
    constructor(props) {
        super(props);
        AuthService.isCheckAuthRedirectToProfile();
      }
    render() {
        return (
            <div>
                <RegistrationForm />
            </div>
        )
    }
}

export default Registration;