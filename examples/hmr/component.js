import React from 'react';
import {View, Text, Button} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {count: 0};
  }
  render() {
    return (
      <View style={styles.column}>
        <Text style={styles.header}>You clicked: {this.state.count}</Text>
        <Button onPress={() => this.setState({count: this.state.count + 1})} title="Click me!"/>
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
  },
  header: {
    fontSize: '1rem',
    color: '$fontColor',
  }
});
