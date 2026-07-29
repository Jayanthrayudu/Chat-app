import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  connect,
  disconnect,
  onStatusChange,
} from "../services/websocketService";
import { CONNECTION_STATUS } from "../utils/constants";

export function useWebSocket() {
  const { token } = useAuth();

  const [status, setStatus] = useState(
    CONNECTION_STATUS.DISCONNECTED
  );

  useEffect(() => {
    if (!token) {
      disconnect();
      return;
    }

    const unsubscribe = onStatusChange(setStatus);

    connect(token);

    return () => {
      unsubscribe();
    };
  }, [token]);

  return { status };
}