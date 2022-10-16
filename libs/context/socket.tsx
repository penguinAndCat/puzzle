import React from 'react';
import * as io from 'socket.io-client';
export const socket = io.connect('http://localhost:3000/', {
  path: '/api/socketio',
});
export const SocketContext = React.createContext(socket);
