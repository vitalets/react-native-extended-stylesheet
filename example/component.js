import React, {View, Text, TouchableHighlight} from 'react-native';
import EStyleSheet from '../src';

const items = [
  'first-child',
  'nth-child-odd',
  'nth-child-even',
  'nth-child-odd',
  'last-child',
];

export default class extends React.Component {
  render() {
    let btnStyles = getButtonStyles(1);
    let btnStylesScaled = getButtonStyles(1.4);
    return (
      <View style={styles.column}>
        <Text style={styles.header}>Extended StyleSheets</Text>
        <Text style={styles.label}>Container: width=80%, margin=10%</Text>

        <Text style={styles.label}>Stripped rows:</Text>
        {items.map((item, index) => {
          return (
            <View key={index} style={EStyleSheet.child(styles, 'row', index, items.length)}>
              <Text style={styles.rowText}>{item}</Text>
            </View>
          );
        })}

        <Text style={styles.label}>Circle button: borderRadius = 0.5 * $size</Text>
        <TouchableHighlight style={btnStyles.button} underlayColor={btnStyles._button.$underlayColor}>
          <Text style={btnStyles.buttonText}>Like it!</Text>
        </TouchableHighlight>
        <Text style={styles.label}>Circle button scaled to 1.4</Text>
        <TouchableHighlight style={btnStylesScaled.button} underlayColor={btnStylesScaled._button.$underlayColor}>
          <Text style={btnStylesScaled.buttonText}>Like it!</Text>
        </TouchableHighlight>

        <Text style={styles.label}>Look into docs for full list of features...</Text>
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
  label: {
    fontSize: '0.7rem',
    color: '$textColor',
    marginTop: 15,
    marginBottom: 3,
  },
  row: {
    borderTopWidth: 1,
    borderColor: 'green',
    width: 120,
    alignItems: 'center',
  },
  'row:nth-child-even': {
    backgroundColor: '#aeaeae' // make stripped
  },
  'row:last-child': {
    borderBottomWidth: 1 // render bottom edge for last row
  },
  rowText: {
    fontSize: '.6rem',
  }
});

const getButtonStyles = EStyleSheet.memoize(scale => {
  return EStyleSheet.create({
    $scale: scale,
    $size: '5rem',
    button: {
      width: '$size',
      height: '$size',
      borderRadius: '0.5 * $size', // calc borderRadius
      backgroundColor: '$buttonColor',
      justifyContent: 'center',
      alignItems: 'center',
      $underlayColor: 'red',  // put underlayColor to variable, access via styles._button.$underlayColor
    },
    buttonText: {
      fontSize: '1.2rem',
      color: 'white',
      fontWeight: 'bold',
    },
  });
});
