"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const url = require("url");
const request = require('request');
const express = require('express');
const cors = require('cors');
const path = require('path');
const serviceAccount = require('../service_account.json');
admin.initializeApp(Object.assign(functions.config().firebase, { credential: admin.credential.cert(serviceAccount) }));
exports.CheckRoomRequest = functions.database.ref('/requests/{userId}')
    .onWrite(event => {
    if (!event.data.exists())
        return '';
    return admin.database().ref(`/passwords/${event.data.val().room}`).once('value')
        .then(password => {
        if (password.exists() && password.val() !== event.data.val().password) {
            return event.data.ref.remove();
        }
        return admin.database().ref(`/members/${event.data.val().room}/${event.params.userId}`).set(true);
    });
});
/*
export const parseVideoUrl = functions.database.ref('/player/{roomId}')
.onWrite(event => {
  if(!event.data.exists()) return false;
  if(event.data.val().status > 0) return false;
  return admin.database().ref(`/rooms/${event.params.roomId}`).once('value', (room) => {
    if(!room.exists()) return false;
    return parseUrl(event.data, room.val().url );
  });
});
*/
exports.parseVideoUrlNew = functions.database.ref('/online/{roomId}/{userId}')
    .onWrite(event => {
    if (!event.data.exists())
        return false;
    if (event.data.val().status > 0)
        return false;
    return admin.database().ref(`/rooms/${event.params.roomId}`).once('value', (room) => {
        if (!room.exists())
            return false;
        return parseUrl(event, room);
    });
});
function parseUrl(event, room) {
    const proxy = 'http://31.192.250.17:3001/';
    const hostname = url.parse(room.val().url).hostname;
    const pathname = url.parse(room.val().url).pathname.split('/')[1];
    let options;
    if (hostname === "www.ts.kg") {
        options = {
            method: 'POST',
            url: proxy + 'tskg',
            headers: { 'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded' },
            form: { url: room.val().url }
        };
        return request(options, (error, response, body) => {
            if (error)
                console.log('tskg request E: ' + error);
            const data = JSON.parse(body);
            if (data.success) {
                return admin.database().ref(`/player/${room.key}/video_url/${event.params.userId}`).set(data.data);
            }
            return false;
        });
    }
    else if (hostname === "namba.kg") {
        const episode_id = room.val().url.split('id=')[1];
        return admin.database().ref(`/online/${room.key}/${event.params.userId}`).once('value', user => {
            options = {
                method: 'POST',
                url: proxy + `/namba/${pathname}/`,
                headers: { 'cache-control': 'no-cache',
                    'content-type': 'application/x-www-form-urlencoded' },
                form: {
                    episode: episode_id,
                    client_ip: user.val().ip,
                    referer: 'https://roomskg-c9b1c.firebaseapp.com/' + room.key,
                    user_agent: user.val().user_agent
                }
            };
            return request(options, (error, response, body) => {
                if (error)
                    console.log('ockg request E: ' + error);
                const data = JSON.parse(body);
                if (data.success) {
                    return admin.database().ref(`/player/${room.key}/video_url/${event.params.userId}`).set(data.data);
                }
                return false;
            });
        });
    }
    else if (hostname === "oc.kg") {
        options = {
            method: 'POST',
            url: proxy + 'ockg',
            headers: { 'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded' },
            form: { url: room.val().url }
        };
        return request(options, (error, response, body) => {
            if (error)
                console.log('ockg request E: ' + error);
            const data = JSON.parse(body);
            if (data.success) {
                return admin.database().ref(`/player/${room.key}/video_url/${event.params.userId}`).set(data.data);
            }
            return false;
        });
    }
    return true;
}
const app = express();
app.use(cors());
app.post('/getCustomToken', (req, res) => {
    admin.auth().createCustomToken(req.body.uid)
        .then((customToken) => {
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'ok',
            data: customToken
        });
    }).catch((err) => {
        console.log('Error creating custom token: ', err);
        return res.status(200).json({
            success: false,
            code: 500,
            message: 'Что то пошло не так'
        });
    });
});
app.get('/getip', (req, res) => {
    const ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    const user_agent = req.headers['user-agent'].substring(0, 120);
    if (ip)
        res.send({ success: true, code: 200, data: { ip, user_agent } });
    else
        res.send({ success: false, code: 400 });
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map