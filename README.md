# React Native Extended StyleSheet

[![npm version](https://badge.fury.io/js/react-native-extended-stylesheet.svg)](https://badge.fury.io/js/react-native-extended-stylesheet)
[![Build Status](https://travis-ci.org/vitalets/react-native-extended-stylesheet.svg?branch=master)](https://travis-ci.org/vitalets/react-native-extended-stylesheet)
[![Coverage Status](https://coveralls.io/repos/github/vitalets/react-native-extended-stylesheet/badge.svg?branch=master)](https://coveralls.io/github/vitalets/react-native-extended-stylesheet?branch=master)

Extend [React Native](https://facebook.github.io/react-native/) stylesheets with media-queries, variables, dynamic themes,
relative units, percents, math operations, scaling and other styling stuff.

<img align="right" src="https://raw.githubusercontent.com/vitalets/react-native-extended-stylesheet/master/examples/screenshot.png">

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [global variables](#global-variables)
  - [theming](#theming)
  - [local variables](#local-variables)
  - [math operations](#math-operations)
  - [rem units](#rem-units)
  - [percents](#percents)
  - [media queries](#media-queries)
  - [scaling](#scaling)
  - [underscored styles](#underscored-styles)
  - [pseudo classes (:nth-child)](#pseudo-classes-nth-child)
  - [value as a function](#value-as-a-function)
  - [caching](#caching)
  - [outline for debug](#outline-for-debug)
- [API](#api)
  - [.create()](#create)
  - [.build()](#build)
  - [.value()](#value)
  - [.memoize()](#memoize)
  - [.child()](#child)
  - [.subscribe()](#subscribe)
- [FAQ](#faq)
- [Feedback](#feedback)
- [License](#license)

## Installation
```
npm i react-native-extended-stylesheet --save
```

## Usage

2. Import `EStyleSheet` and call `EStyleSheet.build()` in entry point of your app:

  ```js
  // app.js
  import EStyleSheet from 'react-native-extended-stylesheet';
  
  EStyleSheet.build({
    $textColor: 'green' // variable 
  });
  ```

1. Define styles using `EStyleSheet.create()` in components:

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
        // use styles as normal react-native StyleSheet
        <View style={styles.column}>
          <Text style={styles.text}>Hello</Text>
        </View>
      );
    }
  }  
  ```
  
\[[top](#react-native-extended-stylesheet)\]

## Features
### Global variables
Global variables are useful for global theming or A/B testing of your app. 
They are passed to `EStyleSheet.build()` and available in any stylesheet.  
```js
// app entry: set global variables and calc styles
EStyleSheet.build({
  $textColor: '#0275d8'
});

// component: use global variables
const styles = EStyleSheet.create({
  text: {
    color: '$textColor'
  }
});
```
\[[top](#react-native-extended-stylesheet)\]

### Theming
There can be two types of themes:
  * *static* (app reload needed to theme change)
  * *dynamic* (theme can be changed in runtime)

Please see examples of [static themes](examples/themes-static) and [dynamic themes](examples/themes-dynamic).  
\[[top](#react-native-extended-stylesheet)\]

### Local variables
Local variables can be defined directly in sylesheet and have priority over global variables.
To define local variable just start it with `$`:
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
\[[top](#react-native-extended-stylesheet)\]

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
\[[top](#react-native-extended-stylesheet)\]

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
\[[top](#react-native-extended-stylesheet)\]

### Percents
Percent values are useful for **single-orientation apps** because calculation is performed on app start only.
They are calculated relative to **screen width/height** (not parent component!).
```js
const styles = EStyleSheet.create({
  column: {
    width: '80%',
    height: '50%',
    marginLeft: '10%'
  }
});
```
Note: supporting orientation change is always design-decision but sometimes it's really unneeded and makes life much easier.
How to lock orientaion for [IOS](http://stackoverflow.com/a/24205653/740245), [Android](http://stackoverflow.com/a/4675801/740245).  

**Percents in nested components**  
If you need sub-components with percentage props based on parent, you can achieve it with variables.  
For example, to render 2 sub-columns with 30%/70% width of parent:
```js
const styles = EStyleSheet.create({
  $columnWidth: '80%',
  column: {
    width: '$columnWidth',
    flexDirection: 'row'
  },
  subColumnLeft: {
    width: '0.3 * $columnWidth'
  },
  subColumnRight: {
    width: '0.7 * $columnWidth'
  }
});

...

render() {
  return (
    <View style={styles.column}>
      <View style={styles.subColumnLeft}></View>
      <View style={styles.subColumnRight}></View>
    </View>
  );
}

```
\[[top](#react-native-extended-stylesheet)\]

### Media queries
Media queries are supported in standard format (thanks for idea to [@grabbou](https://github.com/grabbou), 
[#5](https://github.com/vitalets/react-native-extended-stylesheet/issues/5)).
They allows to have different styles for different screens, platform, orienation etc.  

Supported values are:

* media type: `ios|android`
* `width`, `min-width`, `max-width`
* `height`, `min-height`, `max-height`
* `orientation` (`landscape|portrait`)
* `aspect-ratio`

You can define media queries on sheet level or style level:
```js
const styles = EStyleSheet.create({
  column: {
    width: '80%',
  },
  '@media (min-width: 350) and (max-width: 500)': { // media query on sheet level
    column: {
      width: '90%',
    }
  },
  header: {
    fontSize: 18,
    '@media ios': { // media query on style level
      color: 'green',
    },
    '@media android': {
      color: 'blue',
    },
  }
});
```
See full example [here](examples/media-queries).  
\[[top](#react-native-extended-stylesheet)\]

### Scaling
You can apply scale to components by setting special `$scale` variable. 
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
This helps to create reusable components that could be scaled depending on prop:
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
To cache calculated styles please have a look on [caching](#caching) section.  
\[[top](#react-native-extended-stylesheet)\]

### Underscored styles
Original react-native stylesheets are calculated to integer numbers and original values are unavailable. 
But sometimes they are needed. Let's take an example:  
You want to render text and icon with the same size and color. 
You can take this [awesome icon library](https://github.com/oblador/react-native-vector-icons) 
and see that `<Icon>` component has `size` and `color` props.
It would be convenient to define style for text and keep icon's size/color in sync.
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
But extended stylesheet saves calculated values under `_text` property:
```js
styles = {
  text: 0,
  _text: {
    fontSize: 16,
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
\[[top](#react-native-extended-stylesheet)\]

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
\[[top](#react-native-extended-stylesheet)\]

### Value as a function
For the deepest customization you can specify any value as a function that will be executed on EStyleSheet build. 
For example, you may *darken* or *lighten* color of variable via [npm color package](https://www.npmjs.com/package/color): 
```js
import Color from 'color';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  button: {
    backgroundColor: '$buttonColor',
  },
  $underlayColor: () => Color(EStyleSheet.value('$buttonColor')).darken(0.1).hexString();
});
...
render() {
  return (
    <TouchableHighlight style={styles.button} underlayColor={styles.$underlayColor}>
      ...
    </TouchableHighlight>
  );
}

```
\[[top](#react-native-extended-stylesheet)\]

### Caching
If you use dynamic styles depending on runtime prop or you are making reusable component with dynamic styling
you may need stylesheet creation in every `render()` call. Let's take example from [scaling](#scaling) section:
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
Now if you call `getStyle(1.5)` 3 times actually style will be created on the first call 
and two other calls will get it from cache.  
\[[top](#react-native-extended-stylesheet)\]

### Outline for debug
To outline all components for debug purpuses just set special `$outline` variable:
```js
// outline all stylesheets
EStyleSheet.build({outline: 1}); 

// outline particular stylesheet
const styles = EStyleSheet.create({
  $outline: 1,
  column: {
    width: '80%',
    flexDirection: 'row'
  },
  ...
});
```
\[[top](#react-native-extended-stylesheet)\]

## EStyleSheet API
### .create()
```js
/**
 * Creates extended stylesheet object
 *
 * @param {Object} source style
 * @returns {Object} extended stylesheet object
 */
 create (source) {...}
```
\[[top](#react-native-extended-stylesheet)\]

### .build()
```js
/**
 * Calculates all stylesheets
 *
 * @param {Object} [globalVars] global variables for all stylesheets
 */
 build (globalVars) {...}
```
\[[top](#react-native-extended-stylesheet)\]

### .value()
```js
/**
 * Calculates particular value
 *
 * @param {*} value
 * @param {String} [prop] property for which value is calculated. Needed for example for percent values.
 * @returns {*} calculated result
 */
 value (value, prop) {...}
```
\[[top](#react-native-extended-stylesheet)\]

### .memoize()
```js
/**
 * Wraps function to cache calls with the same parameters
 *
 * @param {Function} fn
 * @returns {Function} wrapped function
 */
 memoize (fn) {...}
```
\[[top](#react-native-extended-stylesheet)\]

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
 child (styles, styleName, index, count) {...}
```
\[[top](#react-native-extended-stylesheet)\]

### .subscribe()
```js
/**
 * Subscribe to events. Currently only 'build' event is supported
 *
 * @param {String} event
 * @param {Function} listener
 */
 subscribe (event, listener) {...}

```
This method is useful when you want to pre-render some component on init.
As extended style is calculated after call of `EStyleSheet.build()`,
it is not available instantly after creation so you should wrap pre-render
info listener to `build` event:
```js
const styles = EStyleSheet.create({
  button: {
    width: '80%',
  }
});

// this will NOT work as styles.button is not calculated yet
let Button = <View style={styles.button}></View>;

// but this will work
let Button;
EStyleSheet.subscribe('build', () => {
  Button = <View style={styles.button}></View>;
});
```
\[[top](#react-native-extended-stylesheet)\]

## FAQ
**What about orientation change?**  
Currently orientation change is not properly supported. Please see 
[this issue](https://github.com/vitalets/react-native-extended-stylesheet/issues/9) for more details.

## Feedback
If you have any ideas or something goes wrong feel free to 
[open issue](https://github.com/vitalets/react-native-extended-stylesheet/issues/new) or pull request.

## License
MIT  
\[[top](#react-native-extended-stylesheet)\]
