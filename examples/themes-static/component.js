import React from 'react';
import {View, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.text}>Reload app to see different themes!</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  text: {
    color: '$colorPrimary'
  }
});
