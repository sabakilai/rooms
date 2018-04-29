import React, { Component } from 'react';

// config
import { Config } from '../config';

// services
import { LocalStorageService } from '../services/localStorage';

const firebase = window.firebase;

class SocialLoginForm extends Component {
  constructor(props) {
    super(props);
    this.setUser = this.setUser.bind(this);
  }

  signInWithFacebook(e) {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider)
      .then((result) => {

        console.log('success: ', result);
        let token = result.credential.accessToken;
        this.setUser(result.user, result.credential.providerId);
      }).catch(function(error) {
        console.log(error);
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          firebase.auth().fetchProvidersForEmail(error.email)
          .then(providers => {
            if (providers.length < 1 || !providers.filter(x => x === 'google.com')) {
              console.log('providers not correct');
              return;
            }
            // providers returns this array -> ["google.com"]
            // You need to sign in the user to that google account
            // with the same email.
            // In a browser you can call:
            var providerG = new firebase.auth.GoogleAuthProvider();
            providerG.setCustomParameters({ login_hint: email });
            firebase.auth().signInWithPopup(providerG).then(
              (resG) => {
                console.log(resG);
                const user = resG.user;
                user.linkWithPopup(provider).then(function(result) {
                    console.log(result);
                    this.setUser(user, credential.providerId);
                }, function(error) {
                    console.log(error);
                }); 
                //resG.user.link(error.credential);
                // If you have your own mechanism to get that token, you get it
                // for that Google email user and sign in
            })
          }).catch((err) => {
            console.log(err);
          });
        }
      });
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      // The signed-in user info.
      this.setUser(result.user, result.credential.providerId);
    }).catch((error) => {
      console.log(error);
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        firebase.auth().fetchProvidersForEmail(error.email)
        .then(providers => {
          if (providers.length < 1 || !providers.filter(x => x === 'facebook.com')) {
            console.log('providers not correct');
            return;
          }
          // providers returns this array -> ["google.com"]
          // You need to sign in the user to that google account
          // with the same email.
          // In a browser you can call:
          var providerFb = new firebase.auth.FacebookAuthProvider();
          providerFb.setCustomParameters({ login_hint: email });
          firebase.auth().signInWithPopup(providerFb).then(
            (resFb) => {
              const user = resFb.user;
              user.linkWithPopup(provider).then(function(result) {
                  console.log(result);
                  this.setUser(user, credential.providerId);
              }, function(error) {
                  console.log(error);
              }); 
              //resG.user.link(error.credential);
              // If you have your own mechanism to get that token, you get it
              // for that Google email user and sign in
          })
        }).catch((err) => {
          console.log(err);
        });
      }
    });
  }

  setUser(user, providerId) {
    if (!user || !user.uid) {
      return;
    }
    let newuser = {};
    newuser.displayName = user.displayName || 'noname';
    newuser.email = user.email || '';
    newuser.id = user.uid || '';
    newuser.avatar = user.photoURL || '';
    // user.networkToken = token;
    newuser.provider = providerId || 'unknown';

    firebase.database().ref("/profiles/" + newuser.id).set(newuser);
    LocalStorageService.setUser(newuser);
    window.location = window.location.pathname + window.location.hash;
  }

  signInWithVK() {
    // this.signIn(new firebase.auth.OAuthProvider('vk.com')); //not working
    let url = Config.vk.auth_url + '?client_id=' + Config.vk.id + '&scope=' + Config.vk.scope + '&redirect_uri='
    + Config.vk.redirect_uri + '&response_type=token&v=5.71';
    window.location = url;
  }

  signInWithOK() {
    console.log('loginOk');
    let url = Config.ok.authUrl + '?show_permissions=on&client_id=' + Config.ok.params.appId + '&scope=' + Config.ok.scope
                  + '&response_type=token&redirect_uri=' + Config.ok.redirect_uri;
    window.location = url;
  }

  signIn(provider) {
    firebase.auth().signInWithPopup(provider)
    .catch(error => {
        alert(error.message);
    });
  }

  render() {
    return (
      <div>
        Войти через соц.сеть: &nbsp;
            <button className="btn" onClick={this.signInWithGoogle.bind(this)}>Google</button> &nbsp;
            <button className="btn btn-primary" onClick={this.signInWithFacebook.bind(this)}>Facebook</button> &nbsp;
            <button className="btn btn-info" onClick={this.signInWithVK.bind(this)}>Vkantakte</button> &nbsp;
            <button className="btn btn-warning" onClick={this.signInWithOK.bind(this)}>Odnoklassniki</button>&nbsp;
      </div>
    )
  }
}

export default SocialLoginForm;