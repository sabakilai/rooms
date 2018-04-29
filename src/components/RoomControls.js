import React from 'react';
import { ButtonToolbar, Button, FormGroup, ControlLabel, FormControl, Modal} from 'react-bootstrap';
import DateTime from 'react-datetime';
import FormComponent from './FormComponent';

const firebase = window.firebase;

class RoomControls extends FormComponent {
  constructor(props){
    super(props)
    this.state={
      showModal: false,
      hideDateTime: true
    }
  }
  deleteRoom(){
    firebase.database().ref(`/rooms/${this.props.roomId}`).remove()
    .catch(e => {
      alert(e);
    })
  }
  toggleModal(){
    this.setState({
      showModal: !this.state.showModal,
      hideDateTime: this.props.room && Date.parse(this.props.room.start_time) > new Date()
    });
  }
  handleForm(event){
    event.preventDefault();
    let room = this.getFormValues(event.target);
    firebase.database().ref(`/rooms/${this.props.roomId}`).update(room);
    this.setState({showModal: false})
  }   
  render() {
    if(!this.props.room || !firebase.auth().currentUser) return '';
    if(this.props.room.creator != firebase.auth().currentUser.uid) return '';
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle="info" onClick={this.toggleModal.bind(this)}>Change room</Button>
          <Button bsStyle="danger" onClick={this.deleteRoom.bind(this)}>Delete room</Button>
        </ButtonToolbar>
        <Modal show={this.state.showModal} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Room</Modal.Title>
          </Modal.Header>
          <form onSubmit={this.handleForm}>
            <Modal.Body>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>{' '}
                <FormControl type="text" name="name" placeholder="Name" />
              </FormGroup>
              <FormGroup hidden={this.state.hideDateTime}>
                <ControlLabel>Start time</ControlLabel>
                <DateTime inputProps={ { name: "start_time" } } />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Save</Button>
              <Button onClick={this.toggleModal.bind(this)}>Close</Button>
            </Modal.Footer>
          </form>
        </Modal> 
      <br/>
      </div>
    )
  }
  
}

export default RoomControls;