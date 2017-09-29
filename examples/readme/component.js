import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import memoize from 'lodash.memoize';

const items = [
  ':first-child',
  ':nth-child-odd',
  ':nth-child-even',
  ':nth-child-odd',
  ':last-child',
];

export default class extends React.Component {
  render() {
    let btnStyles = getButtonStyles(1);
    let btnStyles2x = getButtonStyles(2);
    return (
      <View style={styles.column}>
        <Text style={styles.header}>Extended StyleSheets</Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Percent values</Text>,{' '}
          <Text style={styles.bold}>variables</Text> and <Text style={styles.bold}>operations</Text>:
          width=<Text style={styles.bold}>100% - 20</Text>,
          margin=<Text style={styles.bold}>10% * $width</Text>
        </Text>

        <Text style={[styles.label, styles.bold]}>CSS pseudo-classes:</Text>
        {items.map((item, index) => {
          const itemStyle = EStyleSheet.child(styles, 'row', index, items.length);
          return (
            <View key={index} style={itemStyle}>
              <Text style={styles.rowText}>{item}</Text>
            </View>
          );
        })}

        <Text style={styles.label}>
          <Text style={styles.bold}>Media queries</Text>,{' '}
          <Text style={styles.bold}>REMs</Text> and <Text style={styles.bold}>scaling: </Text>
          <Text>@media (max-width: 350): {'{'} width: 20% {'}'}</Text>
        </Text>
        <TouchableHighlight style={btnStyles.button} underlayColor={btnStyles._button.$underlayColor}>
          <Text style={btnStyles.buttonText}>Like it!</Text>
        </TouchableHighlight>

        <Text style={styles.label}><Text style={styles.bold}>Scale </Text>(2x):</Text>
        <TouchableHighlight style={btnStyles2x.button} underlayColor={btnStyles2x._button.$underlayColor}>
          <Text style={btnStyles2x.buttonText}>Like it!</Text>
        </TouchableHighlight>

        <Text style={styles.label}>View docs for all features...</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  column: {
    width: '80%', // 80% of screen width
    height: '80%', // 80% of screen height
    marginHorizontal: '10%',
    marginTop: '10%',
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: 4,
  },
  header: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'black',
  },
  bold: {
    fontWeight: 'bold',
  },
  label: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '$textColor',
    marginTop: 10,
    marginBottom: 3,
  },
  row: {
    borderTopWidth: 1,
    borderColor: 'green',
    width: 120,
    alignItems: 'center',
  },
  'row:first-child': {
    borderColor: 'blue',
    borderTopWidth: 3,
  },
  'row:nth-child-odd': {
    backgroundColor: 'gray'
  },
  'row:nth-child-even': {
    backgroundColor: 'white'
  },
  'row:last-child': {
    backgroundColor: 'yellow',
    borderBottomWidth: 1
  },
  rowText: {
    fontSize: '.8rem',
  }
});

const getButtonStyles = memoize(scale => {
  return EStyleSheet.create({
    $scale: scale,
    $size: '5rem',
    button: {
      width: '$size',
      height: '$size * 0.5',
      borderRadius: '$size * 0.1', // calc borderRadius
      backgroundColor: '$buttonColor',
      justifyContent: 'center',
      alignItems: 'center',
      $underlayColor: 'red', // put underlayColor to variable, access via styles._button.$underlayColor
    },
    buttonText: {
      fontSize: '1.1rem',
      color: 'white',
      fontWeight: 'bold',
    },
  });
});
