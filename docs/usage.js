import React, {View, Text} from 'react-native';
// -------- copy to docs ---------
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  column: {
    width: '80%',
    marginLeft: '10%',

  },
  button: {
    fontSize: '1.2rem',
    color: '$fontColor',

  }
});

export default class extends React.Component {
  render() {
    return (
      <View style={styles.column}>
        <Text style={styles.button}>
          Like it!
        </Text>
      </View>
    );
  }
}