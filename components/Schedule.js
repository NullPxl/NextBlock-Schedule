import React from 'react';
import { Image, TimePickerAndroid, TouchableOpacity, TextInput, AsyncStorage, StyleSheet, Text, View } from 'react-native';


export default class Schedule extends React.Component {

  static navigationOptions = {
    drawerLabel: 'Schedule',
    drawerIcon:(
      <Image
        source={require('./assets/calender.png')}
        style={{width: 28, height: 28}}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = { 
        blocks: []
     };
     this.timePicker = this.timePicker.bind(this);
     this._textSubmit = this._textSubmit.bind(this);
     this._blockInput = this._blockInput.bind(this);
     this._doesExist = this._doesExist.bind(this);
     this.saveData = this.saveData.bind(this);

  };

async timePicker(index){
  const TimePickerModule = require('NativeModules').TimePickerAndroid;
  try {
      const {action, hour, minute} = await TimePickerAndroid.open({
          hour: 0,
          minute: 0,
          is24Hour: true,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
          // Selected hour (0-23), minute (0-59)
          //Applying extra 0 before the hour/minute for better visibility
          // 9 minutes => 09 minutes
          var m=(minute<10)?"0"+minute:minute;
          var h=(hour<10)?"0"+hour:hour;
          const blocks = [...this.state.blocks];
          if (blocks[index]) {
            blocks[index]["time"] = h+":"+m
          } else {
            blocks[index] = {time: h+":"+m}
          };
          this.setState({blocks:blocks});
          // console.log(blocks)
      }
  } catch ({code, message}) {
      alert(message);
  }
};

  _textSubmit(text, index){
    const blocks = [...this.state.blocks];
    if (blocks[index]) {
      blocks[index]["class"] = text
    } else {
      blocks[index] = {class: text}
    };
    // AsyncStorage.setItem('classes', className);
    this.setState({blocks:blocks});
    // console.log(blocks)
  };

  _doesExist(index, key) { // for determining what the value of text input is set to.
    if (this.state.blocks[index]) {
      if (key in this.state.blocks[index]) {
        return(true)
      } else {
        return(false)
      }
    } else {
      return(false)
    }
  };

  hasTime(dict) {
    return dict.hasOwnProperty('time')

  };
  
  _blockInput(index, block) { // Return an input for block name and block time
    return (
        <View style={styles.buttonRow}>
            <TouchableOpacity  
                style={styles.button}
                onPress={() => this.timePicker(index)}>
                <Text>{this._doesExist(index, 'time') ? this.state.blocks[index]["time"] : `Block ${block} Time`}</Text>
            </TouchableOpacity>      
            <TextInput
                placeholder = { `Enter Block ${block} Name` }
                onChangeText={(txt) => this._textSubmit(txt, index)}
                value={this._doesExist(index, 'class') ? this.state.blocks[index]["class"] : ''}
                maxLength={15}
            />
        </View>
    )
  };

  saveData() {
    try {
      let blocks = this.state.blocks;
      if (blocks.every(this.hasTime)) { // make sure user uses the time input
        AsyncStorage.setItem('blocks', JSON.stringify(blocks));
        this.setState({blocks:blocks});
      } else {
        console.log("You must select a time for each class!")
        alert("You must select a time for each class!");
      }
    } catch(error) {
      console.log(error.message);
    }
  };

  getData = async () => {
    try {
      let retrievedItem =  await AsyncStorage.getItem('blocks');
      let blocks = JSON.parse(retrievedItem);
      console.log(`ASYNC STORAGE: ${JSON.stringify(blocks)}`) // debugging line
    } catch (error) {
      console.log(error.message);
    }
  };

render() {
  return (
    <View style={styles.text}>
      { this._blockInput(0, "1") }
      { this._blockInput(1, "2") }
      { this._blockInput(2, "3") }
      { this._blockInput(3, "4") }
      { this._blockInput(4, "5") }
      { this._blockInput(5, "6") }
      { this._blockInput(6, "7") }
      
      <View style={{paddingTop: 20, paddingLeft: 18, paddingRight: 18, justifyContent: 'space-between'}}>
        <TouchableOpacity style={styles.saveButton} onPress={this.saveData}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.saveButton} onPress={this.getData}>
          <Text style={styles.saveText}>Get stuff in console</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
};


const styles = StyleSheet.create({
  text: {
    backgroundColor: '#ffff',
    marginTop: 30,
    justifyContent: 'space-between'
  },
  button: {
    padding: 15,
    backgroundColor: "#DDDDDD",
    width: "45%",
    height: "100%",
  },
  textButton: {
    padding: 15,
    width: "45%",
    height: "100%",
  },
  buttonRow: {
    flexDirection: "row-reverse", 
    justifyContent: "space-around",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#8ccaf2",
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  saveText: {
    color: 'white', 
    fontSize: 15, 
    fontWeight: 'bold'
  }
});
