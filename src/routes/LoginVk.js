import React, { Component } from 'react';

// config
import { Config } from '../config';

// services
import { LocalStorageService } from '../services/localStorage';
import { VKService } from '../services/vk';
import { AuthService } from '../services/auth';

const firebase = window.firebase;
const provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('email');
firebase.auth().languageCode = 'fr_FR';
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();
provider.setCustomParameters({
    'display': 'popup'
});

class LoginVk extends Component {
    constructor(props) {
        super(props);
        this.loginVk = this.loginVk.bind(this);
        VKService.init();
        this.loginVk();
      }

    loginVk() {
        let hashArr = window.location.hash.split('&');
        let access_token = hashArr[0].split('=')[1];

        if (access_token === 'access_denied') {
            console.log('access_denied');
            return;
          }

        let email = (hashArr.length > 3) ? hashArr[3].split('=')[1] : '';

        /*if (!this.user.email) {
        this.user.email = email;
        this.user.sendEmail = this.user.email ? false : true;
        }*/
        let user = {};
        user.oathTokenVk = access_token;
        user.email = email;
        console.log(user);
        this.getUserInfo(user);
    }

    getUserInfo(user) {
        console.log('getUserInfo');
        if (!user) {
            console.log('user is null');
            return;
        }
        const self = this;
        VKService.api(Config.vk.method.userGet, { 'fields': Config.vk.fields, 'v': Config.vk.version }).then(
           (data) => {
                console.log(data);
                let user_vk = data.response[0];
                user.displayName = user_vk.first_name + ' ' + user_vk.last_name;
                if (user_vk.id) user.oathIdOk = user_vk.id;
                user.provider = 'vk.com';
                if (user_vk.has_photo) user.avatar = user_vk.photo;

                self.doCustomAuth(user);
           },
           (err) => {
                console.log(err);
           }
         );
    }

    doCustomAuth(user) {
        console.log('doCustomAuth');
        const profileRef = firebase.database().ref("/profiles");
        const key = profileRef.push().key;
        user.id = key;
        AuthService.getCustomToken(user.id)
        .then((result) => {
            if (!result.data.success) {
                return;
            }
            console.log(result);
            const customToken = result.data.data;
            firebase.auth().signInWithCustomToken(customToken)
            .then((res) => {
                console.log('doCustomAuth user:', user);
                profileRef.child(user.id).set(user);
                LocalStorageService.setUser(user);

                let redirectUrl = LocalStorageService.getRedirectUrl();
                LocalStorageService.setRedirectUrl('');
                window.location = redirectUrl || '/';
            })
            .catch(function(error) {
                console.log(error);
                //window.location = '/';
            });
        }).catch((err) => {
            console.log(err);
            //window.location = '/';
        });
    }

    render() {
        return (
            <div>
                <h2>Login with VK</h2>
            </div>
        )
    }
}

export default LoginVk;