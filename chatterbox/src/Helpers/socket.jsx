import { io } from "socket.io-client";

const socket = (user) =>
  io(process.env.REACT_APP_SERVER_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket"],
    secure: true,
    auth: {
      token: user?.token, // Ensure user is not undefined
    },
  });

export default socket;
