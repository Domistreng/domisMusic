import { RefreshControl,SafeAreaView,ScrollView, TouchableOpacity} from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { useFocusEffect } from '@react-navigation/native';

import {Picker} from '@react-native-picker/picker';

import React, { Component, useEffect, useState } from 'react';

import Checkbox from 'expo-checkbox';

import generateScale from '../scripts/noteGenerator.js';

import {domisStyle} from '../domisStyles.js'

export default function scaleSelectScreen() {
    global = require('../global.js');
    const [selectedKey, setSelectedKey] = useState('E');
    const [majorScale, setMajorScale] = useState(true);
    const [naturalMinorScale, setNaturalMinorScale] = useState(false);
    const [harmonicMinorScale, setHarmonicMinorScale] = useState(false);
    const [melodicMinorScale, setMelodicMinorScale] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 10);
      }, []);
    useFocusEffect(() =>
        {
            onRefresh();
        })

    var keysList = [
      'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'
    ]

    return (
        <View style={domisStyle.container}>
                <Text style={domisStyle.title}>Select a Scale:</Text>
                <View style={domisStyle.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <View style={domisStyle.horizontalContainer}>
                  <TouchableOpacity
                    style={domisStyle.buttonStyle}
                    onPress={() => {

                      let scaleTypes = [];
                      if (majorScale) {
                        scaleTypes.push('Major')
                      }

                      if (naturalMinorScale) {
                        scaleTypes.push('Natural Minor')
                      }

                      if (harmonicMinorScale) {
                        scaleTypes.push('Harmonic Minor')
                      }

                      if (melodicMinorScale) {
                        scaleTypes.push('Melodic Minor')
                      }

                      global.screen1 = generateScale( {key:selectedKey, types:scaleTypes, octaveNum:1} );
                      console.log(global.screen1);

                    }}>
                    <Text style={domisStyle.buttonTextStyle}>Generate Scale</Text>

                  </TouchableOpacity>
                  <Picker
                      selectedValue={selectedKey}
                      style={domisStyle.pickerStyle}
                      onValueChange={(itemValue, itemIndex) => {
                          setSelectedKey(itemValue);
                          //console.log(global.screen1)
                      }
                      }>
                          {keysList.map((key, index) => (
                              <Picker.Item label={key} value={key}/>
                          ))}
                  </Picker>
                  <View style={domisStyle.checkBoxLargeContainer}>
                    <View style={domisStyle.checkBoxContainer}>
                      <Checkbox style={domisStyle.checkBoxStyle} value={majorScale} onValueChange={setMajorScale} />
                      <Text>Major Scale</Text>
                    </View>

                    <View style={domisStyle.checkBoxContainer}>
                      <Checkbox style={domisStyle.checkBoxStyle} value={naturalMinorScale} onValueChange={setNaturalMinorScale} />
                      <Text>Natural Minor Scale</Text>
                    </View>

                    <View style={domisStyle.checkBoxContainer}>
                      <Checkbox style={domisStyle.checkBoxStyle} value={melodicMinorScale} onValueChange={setMelodicMinorScale} />
                      <Text>Melodic Minor Scale</Text>
                    </View>

                    <View style={domisStyle.checkBoxContainer}>
                      <Checkbox style={domisStyle.checkBoxStyle} value={harmonicMinorScale} onValueChange={setHarmonicMinorScale} />
                      <Text>Harmonic Minor Scale</Text>
                    </View>
                  </View>
                  

                </View>
        </View>
    );
}

