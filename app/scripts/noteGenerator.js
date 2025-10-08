const noteDict = {
    0: 'A',
    1: 'A#',
    2: 'B',
    3: 'C',
    4: 'C#',
    5: 'D',
    6: 'D#',
    7: 'E',
    8: 'F',
    9: 'F#',
    10: 'G',
    11: 'G#'
}

const noteLetterList = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G'
];

const noteDictReverse = {
    'A': 0,
    'A#': 1,
    'Bb': 1,
    'B': 2,
    'Cb': 2,
    'B#': 3,
    'C': 3,
    'C#': 4,
    'Db': 4,
    'D': 5,
    'D#': 6,
    'Eb': 6,
    'E': 7,
    'Fb': 7,
    'E#': 8,
    'F': 8,
    'F#': 9,
    'Gb': 9,
    'G': 10,
    'G#': 11,
    'Ab': 11,
}

const defaultOctave = 4
const defaultNoteLength = 0.25

const majScale = [2, 2, 1, 2, 2, 2, 1]

const naturalMinorScale = [2, 1, 2, 2, 1, 2, 2]

const melodicMinorScaleAscending = [2, 1, 2, 2, 2 ,2, 1]

const melodicMinorScaleDescending = naturalMinorScale.toReversed()

const harmonicMinorScale = [2, 1, 2, 2, 1, 3, 1]

function createSpecificScale( {key, octaveNum, startingIndex, ascendingScale, descendingScaleTemp} ) {

    var descendingScale = descendingScaleTemp.toReversed()
    var currentNote = startingIndex
    var letterIndex = noteDict[startingIndex].charCodeAt(0)
    console.log(letterIndex)
    var currentOctave = defaultOctave
    var thisScale = []

    //Ascending
    for (let step = 0; step < octaveNum; step++) {
        for (var j in ascendingScale) {
            let note = ascendingScale[j]
            let thisNote = {
                "letter": noteDict[currentNote],
                "octave": currentOctave,
                "length": defaultNoteLength,
                "correctlyPlayed": "notPlayed"
            }
            thisScale.push(thisNote)
            currentNote += note
            if (currentNote > 11) {
                currentOctave += 1
                currentNote = currentNote % 12
            }
        }
    }

    //Descending
    for (let step = 0; step < octaveNum; step++) {
        for (var j in descendingScale) {
            let note = descendingScale[j]
            let thisNote = {
                "letter": noteDict[currentNote],
                "octave": currentOctave,
                "length": defaultNoteLength,
                "correctlyPlayed": "notPlayed"
            }
            thisScale.push(thisNote)
            currentNote -= note
            if (currentNote < 0) {
                currentOctave -= 1
                currentNote = 12 + currentNote
            }
        }
    }
    let thisNote = {
        "letter": noteDict[currentNote],
        "octave": currentOctave,
        "length": defaultNoteLength,
        "correctlyPlayed": "notPlayed"
    }
    thisScale.push(thisNote)
    console.log(thisScale);
    return(checkScaleList({key: key, scaleList: thisScale}))
}

function changeAccidental( {noteLetter, octaveNum} ) {
    noteValue = noteDictReverse[noteLetter]
    for (j in noteDictReverse) {
        if (noteDictReverse[j] == noteValue && j != noteLetter)
            return (j)
        // if (noteLetter)
    }
    return (-1)
}

function checkAccidentals( {scaleList} ) {

    //Ascending
    var prevLetter = ''
    
    for (let i in scaleList) {
        let thisLetter = scaleList[i]['letter'].charAt(0)
        let thisLetterFull = scaleList[i]['letter']
        let thisOctave = scaleList[i]['octave'];
        
        if (thisLetter == prevLetter && thisLetterFull != prevLetter) {
            
            thisLetter = changeAccidental( {noteLetter: thisLetterFull, octaveNum: this} )
        }
        let prevLetter = thisLetter
        scaleList[i]['letter'] = thisLetter
        if (i >= scaleList.length / 2) {
            break
        }
    }
    
    //Descending
    prevLetter = ''
    let scaleListReversed = scaleList.toReversed()
    for (let i in scaleListReversed) {
        let thisLetter = scaleListReversed[i]['letter'].charAt(0)
        let thisLetterFull = scaleListReversed[i]['letter']
        
        if (thisLetter == prevLetter && thisLetterFull != prevLetter) {
            thisLetter = changeAccidental( {noteLetter: thisLetterFull} )
        }
        prevLetter = thisLetter
        scaleListReversed[i]['letter'] = thisLetter
        if (i >= scaleListReversed.length / 2) {
            break
        }
    }

    scaleList = scaleList.slice(0, scaleList.length / 2 + 1).concat(scaleListReversed.slice(0, scaleList.length / 2 + 1).toReversed())

    return (scaleList)
}

