import React from 'react';
import * as io from 'socket.io-client';
export const socket = io.connect({
  path: '/api/socketio',
});
export const SocketContext = React.createContext(socket);
