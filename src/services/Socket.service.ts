import { type Socket } from 'socket.io';

import { SOCKET_EVENTS } from '@/constants/socket';

export class SocketService {
  static connection(socket: Socket) {
    console.log('Socket connected');

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('a user disconnect');
    });

    /*
      @TODO: Implement your socket.io logic here
    */
    socket.on('chat msg', (msg: string) => {
      console.log('🚀 ~ SocketService ~ socket.on ~ msg:', msg);
    });
  }
}
