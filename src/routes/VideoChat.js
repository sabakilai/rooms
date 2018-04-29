import React, { Component } from 'react';

// config
import { Config } from '../config';

// services
import { AuthService } from '../services/auth';

// components
import VideoChatFormM5 from '../components/VideoChatFormM5';

class VideoChat extends Component {
    constructor(props) {
        super(props);
        AuthService.isCheckAuthRedirectToLogin();
    }

    render() {
        return (
            <VideoChatFormM5/>
        )
    }
}


export default VideoChat;