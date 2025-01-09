import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

import { analyzeAudio } from 'react-native-audio-analyzer';
import type { AmplitudeData } from 'react-native-audio-analyzer';

export default function App() {
  const [recording, setRecording] = React.useState();
  const [voiceInterval, setVoiceInterval] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [currentPitch, setCurrentPitch] = React.useState(-1);

  const [result, setResult] = React.useState<AmplitudeData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);

        setVoiceInterval(setInterval(async function () {
            console.log('test BEFORE');
            let frames = await recording.getURI();
            // console.log('test MIDDLE');
            // console.log(frames);
            // thisAudio = Sound.createAsync(frames);
            // console.log(Object.getOwnPropertyNames(thisAudio));
            const data = analyzeAudio(frames, 2);
            console.log(data);
            
            // Process the fileContent (base64 encoded)
            console.log('test END');
        }, 100)); // Update waveform every 100ms
      }
    } catch (err) {
        console.log(err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    clearInterval(voiceInterval);

    await recording.stopAndUnloadAsync();
    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    allRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(allRecordings);
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>
          <Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
        </View>
      );
    });
  }

  function clearRecordings() {
    setRecordings([])
  }

  return (
    <View style={styles.container}>
      <Button title={recording ? 'Stop Recording' : 'Start Recording\n\n\n'} onPress={recording ? stopRecording : startRecording} />
      <Text>{String(currentPitch)}</Text>
      {getRecordingLines()}
      <Button title={recordings.length > 0 ? '\n\n\nClear Recordings' : ''} onPress={clearRecordings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 40
  },
  fill: {
    flex: 1,
    margin: 15
  }
});