import React from 'react';
import {View} from 'react-native';
import EStyleSheet from '../../src';

class MyComponent extends React.Component {
  render() {
    // console.warn(EStyleSheet.layout.height);
    return (
      <View style={styles.layout}>
        <View style={styles.top}>
          <View style={styles.topLeft}/>
          <View style={styles.topRight}/>
        </View>
        <View style={styles.middle}>
          <View style={styles.middleLeft}/>
          <View style={styles.middleRight}/>
        </View>
        <View style={styles.bottom}/>
      </View>
    );
  }
}

export default EStyleSheet.mixin(MyComponent);

const styles = EStyleSheet.create({
  layout: {
    flex: 1,
  },
  top: {
    width: '100%',
    height: '10%',
    backgroundColor: 'green',
    flexDirection: 'row',
  },
  topLeft: {
    width: '20%',
    height: '10%',
    backgroundColor: 'blue',
  },
  topRight: {
    marginLeft: '60%',
    width: '20%',
    height: '10%',
    backgroundColor: 'red',
  },
  middle: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
  },
  middleLeft: {
    width: '50%',
    flex: 1,
    backgroundColor: 'brown',
  },
  middleRight: {
    width: '50%',
    flex: 1,
    backgroundColor: 'gold',
  },
  bottom: {
    width: '100%',
    height: '10%',
    backgroundColor: 'olive',
  },
});
