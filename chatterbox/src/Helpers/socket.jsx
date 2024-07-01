import { io } from "socket.io-client";

const socket = new io(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  secure: true,
});
export default socket;
