import React from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Checkbox } from 'react-bootstrap';
import Formsy, {addValidationRule} from 'formsy-react';

import FormComponent from './FormComponent';
import TextInput from './Input/TextInput';
import DatetimeInput from'./Input/DatetimeInput';

const firebase = window.firebase;

const ALLOWED_DOMAINS = ['oc.kg', 'namba.kg', 'www.ts.kg'];

addValidationRule('allowedUrl', (values, value) => {
    try {
        let url = new URL(value);
        return ALLOWED_DOMAINS.includes(url.hostname);
    } catch (e) {
        return false;
    }
});

class CreateRoomForm extends FormComponent {
  constructor(props) {
    super(props);
    this.state = { showPass: 'none', is_private: false, password:null };

    this.togglePassword = this.togglePassword.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  handleForm(room) {
    if(!firebase.auth().currentUser) {
      return;
    }

    let roomsRef = firebase.database().ref("/rooms");
    let newRoomRef = roomsRef.push();
    let password = this.state.password;
    console.log(room)
    room['is_private'] = this.state.is_private;
    room['creator'] = firebase.auth().currentUser.uid;
    delete room['password'];
    console.log()
    newRoomRef.set(room).then(() => {
      firebase.database().ref(`/members/${newRoomRef.key}/${firebase.auth().currentUser.uid}`).set(true);
      if (password && room['is_private'] ) {
        firebase.database().ref(`/passwords/${newRoomRef.key}`).set(password);
      }
    });
    if(this.props.onCreate) this.props.onCreate(newRoomRef.val());
  }

  togglePassword(event) {
    this.setState({ showPass: event.target.checked ? 'inline' : 'none', is_private: event.target.checked });
  }
  handlePassChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <Formsy onValidSubmit={this.handleForm}
              onValid={this.enableButton}
              onInvalid={this.disableButton}>
        <TextInput type="text" name="name"
                   label="Room Name" required />

        <FormGroup>
          <ControlLabel>Private</ControlLabel>
          <Checkbox name="is_private" onClick={this.togglePassword} />
          <FormControl type="password" name="password" placeholder="Password" onChange={this.handlePassChange}
                       style={{display: this.state.showPass }}/>
        </FormGroup>

        <TextInput type="text" name="url"
                   label="(TS.KG, OC.KG, NAMBA.KG) video url"
                   validations={{ isUrl: true, allowedUrl: true }}
                   validationError={{
                     isUrl: "This is not a valid url. ",
                     allowedUrl: "Not allowed(ts, oc, namba) url. "
                   }} required />

        <DatetimeInput name="startTime" required/>

        <Button type="submit" disabled={!this.state.canSubmit}>
            Create
        </Button>
      </Formsy>
    )
  }
}

export default CreateRoomForm;