import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

const firebase = window.firebase;

class MembersListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { memberId: props.item.key, member: {} };
    console.log(props.item.key)
    firebase.database().ref(`/profiles/${this.state.memberId}`).once('value')
    .then(profile => {
      console.log(profile.val())
      if(!profile.exists()) return;
      this.setState(Object.assign(this.state, {member: profile.val()}));
    });
  }
  
  render() {
    if (!this.state.member) return null
    
    return (
      <Col md={12}>
        <div>
          {this.state.member.displayName}
        </div>
      </Col>
    )
  }
}

export default MembersListItem;