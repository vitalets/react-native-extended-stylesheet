import React from 'react';
import {View, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class extends React.Component {
  render() {
    return (
      <View style={styles.column}>
        <Text style={styles.header}>
          Width: <Text>{styles._column.width}</Text>,
          margin: <Text>{styles._column.marginHorizontal}</Text>
        </Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  column: {
    alignItems: 'center',
    borderWidth: 1,
    marginTop: '10%',
  },
  '@media (max-width: 350)': { // media query on sheet level
    column: {
      width: '70%',
      marginHorizontal: '15%',
    }
  },
  '@media (min-width: 350) and (max-width: 500)': { // media query on sheet level
    column: {
      width: '80%',
      marginHorizontal: '10%',
    }
  },
  '@media (min-width: 500)': { // media query on sheet level
    column: {
      width: '90%',
      marginHorizontal: '5%',
    }
  },
  header: {
    fontSize: 18,
    '@media ios': { // media query on style level
      color: 'green',
    },
    '@media android': { // media query on style level
      color: 'blue',
    },
  }
});
