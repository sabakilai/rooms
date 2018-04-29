import React, { Component } from 'react';
import axios from 'axios';

// config
import { Config } from '../config';

// services
import { LocalStorageService } from '../services/localStorage';
import { OkService } from '../services/ok';
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

class LoginOk extends Component {
    constructor(props) {
        super(props);
        this.getTokenAndSecretKey = this.getTokenAndSecretKey.bind(this);
        this.getUserOK = this.getUserOK.bind(this);
        this.getTokenAndSecretKey();
    }

    getTokenAndSecretKey() {
        // "http://localhost:3000/login/ok#access_token=TOKEN&session_secret_key=KEY"
        let hash = window.location.hash;
        let hashSplit = hash.split('=');
        // [0]=> #access_token;
        // [1]=> TOKEN&session_secret_key;
        // [2]=> SECRETKEY&permissions_granted; [3]=>PHOTO_CONTENT&expires_in; [4]=>1800"
        console.log(hashSplit);
        if (hashSplit[1] === 'access_denied') {
          return window.location = '/login';
        }
    
        if (hashSplit.length < 4) {
          return console.log('hash not correct!');
        }
    
        let tokenArr = hashSplit[1].split('&'); // [0]=>TOKEN; [1]=>session_secret_key
        if (tokenArr.length < 2) {
          return console.log('tokenArr not correct!');
        }
        let access_token = tokenArr[0];
    
        let secretKeyArr = hashSplit[2].split('&'); // [0]=>SECRETKEY; [1]=>permissions_granted
        if (secretKeyArr.length < 2) {
          return console.log('arr2 not correct!');
        }
        let session_secret_key = secretKeyArr[0];

        this.getUserOK(access_token, session_secret_key);
    }

    getUserOK(access_token, session_secret_key) {
        if (!access_token || !session_secret_key) {
            return;
        }
        let self = this;
        OkService.getCurrentUser(access_token, session_secret_key)
        .then(function (response) {
            console.log(response);
            let userOk = response.data;
            console.log(userOk);
            if (!userOk) {
                return;
            }
            let user = {};
            user.displayName = userOk.name || '';
            // user.oathTokenOk = access_token || '';
            user.oathIdOk = userOk.uid || '';
            user.provider = 'ok.ru';
            if (userOk.pic_1) user.avatar = userOk.pic_1;

            self.doCustomAuth(user);
        }).catch(function (error) {
            console.log(error);
            return '';
        });
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
                console.log(res);
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
                <h2>Login with OK</h2>
            </div>
        )
    }
}

export default LoginOk;