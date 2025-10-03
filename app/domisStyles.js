import{ StyleSheet } from 'react-native';

export const domisStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    horizontalContainer: {
        flexDirection: 'row',
        backgroundColor: '#3D2022',
        alignItems: "center"
        
    },
    buttonStyle: {
        color: 'white',
        flex: 1,       
    },
    buttonTextStyle: {
        textAlign: "center",
        fontSize: 30
    },
    pickerStyle: {
        backgroundColor: '#313639',
        flex:1
    },
    checkBoxContainer: {
        flexDirection: 'row',
        backgroundColor: '#313639',
        flex:1,
    },
    checkBoxLargeContainer: {
        flexDirection: 'column',
        flex:1
    },
    checkBoxStyle: {
        backgroundColor: 'black',
        height:50,
        width:50,
    },
 })