import React from 'react';
import {View, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class extends React.Component {
  render() {
    return (
      <View style={styles.column}>
        <Text>
          Column width depends on device width: {'\n'}- 70% for {'<'}350{'\n'}- 80% for 350-500{'\n'}- 90% for {'>'}500
        </Text>
        <Text style={styles.text}>Text size/color depends on platform.</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  column: {
    alignSelf: 'center',
    borderWidth: 1,
    marginTop: '10%',
    padding: 5,
  },
  '@media (max-width: 350)': { // media query on sheet level
    column: {
      width: '70%',
    }
  },
  '@media (min-width: 350) and (max-width: 500)': {
    column: {
      width: '80%',
    }
  },
  '@media (min-width: 500)': {
    column: {
      width: '90%',
    }
  },
  text: {
    fontSize: '$fontSize',
    '@media ios': { // media query on style level
      color: 'green',
    },
    '@media android': {
      color: 'blue',
    },
  },
});
