import React from 'react';
import { Button } from 'react-bootstrap';
import  Formsy from 'formsy-react';

import FormComponent from './FormComponent';
import TextInput from './Input/TextInput';

// services
import { LocalStorageService } from "../services/localStorage";

const firebase = window.firebase;

class LoginForm extends FormComponent {
  handleForm(model) {
    let input = model;
    firebase.auth().signInWithEmailAndPassword(input.email, input.password)
    .then((res) => {
      LocalStorageService.setUser(res);
      window.location = '/';
    })
    .catch(error => {
      alert(error.message);
    });
  }

  render() {
    return (
      <Formsy onSubmit={this.handleForm} onValid={this.enableButton} onInvalid={this.disableButton} >
        <TextInput type="email" name="email"
                   placeholder="ya@vasya.net" label="Email"
                   validations={{isEmail: true}}
                   validationErrors={{isEmail: 'You must type valid email'}} required />
        <TextInput type="password" name="password" label="Password"
                   validations={{minLength: 8}}
                   validationErrors={{minLength: 'Your password must be longer than 8 symbols'}} required />

        <Button type="submit" disabled={!this.state.canSubmit}>Login</Button>
      </Formsy>
    )
  }
}

export default LoginForm;