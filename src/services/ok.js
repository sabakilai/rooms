import axios from 'axios';

// config
import { Config } from '../config';

// services
import { md5 } from './md5';

export const OkService = {
    getCurrentUser(access_token, session_secret_key) {
        if (!access_token || !session_secret_key) {
            return console.log('access_token or sig is null');
        }
        console.log('session_secret_key: ', session_secret_key);
        let sig = this.sigGen(access_token + session_secret_key, Config.ok.methods.users.getCurrentUser);
        let url = Config.ok.apiUrl + '?application_key=' + Config.ok.params.appKey
                        + '&format=json&method=' + Config.ok.methods.users.getCurrentUser
                        + '&sig=' + sig + '&session_key=' + access_token;
        return axios.get(url);
    },
    sigGen(session_secret_key, method) {
        return md5('application_key=' + Config.ok.params.appKey + 'format=jsonmethod=' + method + 'session_key=' + session_secret_key);
    }
}