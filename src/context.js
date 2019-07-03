import React, { PureComponent } from 'react';
import Client from './Contentful';

const RoomContext = React.createContext();

class RoomProvider extends PureComponent {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,
    type: 'all',
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false
  };

  getData = async () => {
    try {
      const response = await Client.getEntries({
        content_type: 'beachResortRoom',
        order: 'fields.price'
      });
      const { items } = response;
      const rooms = this.formatData(items);
      const featuredRooms = rooms.filter(room => room.featured === true);

      const maxPrice = Math.max(...rooms.map(item => item.price));
      const maxSize = Math.max(...rooms.map(item => item.size));

      this.setState(prevState => ({
        rooms: [...prevState.rooms, ...rooms],
        sortedRooms: [...prevState.sortedRooms, ...rooms],
        featuredRooms: [...prevState.featuredRooms, ...featuredRooms],
        loading: !prevState.loading,
        maxPrice,
        maxSize
      }));
    } catch (error) {
      console.warn(error);
    }
  };

  componentDidMount() {
    this.getData();
  }

  getRoom = slug => {
    const tempRooms = [...this.state.rooms];
    const room = tempRooms.find(room => room.slug === slug);
    return room;
  };

  formatData = items => {
    return items.map(item => {
      const id = item.sys.id;
      const images = item.fields.images.map(image => image.fields.file.url);
      const room = { ...item.fields, images, id };

      return room;
    });
  };

  handleChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState(
      {
        [name]: value
      },
      this.filterRooms
    );
  };

  filterRooms = () => {
    let {
      rooms,
      type,
      capacity,
      price,
      minSize,
      maxSize,
      breakfast,
      pets
    } = this.state;

    let tempRooms = [...rooms];
    capacity = parseInt(capacity);
    price = parseInt(price);

    if (type !== 'all') {
      tempRooms = tempRooms.filter(room => room.type === type);
    }

    if (capacity !== 1) {
      tempRooms = tempRooms.filter(room => room.capacity >= capacity);
    }

    tempRooms = tempRooms.filter(room => room.price <= price);
    tempRooms = tempRooms.filter(
      room => room.size >= minSize && room.size <= maxSize
    );

    if (breakfast) {
      tempRooms = tempRooms.filter(room => room.breakfast === true);
    }

    if (pets) {
      tempRooms = tempRooms.filter(room => room.pets === true);
    }
    this.setState({
      sortedRooms: tempRooms
    });
  };

  render() {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component) {
  return function ConsumerWrapper(props) {
    return (
      <RoomConsumer>
        {value => <Component {...props} context={value} />}
      </RoomConsumer>
    );
  };
}

export { RoomProvider, RoomConsumer, RoomContext };
