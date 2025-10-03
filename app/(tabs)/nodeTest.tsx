import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://domis.blue:644"; // Replace with your actual server URL

export default function SocketConnectionPage() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socket = io(SOCKET_SERVER_URL, {
      autoConnect: false,
    });

    // Connect socket
    socket.connect();

    // Listen for connect event
    socket.on("connect", () => {
      setIsConnected(true);
    });

    // Listen for disconnect event
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.status, isConnected ? styles.connected : styles.disconnected]}>
        {isConnected
          ? "Connected to server"
          : "Not connected, please check server status or internet connection."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  status: {
    fontSize: 18,
    textAlign: "center",
  },
  connected: {
    color: "green",
  },
  disconnected: {
    color: "red",
  },
});
