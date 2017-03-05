import React from 'react';
import {Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class extends React.Component {
  render() {
    return (
      <Text style={styles.text}>Font size via REM</Text>
    );
  }
}

const styles = EStyleSheet.create({
  text: {
    padding: '0.5rem',
    fontSize: '1rem',
  }
});
