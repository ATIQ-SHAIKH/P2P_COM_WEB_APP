// hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from 'socket.io-client';

const useSocket = () => {
  const socketCreated = useRef(false)
  useEffect(() =>{
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await io('http://localhost:9999')
      }
      try {
        socketInitializer()
        socketCreated.current = true
      } catch (error) {
        console.log(error)
      }
    }
  }, []);
};

export default useSocket