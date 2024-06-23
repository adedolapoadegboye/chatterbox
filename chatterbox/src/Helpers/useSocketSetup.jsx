import { useEffect } from "react";
import socket from "./socket";

const useSocketSetup = () => {
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {});
  }, []);
};

export default useSocketSetup;