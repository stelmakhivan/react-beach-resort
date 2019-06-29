import React, { PureComponent } from 'react';
import { RoomContext } from '../context';

import Room from './Room';
import Loading from './Loading';

export default class FeaturedRooms extends PureComponent {
  static contextType = RoomContext;

  render() {
    const { featuredRooms: rooms } = this.context;
    console.log(rooms);
    return (
      <div>
        <Room />
        <Loading />
      </div>
    );
  }
}
