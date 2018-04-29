import React from 'react';
import MessagesList from './MessagesList';
import { Button } from 'react-bootstrap';
import Formsy from 'formsy-react';

import FormComponent from './FormComponent';
import TextInput from './Input/TextInput';

const firebase = window.firebase;

class Chat extends FormComponent {
  handleForm(model) {
    if(!firebase.auth().currentUser) return;
    let data = Object.assign(model, {user_id: firebase.auth().currentUser.uid});
    if(data.length < 1) return;
    let message = firebase.database().ref(`/messages/${this.props.roomId}`).push();
    message.set(data);
    this.refs.chatForm.reset();
    this.scrollBottom();
  }

  scrollBottom() {
    
  }
  
  render() {
    return (
      <div>
        <div style={{height: 500, overflow: 'auto', maxWidth: '100%',overflowX: 'hidden'}}>
          <MessagesList roomId={this.props.roomId} onItemAdded={this.scrollBottom}/>
        </div>
        <div>
          <Formsy ref="chatForm" onSubmit={this.handleForm} onValid={this.enableButton} onInvalid={this.disableButton}>
            <TextInput name="text" placeholder="Enter message..." required />
            {' '}
            <Button type="submit" disabled={!this.state.canSubmit}>Send</Button>
          </Formsy>
        </div>
      </div>
    )
  }
}

export default Chat;