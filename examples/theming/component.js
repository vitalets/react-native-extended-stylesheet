import React from 'react';
import {View, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Extended StyleSheet!</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$bgColor',
  },
  text: {
    color: '$textColor',
  }
});
