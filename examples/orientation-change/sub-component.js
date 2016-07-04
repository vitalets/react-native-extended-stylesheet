import React from 'react';
import {View} from 'react-native';
import EStyleSheet from '../../src';

class SubComponent extends React.Component {
  render() {
    return (
      <View style={styles.rectangle}>
        {this.props.children}
      </View>
    );
  }
}

export default EStyleSheet.mixin(SubComponent);

const styles = EStyleSheet.create({
  rectangle: {
    margin: 10,
    backgroundColor: 'blue',
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
  }
});
