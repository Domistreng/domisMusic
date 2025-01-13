import {useCallback, useState}  from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

import {
    scale,
    sample,
    robustScale,
    trimmedScale,
    analyzeAudio,
  } from 'react-native-audio-analyzer';
import type { AmplitudeData } from 'react-native-audio-analyzer';

export default function App() {
  const [recording, setRecording] = useState();
  const [voiceInterval, setVoiceInterval] = useState();
  const [recordings, setRecordings] = useState([]);
  const [currentPitch, setCurrentPitch] = useState(-1);

  const [result, setResult] = useState<AmplitudeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
            // console.log('test BEFORE');
            // let frames = await recording.getURI();
            // // console.log('test MIDDLE');
            // console.log(frames);
            // // thisAudio = Sound.createAsync(frames);
            // // console.log(Object.getOwnPropertyNames(thisAudio));
            
            
            // // Process the fileContent (base64 encoded)
            // console.log('test END');
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

    console.log('test1');


    const start = useCallback(async () => {
        try {
          setIsLoading(true);
          const data = analyzeAudio(recording.getURI(), 2);
          setResult(data);
        } catch (error) {
          Alert.alert('Error', String(error));
        } finally {
          setIsLoading(false);
        }
      }, []);

    const amplitudes = result.map((_) => _.amplitude);

    const results = [
        {
        title: 'Trimmed scale:',
        data: trimmedScale(amplitudes).map((value, index) => (
            <View key={index} style={[styles.item, { height: value * 100 }]} />
        )),
        },
        {
        title: 'Robust scale:',
        data: robustScale(amplitudes).map((value, index) => (
            <View key={index} style={[styles.item, { height: value * 100 }]} />
        )),
        },
        {
        title: 'Scale + sample:',
        data: scale(sample(amplitudes, 35)).map((value, index) => (
            <View key={index} style={[styles.item, { height: value * 100 }]} />
        )),
        },
        {
        title: 'Scale:',
        data: scale(amplitudes).map((value, index) => (
            <View key={index} style={[styles.item, { height: value * 100 }]} />
        )),
        },
    ];

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
    return (
        <View style={styles.container}>
            <Button title="Start" onPress={start} />
            {isLoading ? (
            <ActivityIndicator style={styles.loader} size="large" />
        ) : (
            <View>
                {results.map((_, index) => (
                    <View style={styles.example} key={index}>
                        <Text style={styles.title}>{_.title}</Text>
                        <ScrollView horizontal style={styles.scroll}>
                            <View style={styles.row}>{_.data}</View>
                        </ScrollView>
                    </View>
                ))}
            </View>
        )}
        </View>
    );
    ;
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
  },
  loader: {
    padding: 30,
  },
  title: {
    marginBottom: 5,
  },
  example: {
    padding: 10,
  },
  scroll: {
    maxHeight: 200,
  },
  item: {
    width: 3,
    backgroundColor: 'blue',
    marginHorizontal: 2,
  }
});