function checkScaleList( {key, scaleList} ) {
    
    if (scaleList[0]['letter'] != key) {
        scaleList[0]['letter'] = changeAccidental({noteLetter:scaleList[0]['letter']})
    }
    

    scaleList = checkAccidentals({scaleList: scaleList})
    // console.log('list', scaleList)
    return (scaleList)
}



export function generateScale( {key, types, octaveNum} ) {
    let startingIndex = noteDictReverse[key]
    console.log(key,octaveNum)

    if (key == 'Ab') {
        octaveNum += 1;
    }
    let retNotes = []
    console.log(octaveNum);
    //console.log(key)


    //Standard Scales:
    if (types.indexOf('Major') != -1) {
        
        retNotes.push(createSpecificScale({key: key, octaveNum: octaveNum, startingIndex: startingIndex, ascendingScale: majScale, descendingScaleTemp: majScale}))
    }

    if (types.indexOf('Natural Minor') != -1) {
        
        retNotes.push(createSpecificScale({key:key, octaveNum: octaveNum, startingIndex: startingIndex, ascendingScale: naturalMinorScale, descendingScaleTemp: naturalMinorScale}))
    }

    if (types.indexOf('Harmonic Minor') != -1) {
        var currentNote = startingIndex
        var currentOctave = defaultOctave
        var thisScale = []
        for (let step = 0; step < octaveNum; step++) {
            for (var j in harmonicMinorScale) {
                note = harmonicMinorScale[j]
                thisNote = {
                    "letter": noteDict[currentNote],
                    "octave": currentOctave,
                    "length": defaultNoteLength,
                    "correctlyPlayed": "notPlayed"
                }
                thisScale.push(thisNote)
                currentNote += note
                if (currentNote > 11) {
                    currentOctave += 1
                    currentNote = currentNote % 12
                }
            }
        }
        thisNote = {
            "letter": noteDict[currentNote],
            "octave": currentOctave,
            "length": defaultNoteLength,
            "correctlyPlayed": "notPlayed"
        }
        thisScale.push(thisNote)
        thisScale = thisScale.concat(thisScale.toReversed())
        retNotes.push(thisScale)
    }



    //Non-standard Scales:
    if (types.indexOf('Melodic Minor') != -1) {
        var currentNote = startingIndex
        var currentOctave = defaultOctave
        var thisScale = []
        //Ascending
        for (let step = 0; step < octaveNum; step++) {
            for (var j in melodicMinorScaleAscending) {
                note = melodicMinorScaleAscending[j]
                thisNote = {
                    "letter": noteDict[currentNote],
                    "octave": currentOctave,
                    "length": defaultNoteLength,
                    "correctlyPlayed": "notPlayed"
                }
                thisScale.push(thisNote)
                currentNote += note
                if (currentNote > 11) {
                    currentOctave += 1
                    currentNote = currentNote % 12
                }
            }
        }
        //Descending
        for (let step = 0; step < octaveNum; step++) {
            for (var j in melodicMinorScaleDescending) {
                note = melodicMinorScaleDescending[j]
                thisNote = {
                    "letter": noteDict[currentNote],
                    "octave": currentOctave,
                    "length": defaultNoteLength,
                    "correctlyPlayed": "notPlayed"
                }
                thisScale.push(thisNote)
                currentNote -= note
                if (currentNote < 0) {
                    currentOctave -= 1
                    currentNote = 12 + currentNote
                }
            }
        }
        thisNote = {
            "letter": noteDict[currentNote],
            "octave": currentOctave,
            "length": defaultNoteLength,
            "correctlyPlayed": "notPlayed"
        }
        thisScale.push(thisNote)
        retNotes.push(thisScale)
    }

    //combining all patterns
    var newRetNotes = []
    for (let i in retNotes) {
        newRetNotes = newRetNotes.concat(retNotes[i])
    }
    retNotes = newRetNotes

    return(retNotes)
}

export default generateScale;