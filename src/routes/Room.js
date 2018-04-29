import React, { Component } from 'react';
import { Row, Col, Modal, FormGroup, FormControl, Button } from 'react-bootstrap';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import MembersList from '../components/MembersList';
import RoomControls from '../components/RoomControls';
import AuthRequired from '../shared/AuthRequired';
import ShareButtons from '../components/ShareButtons';
import { resolve } from 'url';

// components
import VideoChatFormM5 from '../components/VideoChatFormM5';

const firebase = window.firebase;

class Room extends AuthRequired {
  constructor(props) {
    super(props);
    console.log('cons')
    this.joinRoom = this.joinRoom.bind(this);
    this.roomId = this.props.match.params.id;
    this.state = {askPassword: false, password: '', user: {}, membership: null, room: {}};
  }

  onLogin() {
    firebase.database().ref(`/rooms/${this.roomId}`).on('value', (room) => {
      this.setState({room: room.val()});
    });
    
    firebase.database().ref(`/rooms/${this.roomId}`).once('value')
    .then(room => {
      this.setState({room:room.val()});
      this.listenMembership();
    })
    .catch(error => {
      console.log(error);
    });
  }

  componentDidUpdate() {
    this.validateMembership();
    if(this.state.membership) this.joinedGroup();
  }

  componentWillUnmount() {
    if(this.state.online) this.state.online.remove();
  }
  
  validateMembership() {
    console.log('validateMembership')
    if(!firebase.auth().currentUser) return;
    if(this.state.membership) return;
    firebase.database().ref(`/members/${this.roomId}/${firebase.auth().currentUser.uid}`).once('value')
    .then(membership => {
      if(membership.exists()) return this.setState({ membership: membership.val() });
      if(this.state.room.is_private) {
        this.showAskPasswordDialog();
      } else {
        this.joinRoom();
      }
    });
  }
  
  listenMembership() {
    if(!firebase.auth().currentUser) return;
    firebase.database().ref(`/members/${this.roomId}/${firebase.auth().currentUser.uid}`).on('value', membership => {
      if(!membership.exists()) {
        if(this.state.room.is_private) {
          this.showAskPasswordDialog();
        }
      } else {
        this.setState({ membership: membership.val() });
      }
    })
  }
  
  joinRoom() {
    firebase.database().ref(`/requests/${firebase.auth().currentUser.uid}`).set({
      room: this.roomId,
      password: this.state.password
    });
  }

  joinedGroup() {
    if(this.state.online) return;
    let onlineStatus = firebase.database().ref(`/online/${this.roomId}/${firebase.auth().currentUser.uid}`);
    onlineStatus.onDisconnect().remove();
    this.getClientIp()
    .then(data =>{
      onlineStatus.set({online:true,ip:data.ip,user_agent:data.user_agent});
      this.setState({online: onlineStatus});
    })
  }
  
  hideAskPasswordDialog() {
    this.setState({askPassword: false});
  }

  getClientIp(){
    return new Promise((resolve,reject)=> {
      fetch('https://us-central1-roomskg-c9b1c.cloudfunctions.net/api/getip')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) resolve(responseJson.data)
      })
      .catch((error) => {
        reject(error);
      });
    })
  }
  
  showAskPasswordDialog() {
    this.setState({askPassword: true, password: ''});
  }
  
  updatePassword(event) {
    this.setState({password: event.target.value});
  }
  
  render() {
    
    <div><h1>hi</h1></div>
    if(!this.state.membership) return '';
    const {children} = this.props;
    return (
      <div>
        <div>
        
          Room {this.state.room ? this.state.room.name : ''}
          <RoomControls roomId={this.roomId} room={this.state.room} membership={this.state.membership} />
        </div>
        <Row>
          <Col md={5}>
            <VideoPlayer roomId={this.roomId} room={this.state.room} membership={this.state.membership} />
            <ShareButtons children={children} pageUrl={window.location.href} />
          </Col>
          <Col md={4} mdOffset={3}>
            <MembersList roomId={this.roomId} />
            <Chat roomId={this.roomId} />
            <VideoChatFormM5 roomId={this.roomId}/>
          </Col>
        </Row>
        <Modal show={this.state.askPassword} onHide={this.validateMembership}>
          <Modal.Header closeButton>
            <Modal.Title>Enter password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={e => {e.preventDefault(); this.joinRoom(); }}>
              <FormGroup>
                <FormControl type="password" name="password" value={this.state.password} placeholder="Password" onChange={this.updatePassword.bind(this)}/>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.joinRoom}>Enter</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Room;