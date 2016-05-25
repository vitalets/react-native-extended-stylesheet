import React, {View, Text} from 'react-native';
import EStyleSheet from '../../src';

export default class extends React.Component {
  render() {
    return (
      <View style={styles.column}>
        <Text style={styles.header}>Welcome to Extended StyleSheet!</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  column: {
    width: '80%',
    marginHorizontal: '10%',
    marginTop: '10%',
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    padding: '0.5rem',
    ios: {
      backgroundColor: '#666666',
    },
    android: {
      backgroundColor: '#dcdcdc',
    },
  },
  header: {
    fontSize: '1rem',
    color: '$fontColor',
  }
});
