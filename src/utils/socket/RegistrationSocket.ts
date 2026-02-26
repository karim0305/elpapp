import { io } from 'socket.io-client';

const SOCKET_URL = 'https://elpb.vercel.app';

export const registrationSocket  = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
});
