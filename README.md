# React Native Extended StyleSheet

[![Build Status](https://travis-ci.org/vitalets/react-native-extended-stylesheet.svg?branch=master)](https://travis-ci.org/vitalets/react-native-extended-stylesheet)
[![Coverage Status](https://coveralls.io/repos/github/vitalets/react-native-extended-stylesheet/badge.svg?branch=master)](https://coveralls.io/github/vitalets/react-native-extended-stylesheet?branch=master)
[![npm version](https://img.shields.io/npm/v/react-native-extended-stylesheet.svg)](https://www.npmjs.com/package/react-native-extended-stylesheet)
[![license](https://img.shields.io/npm/l/react-native-extended-stylesheet.svg)](https://www.npmjs.com/package/react-native-extended-stylesheet)

Drop-in replacement of [React Native StyleSheet](https://facebook.github.io/react-native/docs/stylesheet.html) with media-queries, variables, dynamic themes,
relative units, percents, math operations, scaling and other styling stuff.

<img align="right" src="https://cloud.githubusercontent.com/assets/1473072/26778748/49c190be-49eb-11e7-83a1-b06372df8d85.png">

- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [global variables](#global-variables)
  - [local variables](#local-variables)
  - [theming](#theming)
  - [media queries](#media-queries)
  - [math operations](#math-operations)
  - [rem units](#rem-units)
  - [percents](#percents)
  - [scaling](#scaling)
  - [underscored styles](#underscored-styles)
  - [pseudo classes (:nth-child)](#pseudo-classes-nth-child)
  - [value as a function](#value-as-a-function)
  - [caching](#caching)
  - [outline for debug](#outline-for-debug)
  - [hot module reload](#hot-module-reload)
- [API](#api)
  - [.create()](#create)
  - [.build()](#build)
  - [.value()](#value)
  - [.child()](#child)
  - [.subscribe()](#subscribe)
  - [.unsubscribe()](#unsubscribe)
- [Caveats](#caveats)
- [FAQ](#faq)
- [Changelog](#changelog)
- [Feedback](#feedback)
- [License](#license)

## Demo
Use this [Expo snack](https://snack.expo.io/@vitalets/extended-stylesheet-simple) to play with Extended StyleSheets
right in the browser or in [Expo app](https://expo.io/tools#client).

## Installation
```
npm i react-native-extended-stylesheet --save
```

## Usage
1. Define styles using `EStyleSheet.create()` instead of `StyleSheet.create()`:

  ```js
  /* component.js */
  import EStyleSheet from 'react-native-extended-stylesheet';
  
  // define extended styles 
  const styles = EStyleSheet.create({
    column: {
      width: '80%'                                    // 80% of screen width
    },
    text: {
      color: '$textColor',                            // global variable $textColor
      fontSize: '1.5rem'                              // relative REM unit
    },
    '@media (min-width: 350) and (max-width: 500)': { // media queries
      text: {
        fontSize: '2rem',
      }
    }
  });
  
  // use styles as usual
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

2. In app entry point call `EStyleSheet.build()` to actually calculate styles:

  ```js
  /* app.js */
  import EStyleSheet from 'react-native-extended-stylesheet';
  
  EStyleSheet.build({ // always call EStyleSheet.build() even if you don't use global variables!
    $textColor: '#0275d8'
  });
  ```  
  
\[[top](#react-native-extended-stylesheet)\]

## Features
### Global variables
Global variables are passed to `EStyleSheet.build()` and available in all stylesheets.
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

// global variable as inline style or as props to components
<View style = {{
  backgroundColor: EStyleSheet.value('$textColor')
}}>
...
</View>
```
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

### Theming
Changing app theme contains two steps:
1. re-build app styles
2. re-render components tree with new styles

To re-build app styles you can call `EStyleSheet.build()` with new set of global variables:
```js
EStyleSheet.build({
  $theme: 'light',  // required variable for caching!
  $bgColor: 'white',
});
```
> Please note that special variable **`$theme` is required** for proper caching of calculated styles.

Re-rendering whole component tree is currently a bit tricky in React.  
One option is to wrap app into component and re-mount it on theme change:
```js
  toggleTheme() {
    const theme = EStyleSheet.value('$theme') === 'light' ? darkTheme : lightTheme;
    EStyleSheet.build(theme);
    this.setState({render: false}, () => this.setState({render: true}));
  }
  render() {
    return this.state.render ? <App/> : null;
  }
```
The caveat is that all components loss their state. 
In the future it may be possible with `forceDeepUpdate()` method (see [facebook/react#7759](https://github.com/facebook/react/issues/7759)).  
The approach is open for discusison, feel free to share your ideas in [#22](https://github.com/vitalets/react-native-extended-stylesheet/issues/22), 
[#47](https://github.com/vitalets/react-native-extended-stylesheet/issues/47).

You can check out full theming code in [examples/theming](examples/theming) or in [Expo snack](https://snack.expo.io/@vitalets/dynamic-themes-with-extended-stylesheets).  
\[[top](#react-native-extended-stylesheet)\]

### Media queries
Media queries allows to have different styles for different screens, platform, direction and orientation.
They are supported as properties with `@media` prefix (thanks for idea to [@grabbou](https://github.com/grabbou),
[#5](https://github.com/vitalets/react-native-extended-stylesheet/issues/5)).

Media queries can operate with the following values:

* media type: `ios|android`
* `width`, `min-width`, `max-width`
* `height`, `min-height`, `max-height`
* `orientation` (`landscape|portrait`)
* `aspect-ratio`
* `direction` (`ltr|rtl`)

You can use media queries on:
* global level
* sheet level
* style level

Examples:
```js
// global level
EStyleSheet.build({
  '@media ios': {
    $fontSize: 12,
  },
  '@media android': {
    $fontSize: 16,
  },
});

// sheet level
const styles = EStyleSheet.create({
  column: {
    width: '80%',
  },
  '@media (min-width: 350) and (max-width: 500)': {
    column: {
      width: '90%',
    }
  }
});

// style level
const styles = EStyleSheet.create({
  header: {
    '@media ios': {
      color: 'green',
    },
    '@media android': {
      color: 'blue',
    },
  }
});
```
You can check out full example code in [examples/media-queries](examples/media-queries) or in [Expo snack](https://snack.expo.io/@gbhasha/media-queries-using-extended-stylesheets).  
\[[top](#react-native-extended-stylesheet)\]

### Math operations
Any value can contain **one** of following math operations: `*`, `/`, `+`, `-`. Operands can be numbers, variables and percents.  
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
  $rem: width > 340 ? 18 : 16
});
```
You can check out full example code in [examples/rem](examples/rem) or in [Expo snack](https://snack.expo.io/@gbhasha/using-rem-units-with-extended-stylesheet).  
\[[top](#react-native-extended-stylesheet)\]

### Percents
Percent values are supported natively since React Native 0.43.
EStyleSheet passes them through to original StyleSheet except cases, when you use calculations with percents,
e.g. `"100% - 20"`. Percents are calculated relative to **screen width/height** on application launch.
```js
const styles = EStyleSheet.create({
  column: {
    width: '100% - 20'
  }
});
```

**Percents in nested components**  
If you need sub-component with percent operations relative to parent component - you can achieve that with variables.  
For example, to render 2 sub-columns with 30%/70% width of parent column:
```js
render() {
  return (
    <View style={styles.column}>
      <View style={styles.subColumnLeft}></View>
      <View style={styles.subColumnRight}></View>
    </View>
  );
}

...

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
```
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
    backgroundColor: () => Color('green').darken(0.1).hexString() // <-- value as a function
  }
});

render() {
  return (
    <TouchableHighlight style={styles.button}>
      ...
    </TouchableHighlight>
  );
}
```

The common pattern is to use [EStyleSheet.value()](#value) inside the function to get access to global variables:
```js

EStyleSheet.build({
  $prmaryColor: 'green'
});

const styles = EStyleSheet.create({
  button: {
    backgroundColor: () => Color(EStyleSheet.value('$prmaryColor')).darken(0.1).hexString()
  }
});
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
To avoid creating styles on every render you can use [lodash.memoize](https://www.npmjs.com/package/lodash.memoize): 
store result for particular parameters and returns it from cache when called with the same parameters. 
Updated example:
```js
import memoize from 'lodash.memoize';

let getStyle = memoize(function (scale = 1) {
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
It is possible to outline all components that are using EStyleSheet. For that set global `$outline` variable:
```js
EStyleSheet.build({$outline: 1});
```
> Note that components without styles will not be outlined, 
because RN [does not support](https://github.com/facebook/react-native/issues/1768) default component styling yet.

To outline particular component set local `$outline` variable:
```js
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

### Hot module reload
[Hot module reload (HMR)](https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html) 
allows you to change code and see live updates without loosing app state. It is very handy for tuning styles. 
EStyleSheet supports HMR with the following options:

1. When you change style of component - the component is updated by HMR automatically without any effort from your side. 
2. When you change global variable or theme - you should use [HMR API](https://facebook.github.io/react-native/releases/next/#hmr-api) 
   to force style re-calculation:
    ```js
    // app.js
    EStyleSheet.build({
      $fontColor: 'black'
    });
    
    ...
    
    module.hot.accept(() => {
      EStyleSheet.clearCache();
      EStyleSheet.build(); // force style re-calculation
    });
    ```
See full example of HMR [here](examples/hmr).  
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
 * Calculates particular expression.
 *
 * @param {*} value
 * @param {String} [prop] property for which value is calculated. For example, to calculate percent values 
 * the function should know is it 'width' or 'height' to use proper reference value.
 * @returns {*} calculated result
 */
 value (value, prop) {...}
```
**Please note** that in most cases `EStyleSheet.value()` should be used inside function, not directly:
```js
const styles = EStyleSheet.create({
    button1: {
        width: () => EStyleSheet.value('$contentWidth') + 10 // <-- Correct!
    },
    button2: {
        width: EStyleSheet.value('$contentWidth') + 10 // <-- Incorrect. Because EStyleSheet.build() may occur later and $contentWidth will be undefined at this moment.
    }
});
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
 * Subscribe to event. Currently only 'build' event is supported.
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

### .unsubscribe()
```js
/**
 * Unsubscribe from event. Currently only 'build' event is supported.
 *
 * @param {String} event
 * @param {Function} listener
 */
 unsubscribe (event, listener) {...}

```
Unsubscribe from event.
\[[top](#react-native-extended-stylesheet)\]

## Caveats
1. **Dynamic theme change is possible only with loosing components local state**    
   When theme styles are re-calculated - all components should be re-rendered.
   Currently it can be done via re-mounting components tree, please see [#47].
   > Note: it is not issue if you are using state container like [Redux](https://github.com/reactjs/redux) 
   and can easily re-render app in the same state

2. **Dynamic orientation change is not supported**  
   Please see [#9] for more details.
   
3. **Old RN versions (< 0.43) can crash the app with percent values**  
   RN >= 0.43 supports percent values natively ([#32]) and EStyleSheet since 0.5.0 just proxy percent values to RN as is ([#77]) to keep things simple.
   Older RN versions (< 0.43) can't process percents and EStyleSheet process such values.
   So if you are using RN < 0.43, you should stick to EStyleSheet@0.4.0.

## FAQ
1. **I'm getting error: `"Unresolved variable: ..."`**
   - Ensure that you call `EStyleSheet.build()` in entry point of your app.
   - Ensure that `$variable` name without typos.
   - Ensure that you are not using `EStyleSheet.value()` before the styles are built. See [#50](https://github.com/vitalets/react-native-extended-stylesheet/issues/50) for details.
 
## Changelog
Please see [CHANGELOG.md](CHANGELOG.md)

## Feedback
If you have any ideas or something goes wrong feel free to 
[open new issue](https://github.com/vitalets/react-native-extended-stylesheet/issues/new).

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

\[[top](#react-native-extended-stylesheet)\]

<div align="center">
* * *<br>
<i>If you love :heart: JavaScript and would like to track new trending repositories, <br>
have a look on <a href="https://github.com/vitalets/github-trending-repos">vitalets/github-trending-repos</a>.</i>
</div>

[#9]: https://github.com/vitalets/react-native-extended-stylesheet/issues/9
[#16]: https://github.com/vitalets/react-native-extended-stylesheet/issues/16
[#47]: https://github.com/vitalets/react-native-extended-stylesheet/issues/47
[#32]: https://github.com/vitalets/react-native-extended-stylesheet/issues/32
[#77]: https://github.com/vitalets/react-native-extended-stylesheet/issues/77
