# react-native-extended-stylesheet
Extend [React Native](https://facebook.github.io/react-native/) stylesheet with variables, relative units, percents, math operations, scaling and other stuff to control app appearance.

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [global variables](#global-variables)
  - [local variables](#local-variables)
  - [math operations](#math-operations)
  - [rem units](#rem-units)
  - [percents](#percents)
  - [scaling](#scaling)
  - [_underscored styles](#)
  - [conditional styles](#)
  - [pseudo selectors (nth-child)](#)
  - [OS specific props](#)
  - [caching](#)
- [API](#api)
  - [.create()](#)
  - [.build()](#)
  - [.value()](#)
  - [.memoize()](#)

## Installation
```
npm i react-native-extended-stylesheet --save
```

## Usage
Define styles via `EStyleSheet.create()`:
```js
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  column: {
    width: '80%'
  },
  text: {
    color: '$textColor',
    fontSize: '1.5rem'
  }
});
```
Actually calc styles in entry point of your app via `EStyleSheet.build()`:
```js
import EStyleSheet from 'react-native-extended-stylesheet';

EStyleSheet.build({
  textColor: '#0275d8'
});
```
## Features
### Global variables
Global variables are passed to `EStyleSheet.build()` and available in any stylesheet of whole app.  
To use global variable just reference it's name with `$` prefix:
```js
// component
const styles = EStyleSheet.create({
  text: {
    color: '$textColor'
  }
});
// app entry
EStyleSheet.build({
  textColor: '#0275d8'
});
```
You can put all global variables to separate file to control app theme:
```
// theme.js
export default {
  textColor: '#0275d8',
  buttonColor: 'green',
  ...
}

// app entry
import theme from '.theme';
EStyleSheet.build(theme);
```

### Local variables
Local variables can be defined directly in sylesheet and have priority over global variables.
```js
const styles = EStyleSheet.create({
  $textColor: '#0275d8',
  text: {
    color: '$textColor'
  },
  icon: {
    color: '$textColor'
  },
});
```
Local variables are also available in result style: `styles.$textColor`.

### Operations
Any value can contain one of following math operations: `*`, `+`, `-`. Operands can be numbers, variables and percents.  
For example, to render circle you may create style:
```js
const styles = EStyleSheet.create({
  $size: 20,
  circle: {
    width: '$size',
    height: '$size',
    borderRadius: '0.5 * $size'
  }
});
```

### REM units
Similar to [CSS3 rem unit](http://snook.ca/archives/html_and_css/font-size-with-rem) it allows to define any integer value as relative to the root element. In our case root value is special `rem` global variable that can be set in `EStyleSheet.build()`. It makes easy to scale app depending on screen size and other conditions. Default rem is `16`.
```js
// component
const styles = EStyleSheet.create({
  text: {
    fontSize: '1.5rem',
    marginHorizontal: '2rem'
  }
});
// app entry
let {height, width} = Dimensions.get('window');
EStyleSheet.build({
  rem: width > 340 ? 18 : 16
});
```
### Percents
Percents are useful only for **single-orientation apps** as they are calculated once on start using screen dimensions. Supporting orientation change is always desing decision but sometimes it's really unneeded and makes life much easier.  
```js
const styles = EStyleSheet.create({
  column: {
    width: '80%',
    height: '50%',
    marginLeft: '10%'
  }
});
```

### Scaling
You can easily scale your components by setting special `$scale` variable. 
```js
const styles = EStyleSheet.create({
  $scale: 1.5,
  button: {
    width: 100,
    height: 20,
    marginLeft: 10
  }
});
```
This also helps to create reusable components that could be scaled depending on prop.
```js
class Button extends React.Component {
  static propTypes = {
    scale: React.PropTypes.number
  };
  render() {
    let style = getStyle(this.props.scale)
    return (
      <View style={style.button}>
      </View>
    );
  }
}

let getStyle = function (scale = 1) {
  return EStyleSheet.create({
    $scale: scale,
    button: {
      width: 100,
      height: 20,
      marginLeft: 10
    }
  });
}

```



