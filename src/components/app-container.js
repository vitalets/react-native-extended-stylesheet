/*
 * Container to wrap whole app for observing orientation change / layout change.
 * Listens `onLayout` event and updates layout.
 */

import React from 'react';
import {View} from 'react-native';
import builder from '../builder';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      hasLayout: false,
    };
  }
  render() {
    return (
      <View style={{flex: 1}} onLayout={this.onLayout.bind(this)}>
        {this.state.isLayoutInitialized ? this.props.children : null}
      </View>
    );
  }
  onLayout(e) {
    builder.setLayout(e.nativeEvent.layout);
    // for the first time re-render app container with children
    if (!this.state.hasLayout) {
      this.setState({hasLayout: true});
    }
  }
}
