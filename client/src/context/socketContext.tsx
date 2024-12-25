import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

type props = {
  children: React.ReactNode;
};

export const SocketProvider: React.FC<props> = ({ children }) => {
  const Socket = useMemo(() => io("http://localhost:3000"), []);
  return (
    <SocketContext.Provider value={Socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
