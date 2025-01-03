import React, { Component } from 'react';
import { Canvas, Rect, Group, Circle, Line, drawAsImage } from "@shopify/react-native-skia";
import { View } from 'react-native';
import Note from './MusicNoteComponent';
import PropTypes from 'prop-types';

const LineMusic = ( attributes ) => {
    const width = 800;
    const height = 200;
    const r = width * 0.33;
    const borderWidth = 4

    const centerX = (width - borderWidth * 2) / 2 + borderWidth;
    const centerY = (height - borderWidth * 2) / 2 + borderWidth;
    var i = 1;


    var topMusicNotes = [];
    topMusicNotes = attributes.notes
    // This fixes the problem ^, whenever using passed arguments you do it like that.

    const positions = {
        "E" : 200,
        "F" : 177.6,
        "G" : 155.4,
        "A" : 133.2,
        "B" : 111,
        "C" : 88.8,
        "D" : 66.6,
        "E2" : 44.4,
        "F2" : 22.2
    };
    // Instead of this, it might be easier to turn each letter into a number than multiply it by a constant
    // There also will be many more octaves so just try and find an equation to solve for the y value without hard coding it
    // For example G2 = 0, C = 4 --> G2 ypos = 0, C ypos = 4 * 22.2

    
    function getNoteYPos(note) {
        letterCode = note['letter'].charCodeAt(0);
        if (letterCode < 65) {
            letterCode += 7;
        }
        letterCode -= 67;
        retVal = (letterCode * 18.2);
        octaveOffset = (((note['octave'] - 4) * 120));
        retVal = retVal + octaveOffset;
        retVal = 200 - retVal
        console.log(note['letter'].charAt(0), note['letter'].charCodeAt(0), retVal);
        return correctY(retVal);
    }

    function correctY(x) {
        if (x < 24 && x > 8) {
            return 16
        } else if (x < 8 && x > 0) {
            return 0
        }
        if (x <40 && x > 24) {
            return 32;
        } else if (x < 56 && x > 40) {
            return 48;
        } else if (x < 72 && x > 56) {
            return 64;
        } else if (x < 88 && x > 72) {
            return 80;
        } else if (x < 104 && x > 88) {
            return 96;
        } else if (x < 120 && x > 104) {
            return 112;
        } else if (x < 136 && x > 120) {
            return 128;
        } else if (x < 152 && x > 136) {
            return 144;
        } else if (x < 168 && x > 152) {
            return 160;
        } else if (x < 184 && x > 168) {
            return 176;
        } else if (x < 200 && x <184) {
            return 192;
        }
        return 200
    }
   
    //console.log(attributes.notes);

    const xpos = {
        0 : 100,
        1 : 300,
        2 : 500,
        3 : 700
    };

    var xPos = 0
    function getNoteXPos(note) {
        if (note.length == "0.5") {
            xPos += 200
        }
        if (note.length == "0.25") {
            xPos += 80
        }
        return xPos;
    }
    

    


    return (
        <Canvas style={{ width, height }}>
            
            <Rect
                x={0} y={0} width={width} height={height} color='black'
            />
            
            <Rect
                x={borderWidth} y={borderWidth} width={width - borderWidth * 2} height={height - borderWidth * 2} color='white'
            />
             <Line 
                p1={{ x:4, y: 32 }}
                p2={{ x:796, y:32}}
                color="grey"
                strokeWidth={2}
            />
            <Line 
                p1={{ x:4, y: 64 }}
                p2={{ x:796, y:64 }}
                color="grey"
                strokeWidth={2}
            />
            <Line 
                p1={{ x:4, y: 96 }}
                p2={{ x:796, y:96}}
                color="grey"
                strokeWidth={2}
            />
            <Line 
                p1={{ x:4, y: 128 }}
                p2={{ x:796, y:128}}
                color="grey"
                strokeWidth={2}
            />
            <Line 
                p1={{ x:4, y: 160 }}
                p2={{ x:796, y:160}}
                color="grey"
                strokeWidth={2}
            />
            
            {topMusicNotes.map((note, index) => (
                <Note key={index} color='black' cx={getNoteXPos(note)} cy={getNoteYPos(note)} />
            ))}
        </Canvas>
    );
  };

  LineMusic.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
        letter: PropTypes.string.isRequired,
        octave: PropTypes.number.isRequired,
        length: PropTypes.number.isRequired,
        correctlyPlayed: PropTypes.string.isRequired,
    }))
};
  
export default LineMusic;