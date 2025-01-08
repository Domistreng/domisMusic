
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

import React, { useRef } from 'react';

// const LiveWaveform = ({ audioData }) => {
//   return (audioData)
// };

export default function App() {
    const [recording, setRecording] = React.useState(null);
    const [audioData, setAudioData] = React.useState([]);
  
    const startRecording = async () => {
        try {
            console.log('recording Start')
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
            });
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                setRecording(recording);

                const intervalId = setInterval(async () => {
                    const { frames } = await recording.getAudioRecordingStatusAsync();
                    setAudioData(frames);
                    console.log(frames);
                }, 100); // Update waveform every 100ms
            }
        } catch (err) {}
    };
  
    // ... rest of your component logic
  
    return (
      <View>
        <Button title="Start Recording" onPress={startRecording} /> 
      </View>
    );
};