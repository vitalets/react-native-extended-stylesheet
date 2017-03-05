import React from 'react';
import {View, Text} from 'react-native';
import themes from './themes';

export default class extends React.Component {
  render() {
    const styles = themeStyles[this.props.theme];
    return (
      <View>
        <Text style={styles.text}>Welcome to Extended StyleSheet!</Text>
      </View>
    );
  }
}

const themeStyles = themes.createStyleSheet({
  text: {
    color: '$colorPrimary'
  }
});
