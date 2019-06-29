import React, { PureComponent } from 'react';
import { RoomContext } from '../context';

import Room from './Room';
import Title from './Title';
import Loading from './Loading';

export default class FeaturedRooms extends PureComponent {
  static contextType = RoomContext;

  render() {
    const { loading, featuredRooms } = this.context;
    const rooms = featuredRooms.map(room => {
      return <Room key={room.id} room={room} />;
    });

    return (
      <section className="featured-rooms">
        <Title title="featured rooms" />
        <div className="featured-rooms-center">
          {loading ? <Loading /> : rooms}
        </div>
      </section>
    );
  }
}
