import axios from 'axios';
import { Config } from '../config';

// services
import { VKService } from '../services/vk';
import { LocalStorageService } from '../services/localStorage';

const firebase = window.firebase;

export const AuthService = {
    isCheckAuthRedirectToLogin() { // проверка что пользователь авторизован
        console.log('-----------проверка что пользователь авторизован-------------------');
        console.log(firebase.auth().currentUser);
        setTimeout(() => {
            if(!firebase.auth().currentUser) {
                this.logout();
                window.location = '/login';
            }
        }, 1000);
    },
    isCheckAuthRedirectToProfile() { // проверка что пользователь авторизован
        console.log('-----------проверка что пользователь авторизован-------------------');
        console.log(firebase.auth().currentUser);
        
        setTimeout(() => {
            if(firebase.auth().currentUser) {
                window.location = '/';
            }
        }, 1000);
    },
    logout() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('Sign-out successful');
        }).catch(function(error) {
            // An error happened.
            console.log(error);
        });
        VKService.logout().then(
            (result) => {
                console.log('vk logout', result);
            }
        );

        LocalStorageService.clearStorage();
        window.location = '/login';
    },

    getCustomToken(uid) {
        return axios.post(Config.authServer.getCustomToken.url, {uid: uid});
    }
}