import React from 'react';
import FirebaseListComponent from './FirebaseListComponent';
import MessagesListItem from './MessagesListItem';

class MessagesList extends FirebaseListComponent {

  getRef() {
    return `/messages/${this.props.roomId}`;
  }

  getItemComponent(item) {
    return <MessagesListItem item={item} key={item.key} />
  }
}

export default MessagesList;