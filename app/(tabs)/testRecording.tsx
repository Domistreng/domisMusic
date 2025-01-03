
import { Text, View } from '@/components/Themed';

import {domisStyle} from '../domisStyles.js'

import { useState, useEffect } from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets } from 'expo-audio';

export default function TabOneScreen() {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    const record = () => {console.log('test'); audioRecorder.record(); console.log(audioRecorder.isRecording)}
  
    const stopRecording = async () => {
    
      // The recording will be available on `audioRecorder.uri`.
        await audioRecorder.stop();
        console.log("recordingStopped");
    };
  
    useEffect(() => {
      (async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission to access microphone was denied');
        }
      })();
    }, []);
  
    return (
      <View style={styles.container}>
        <Button
          title={audioRecorder.isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={audioRecorder.isRecording ? stopRecording : record}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 10,
    },
  });
