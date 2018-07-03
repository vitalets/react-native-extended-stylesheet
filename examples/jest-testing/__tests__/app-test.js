import React from 'react';
import App from '../App';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<App/>).toJSON();
  expect(tree).toMatchSnapshot();
});

/*

// Instead of creating __mocks__ you can build style for particular test in beforeAll hook:

import EStyleSheet from 'react-native-extended-stylesheet';

beforeAll(() => {
  EStyleSheet.build({
    $fontColor: '#F5FCFF',
  });
});

*/
