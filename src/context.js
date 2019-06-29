import React, { PureComponent } from 'react';
import items from './data';

const RoomContext = React.createContext();

class RoomProvider extends PureComponent {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true
  };

  componentDidMount() {
    const rooms = this.formatData(items);
    const featuredRooms = rooms.filter(room => room.featured === true);
    this.setState(prevState => ({
      rooms: [...prevState.rooms, ...rooms],
      sortedRooms: [...prevState.sortedRooms, rooms],
      featuredRooms: [...prevState.featuredRooms, ...featuredRooms],
      loading: !prevState.loading
    }));
  }

  formatData = items => {
    return items.map(item => {
      const id = item.sys.id;
      const images = item.fields.images.map(image => image.fields.file.url);
      const room = { ...item.fields, images, id };

      return room;
    });
  };

  render() {
    return (
      <RoomContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}

const RoomConsumer = RoomContext.Consumer;

export { RoomProvider, RoomConsumer, RoomContext };
