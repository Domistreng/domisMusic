import React, { useState, useEffect, useContext } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { io } from "socket.io-client";
import { UserContext } from '../userContext';

// Replace this with your server address
const SOCKET_SERVER_URL = "https://domis.blue:644";

export default function AudioRecordTab({ userId }) {
  const [recording, setRecording] = useState(null);
  const [socket, setSocket] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Press record to start");
  const [isRecording, setIsRecording] = useState(false);
  const [thisId, setThisId] = useState(null);

  const { uniqueId } = useContext(UserContext);


  useEffect(() => {
    const generatedId = String(uniqueId)
    setThisId(generatedId);

    const socketInstance = io(SOCKET_SERVER_URL, {
      query: { id: generatedId },
    });
    setSocket(socketInstance);

    // Listen for the server event "Recordings Analyzed"
    socketInstance.on("Recordings Analyzed", () => {
      Alert.alert("Success", "Recording Successfully Analyzed");
    });

    return () => {
      if (socketInstance) {
        socketInstance.off("Recordings Analyzed"); // cleanup listener
        socketInstance.disconnect();
      }
    };
  }, []);

  async function startRecording() {
    try {
      setStatusMessage("Requesting microphone permission...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        setStatusMessage("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setStatusMessage("Starting recording...");
      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".caf",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      setRecording(recording);
      setIsRecording(true);
      setStatusMessage("Recording in progress...");
    } catch (error) {
      console.error("Failed to start recording", error);
      setStatusMessage("Failed to start recording");
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    setStatusMessage("Stopping recording...");
    setIsRecording(false);
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();

      // Get URI of recorded file
      const uri = recording.getURI();
      setStatusMessage("Recording stopped. Ready to submit.");
      setRecording(recording);

      // Store URI for submission later
      setRecording({ ...recording, uri });
    } catch (error) {
      console.error("Failed to stop recording", error);
      setStatusMessage("Failed to stop recording");
    }
  }

  async function submitRecording() {
    if (!recording || !recording.uri) {
      setStatusMessage("No recording available to submit");
      return;
    }

    try {
      setStatusMessage("Reading file and sending to server...");
      // Read file as base64 string
      const base64data = await FileSystem.readAsStringAsync(recording.uri, {
        encoding: 'base64',
      });

      // Emit to socket server omitting base64 prefix, similar to substring(22) in web example
      socket.emit("App Recording Submit", {
        stringVal: base64data,
        senderId: thisId
      });

      setStatusMessage("Audio submitted to server.");
    } catch (error) {
      console.error("Failed to submit recording", error);
      setStatusMessage("Failed to submit recording");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{statusMessage}</Text>

      <Button
        title={isRecording ? "Stop Recording" : "Record Audio"}
        onPress={isRecording ? stopRecording : startRecording}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Submit Audio" onPress={submitRecording} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  status: {
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
