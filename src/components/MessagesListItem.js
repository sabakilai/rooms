import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import './MessageListItem.css';

const firebase = window.firebase;

class MessagesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { message: props.item.val(), messageId: props.item.key, author: {} };
    firebase.database().ref(`/profiles/${this.state.message.user_id}`).once('value')
    .then(author => {
      if(!author.exists()) return;
      this.setState(Object.assign(this.state, {author: author.val()}));
    });
  }
  
  render() {
    let style //= {float:'left'};

    let currentUserId = firebase.auth().currentUser.uid;
    if (currentUserId == this.state.message.user_id) {
      //style = {float:'right'}
    }
    return (
      <Col md={12} className='msgContainer'>
        <div style={style}>
          <img src={this.state.author.avatar} alt="" style={{width:'20px',height:'20px'}} />
          {this.state.author.displayName}
          
          <p style={{wordWrap: 'break-word'}}>{this.state.message.text}</p>  
          
        </div>
      </Col>
    )
  }
}

export default MessagesListItem;