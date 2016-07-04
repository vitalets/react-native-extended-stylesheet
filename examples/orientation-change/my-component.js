import React from 'react';
import {View, Text} from 'react-native';
import EStyleSheet from '../../src';
import SubComponent from './sub-component';

class MyComponent extends React.Component {
  render() {
    const text = EStyleSheet.layout.isLandscape ? `Landscape 40% x 40%` : `Portrait 70% x 20%`;
    return (
      <View style={styles.layout}>
        <View style={styles.rectangle}><Text style={styles.text}>{text}</Text></View>
        <View style={styles.rectangle}><Text style={styles.text}>{text}</Text></View>
        <View style={styles.rectangle}><Text style={styles.text}>{text}</Text></View>
        <SubComponent><Text style={styles.text}>{text}</Text></SubComponent>
      </View>
    );
  }
}

export default EStyleSheet.mixin(MyComponent);

const styles = EStyleSheet.create({
  layout: {
    height: '100%',
    alignItems: 'center',
    '@media (orientation: portrait)': {
      flexDirection: 'column',
    },
    '@media (orientation: landscape)': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    '@media ios (orientation: portrait)': {
      marginTop: '$layoutMarginTop'
    }
  },
  rectangle: {
    margin: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '@media (orientation: portrait)': {
    rectangle: {
      width: '70%',
      height: '20%',
    },
  },
  '@media (orientation: landscape)': {
    rectangle: {
      width: '40%',
      height: '40%',
    },
  },
  text: {
    color: 'white',
    fontSize: 15,
  }
});
