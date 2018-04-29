import React from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import FormComponent from './FormComponent';
import Formsy from 'formsy-react';

import TextInput from './Input/TextInput';
import {LocalStorageService} from "../services/localStorage";

const firebase = window.firebase;

class RegistrationForm extends FormComponent {
  constructor(props) {
    super(props);
    this.state = {
      avatar: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange = e => {
      let file = e.target.files[0];
      this.setState({avatar: file});
  };

  handleForm(model) {
    let profile = {...this.state, ...model};
    console.log(profile);
    firebase.auth().createUserWithEmailAndPassword(profile.email, profile.password)
    .then(user => {
      user.updateProfile({
        displayName: profile.name
      });
      let publicProfile = firebase.database().ref(`/profiles/${user.uid}`);
      publicProfile.set({
        displayName: profile.name
      }).then(() => {
        LocalStorageService.setUser(user);
        if(profile.avatar) {
          firebase.storage().ref(`images/${user.uid}/profile.jpg`).put(profile.avatar)
            .then(snapshot => {
              user.updateProfile({
                avatar: snapshot.downloadURL
              });
              publicProfile.update({
                avatar: snapshot.downloadURL
              });
          });
        }
        window.location = '/';
      });
    })
    .catch(error => {
      alert(error.message);
    });
  }

  render() {
    return (
      <Formsy onSubmit={this.handleForm} onValid={this.enableButton} onInvalid={this.disableButton}>
        <TextInput type="text" name="name" label="Name" placeholder="Vasiliy"
                   validations={{maxLength: 50}}
                   validationErrors={{maxLength: "Your name is too long"}} required />
        <TextInput type="email" name="email" label="Email" placeholder="ya@vasya.net"
                   validations={{isEmail: true}}
                   validationErrors={{isEmail: 'You must type valid email'}} required />
        <TextInput type="password" name="password" label="Password"
                   validations={{minLength: 8}}
                   validationErrors={{minLength: 'Your password must be longer than 8 symbols'}} required />

        <FormGroup>
          <ControlLabel>Avatar</ControlLabel>

          <FormControl type="file" name="avatar" onChange={this.onInputChange} />
        </FormGroup>

        <Button type="submit" disabled={!this.state.canSubmit}>Register</Button>
      </Formsy>
    )
  }
}

export default RegistrationForm;