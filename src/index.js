/**
 * Extended StyleSheet API
 */

import {Dimensions} from 'react-native';
import child from './pseudo/child';
import Value from './value';
import globalVars from './global-vars';
import Builder from './builder';
import mixin from './components/mixin';
import utils from './utils';
import layout from './layout';

const builder = new Builder();

export default {
  build: builder.build.bind(builder),
  create: builder.create.bind(builder),
  value,
  child,
  mixin,
  memoize: utils.memoize,
  get layout() { return layout; },
  setLayout,
  subscribe,
};
export {default as AppContainer} from './components/app-container';

function value(expr, prop) {
  return new Value(expr, prop, [globalVars.get()]).calc();
}

function setLayout(l) {
  builder.setLayout(l || Dimensions.get('window'));
}

/**
 * @deprecated
 */
function subscribe(event, listener) {
  if (event === 'build') {
    builder.onBuild.addListener(listener);
  }
}
