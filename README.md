# React Native Extended Stylesheet
Extend [React Native](https://facebook.github.io/react-native/) stylesheet with variables, relative units, percents, math operations, scaling and other stuff to control app appearance.

<img align="right" src="https://raw.githubusercontent.com/vitalets/react-native-extended-stylesheet/master/example/screenshot.png">

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [global variables](#global-variables)
  - [local variables](#local-variables)
  - [math operations](#math-operations)
  - [rem units](#rem-units)
  - [percents](#percents)
  - [scaling](#scaling)
  - [_underscored styles](#underscored-styles)
  - [pseudo classes (:nth-child)](#pseudo-classes-nth-child)
  - [OS specific props](#os-specific-props)
  - [caching](#caching)
- [API](#api)
  - [.create()](#create)
  - [.build()](#build)
  - [.value()](#value)
  - [.memoize()](#memoize)
  - [.child()](#child)
- [Feedback](#feedback)
- [License](#license)

## Installation
```
npm i react-native-extended-stylesheet --save
```

## Usage
1. Define extended styles via `EStyleSheet.create()`:

  ```js
  // component.js
  import EStyleSheet from 'react-native-extended-stylesheet';
  
  const styles = EStyleSheet.create({
    column: {
      width: '80%'         // 80% of screen width
    },
    text: {
      color: '$textColor', // use variable $textColor
      fontSize: '1.5rem'   // use relative unit - CSS3 rem
    }
  });
  
  class MyComponent extends React.Component {
    render() {
      return (
        <View style={styles.column}>
          <Text style={styles.text}>Hello</Text>
        </View>
      );
    }
  }  
  ```

2. Actually calculate styles in entry point of your app via `EStyleSheet.build()`:

  ```js
  // app.js
  import EStyleSheet from 'react-native-extended-stylesheet';
  
  EStyleSheet.build({
    textColor: '#0275d8'
  });
  ```
\[[top](#)\]

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
```js
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
\[[top](#)\]

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
\[[top](#)\]

### Math operations
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
\[[top](#)\]

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
\[[top](#)\]

### Percents
Percents are useful only for **single-orientation apps** as calculation performed once on start using screen dimensions. Supporting orientation change is always desing-decision but sometimes it's really unneeded and makes life much easier.  
```js
const styles = EStyleSheet.create({
  column: {
    width: '80%',
    height: '50%',
    marginLeft: '10%'
  }
});
```
How to lock orientaion for [IOS](http://stackoverflow.com/a/24205653/740245), [Android](http://stackoverflow.com/a/4675801/740245).  
\[[top](#)\]

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
\[[top](#)\]

### Underscored styles
Usual react-native stylesheets are calculated to integer numbers and original values are unavailable. But sometimes they are needed. Let's take an example:  
You want to render text and icon with the same size and color. You can take this [awesome icon library](https://github.com/oblador/react-native-vector-icons) and see that `<Icon>` component has `size` and `color` props.
It would be convenient to define style for text and keep icon's size and color in sync.
```js
const styles = EStyleSheet.create({
  text: {
    fontSize: '1rem',
    color: 'gray'
  }
});
```
In runtime `styles` created with original react's `StyleSheet` will look like:
```js
styles = {
  text: 0
}
```
But extended stylesheet saves original values under `_text` property:
```js
styles = {
  text: 0,
  _text: {
    fonrSize: 16,
    color: 'gray'
  }
}
```
To render icon we just take styles from `_text`:
```js
return (
  <View>
    <Icon name="rocket" size={styles._text.fontSize} color={styles._text.color} />
    <Text style={styles.text}>Hello</Text>
  </View>
);
```
\[[top](#)\]

### Pseudo classes (:nth-child)
Extended stylesheet supports 4 pseudo classes: `:first-child`, `:nth-child-even`, `:nth-child-odd`, `:last-child`. As well as in traditional CSS it allows to apply special styling for first/last items or render stripped rows.  
To get style for appropriate index you should use `EStyleSheet.child()` method. 
It's signature: `EStyleSheet.child(stylesObj, styleName, index, count)`.
```js
const styles = EStyleSheet.create({
  row: {
    fontSize: '1.5rem',
    borderTopWidth: 1
  },
  'row:nth-child-even': {
    backgroundColor: 'gray' // make stripped
  },
  'row:last-child': {
    borderBottomWidth: 1 // render bottom edge for last row
  }
});
...
render() {
  return (
    <View>
      {items.map((item, index) => {
        return (
          <View key={index} style={EStyleSheet.child(styles, 'row', index, items.length)}></View>
        );
      })}
    </View>
  );
}
```
\[[top](#)\]

### OS specific props
If you want different values of the same prop for IOS / Android, just name prop with appropriate suffix:
```js
const styles = EStyleSheet.create({
  container: {
    marginTopIOS: 10,
    marginTopAndroid: 0
  }
});
```
The output style will have only one property `marginTop` depending on OS.  
\[[top](#)\]

### Caching
If you use dynamic styles depending on runtime prop or you are making reusable component with dynamic styling you may need stylesheet creation in every `render()` call. Let's take example from [scaling](#scaling) section:
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
To avoid creating styles on every render you can use `EStyleSheet.memoize()` wrapper method that works similar to [lodash.memoize](https://lodash.com/docs#memoize): store result for particular parameters and returns it from cache when called with the same parameters. Updated example:
```js
let getStyle = EStyleSheet.memoize(function (scale = 1) {
  return EStyleSheet.create({
    $scale: scale,
    button: {
      width: 100,
      height: 20,
      marginLeft: 10
    }
  });
});
```
Now if you call `getStyle(1.5)` 3 times actually style will be created on the first call and two other calls will get it from cache.  
\[[top](#)\]

## EStyleSheet API
### .create()
```js
/**
 * Creates extended stylesheet object
 * @param {Object} source style
 * @returns {Object} extended stylesheet object
 */
EStyleSheet.create = function (source) {...}
```

### .build()
```js
/**
 * Calculates all stylesheets
 * @param {Object} [globalVars] global variables for all stylesheets
 */
EStyleSheet.build = function (globalVars) {...}
```

### .value()
```js
/**
 * Calculates particular value
 * @param {*} value
 * @param {String} [prop] property for which value is calculated. Needed for example for percent values.
 * @returns {*} calculated result
 */
EStyleSheet.value = function (value, prop) {...}
```

### .memoize()
```js
/**
 * Wraps function to cache calls with the same parameters
 * @param {Function} fn
 * @returns {Function} wrapped function
 */
EStyleSheet.memoize = function (fn) {...}
```
### .child()
```js
/**
 * Returns styles with pseudo classes :first-child, :nth-child-even, :last-child according to index and count
 *
 * @param {Object} stylesheet
 * @param {String} styleName
 * @param {Number} index index of item for style
 * @param {Number} count total count of items
 * @returns {Object|Array} styles
 */
EStyleSheet.child = function (styles, styleName, index, count) {...}
```
\[[top](#)\]

## Feedback
If you have any ideas or something goes wrong feel free to [open issue](https://github.com/vitalets/react-native-extended-stylesheet/issues/new) or pull request.

## License
MIT
