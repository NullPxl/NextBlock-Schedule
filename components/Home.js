import React from 'react';
import { AsyncStorage, StyleSheet, Text, Image, View } from 'react-native';


export default class Home extends React.Component {

  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon:(
      <Image
        source={require('./assets/home.png')}
        style={{width: 28, height: 28}}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = { 
        time: this.getTimeDifference(this.getNextBlock()[0])[0],
        class: this.getNextBlock() // list that has [time, index] of next block  
     };

  };

  blocks = [ // Default Blocks
    { time:"00:00", class:"Swipe -->" },
  ];

  onLoad = async () => {
    try {
        const storedBlocks = await AsyncStorage.getItem('blocks');
        if (storedBlocks == null) {
          this.blocks = this.blocks.filter((obj) => obj );
          console.log(`ONLOAD NULL: ${this.blocks}`);
        } else { // if there is data in storedBlocks
          // AsyncStorage.clear(); // here for debugging
          this.blocks = JSON.parse(storedBlocks);
          this.blocks = this.blocks.filter((obj) => obj );
          console.log(`ONLOAD DATA: ${JSON.stringify(this.blocks)}`);
        }
    } catch (error) {
        console.log(error)
    }
  };
  
  bellDelay = 52 // User would edit the bell delay in config page

  getTimeDifference(block) {
      // Return the time until the next block
      let today = new Date()
      let epoch = Math.round(today.getTime() / 1000)
      let nextBlockDate = ('0' + (today.getMonth()+1)).slice(-2) + '/'
               + ('0' + today.getDate()).slice(-2) + '/'
               + today.getFullYear() + ' '
               + block // NextBlock
      let nextBlockEpoch = new Date(String(nextBlockDate));
      nextBlockEpoch = Math.round(nextBlockEpoch.getTime() / 1000);
      let timeDifferenceSeconds = (nextBlockEpoch - epoch) + this.bellDelay;
  
      let placeholderDate = new Date(null);
      placeholderDate.setSeconds(timeDifferenceSeconds);
      let timeDifferenceFormatted = placeholderDate.toISOString().substr(11, 8); // hh:mm:ss
      return [timeDifferenceFormatted, timeDifferenceSeconds] // hh:mm:ss, seconds

  };

  getNextBlock() {
      // Return info needed to specify the next block of the day.  (time, index)
      let allDiffs = this.blocks.map(x => (this.getTimeDifference(x["time"])[1])); // Get all time differences
      let posDiffs = allDiffs.filter(x => (x>0)); // get only positive (ahead of current time in day)
      if (posDiffs && posDiffs.length) {   
          // if not empty / if there are more blocks left in day  
          let minValue = Math.min(...posDiffs) // lowest time (closest)
          let blockIndex = allDiffs.indexOf(minValue)
          let nextBlock = this.blocks[blockIndex]["time"]
          return [nextBlock, blockIndex]
      } else {
          // empty / if there are no more blocks left in day, will go to next day
          let minValue = Math.min(...allDiffs) // lowest time (closest)
          let blockIndex = allDiffs.indexOf(minValue)
          let nextBlock = this.blocks[blockIndex]["time"]
          return [nextBlock, blockIndex]
      };
  };

  componentWillMount() {
      // update each second
    setInterval(() => {
      this.setState({
        time: this.getTimeDifference(this.getNextBlock()[0])[0],
        class: this.getNextBlock()
      });
    }, 1000);
    // set up listener for if the screen is focused
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.onLoad()
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  };


  render() {

    nb = this.state.class[0] // next block time
    nbi = this.state.class[1] // next block index

    return ( // Display time left, and which block + class is next
      <View style={styles.text}>
        <Text style={styles.currentTime}>{this.state.time}</Text>
        <Text style={{color: 'rgb(127, 127, 127)', fontSize: 20}}>Until {this.blocks[nbi]["time"]}, {this.blocks[nbi]["class"]}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  text: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40
  },
  currentTime: {
    fontSize: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
