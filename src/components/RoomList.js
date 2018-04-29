import React from 'react';
import RoomListItem from './RoomListItem';
import FirebaseListComponent from './FirebaseListComponent';


class RoomList extends FirebaseListComponent {
  getRef() {
    return `/rooms`;
  }

  getItemComponent(item) {
    if (!item.val().is_deleted) return <RoomListItem item={item} key={item.key} />
  }
}

export default RoomList;