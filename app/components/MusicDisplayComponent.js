import { useEffect, useState, React } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LineMusic from './LineMusicComponent';


const totalMeasureLength = 2
const MusicDisplay = ( attributes ) => {

    var currentIndex = 0

    var initialTopNotes = []
    var initialLength = 0
    for (i in attributes.totalNotes.slice(currentIndex)) {
        var thisNote = attributes.totalNotes.slice(currentIndex)[i];
        initialTopNotes.push(thisNote)
        initialLength += thisNote['length']
        if (initialLength >= totalMeasureLength) {
            currentIndex +=  parseInt(i) + 1
            break;
        }
    }

    var initialBotNotes = []
    initialLength = 0
    for (i in attributes.totalNotes.slice(currentIndex)) {
        var thisNote = attributes.totalNotes.slice(currentIndex)[i];
        initialBotNotes.push(thisNote)
        initialLength += thisNote['length']
        if (initialLength >= totalMeasureLength) {
            currentIndex += parseInt(i) + 1
            break;
        }
    }

    // const [totalNotes, setTotalNotes] = useState(attributes.totalNotes)
    // const [topNotes, setTopNotes] = useState(initialTopNotes)
    // const [botNotes, setBotNotes] = useState(initialBotNotes)
    topNotes = initialTopNotes
    botNotes = initialBotNotes
    const topMusic = <LineMusic notes={topNotes} key={0}/>
    const botMusic = <LineMusic notes={botNotes} key={1}/>
    const musicScreen = [topMusic,botMusic]
    return(
        <View style={{ flex: 1, alignItems: 'center'}}>
            {musicScreen}
        </View>
    )
};



const styles = StyleSheet.create({
    text: {
        fontSize: 30,
    },
});
export default MusicDisplay;