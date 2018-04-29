import React, { Component } from 'react';

// config
import { Config } from '../config';

// services
import { AuthService } from '../services/auth';

// components
import { ProfileEditForm } from '../components';

const firebase = window.firebase;

class Profile extends Component {
    constructor(props) {
        super(props);
        AuthService.isCheckAuthRedirectToLogin();
    }

    render() {
        return (
            <ProfileEditForm/>
        )
    }
}


export default Profile;