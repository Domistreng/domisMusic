
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import * as ScreenOrientation from "expo-screen-orientation";

import {domisStyle} from '../domisStyles.js'

export default function TabOneScreen() {
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }
  changeScreenOrientation();
  return (
    <View style={domisStyle.container}>
      <Text style={domisStyle.title}>Welcome to DomisMusic</Text>
      <View style={domisStyle.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

