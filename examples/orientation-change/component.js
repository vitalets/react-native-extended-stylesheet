import React from 'react';
import {View} from 'react-native';
import EStyleSheet from '../../src';

export default class extends React.Component {
  constructor() {
    super();
    EStyleSheet.subscribe('change', () => {
      this.forceUpdate();
    });
  }
  render() {
    return (
      <View style={styles.column}>
        <View style={styles.item}/>
        <View style={styles.item}/>
        <View style={styles.item}/>
        <View style={styles.item}/>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  column: {
    height: '100%',
    alignItems: 'center',
    '@media (orientation: portrait)': {
      flexDirection: 'column'
    },
    '@media (orientation: landscape)': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }
  },
  item: {
    margin: 10,
    backgroundColor: 'green',
  },
  '@media (orientation: portrait)': {
    item: {
      width: '70%',
      height: '20%',
    },
  },
  '@media (orientation: landscape)': {
    item: {
      width: '40%',
      height: '40%',
    },
  }
});
