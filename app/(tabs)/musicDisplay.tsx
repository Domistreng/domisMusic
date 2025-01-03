import { RefreshControl,SafeAreaView,ScrollView,Button } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';

import * as ScreenOrientation from "expo-screen-orientation";

import { Text, View } from '@/components/Themed';

import { useFocusEffect } from '@react-navigation/native';

import MusicDisplay from '../components/MusicDisplayComponent.js';

import {domisStyle} from '../domisStyles.js'

import React, { Component, useEffect, useState } from 'react';


export default function scaleSelectScreen() {
    global = require('../global.js');
    var temp = Array();
    for (var i in global.screen1) {
      temp.push(global.screen1[i])
    }

    const [musicNotes, setNotes] = React.useState(temp);
    
    
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        if (refreshing == false) {
          setRefreshing(true);
          global = require('../global.js');
          //console.log(global.screen1);
          setNotes(global.screen1);
          setTimeout(() => {
            setRefreshing(false);
            //console.log(musicNotes)
          }, 10);
        }
        
      }, []);

    useFocusEffect(() =>
        {
          //console.log('test')
          onRefresh();
        })
    //console.log(global.screen1)
    return (
        
        <View style={domisStyle.container}>
                <MusicDisplay totalNotes={musicNotes} topNotes={musicNotes} botNotes={musicNotes}/>
        </View>
    );
}

