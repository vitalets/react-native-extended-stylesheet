import React from 'react';
import EStyleSheet, {AppContainer} from '../../src';
import MyComponent from './component';

EStyleSheet.build({
  layoutMarginTop: 25
});

export default class extends React.Component {
  render() {
    return (
      <AppContainer>
        <MyComponent/>
      </AppContainer>
    );
  }
}
