/**
 * Type definition tests.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import EStyleSheet from '..';

const eStyles = EStyleSheet.create({
    $var: 10,
    button1: {
        width: () => '100%',
        // todo: fix it
        // @ts-ignore
        '@media (min-width: 350)': {
            width: '$var'
        }
    },
    '@media ios': {
        button2: {
            width: '100%',
        }
    }
});

const styles = StyleSheet.create({
    button1: {
        ...EStyleSheet.absoluteFillObject,
        color: 'red'
    },
    button2: {
        color: 'blue',
        borderBottomWidth: EStyleSheet.hairlineWidth,
    }
});

EStyleSheet.build();
EStyleSheet.build({$var: 'foo'});
EStyleSheet.value('100%');
EStyleSheet.value('100%', 'width');
EStyleSheet.subscribe('build', () => {});
EStyleSheet.clearCache();
EStyleSheet.flatten([eStyles.button1, eStyles.button2, EStyleSheet.absoluteFill]);
EStyleSheet.flatten(styles.button1);
EStyleSheet.flatten([styles.button1, styles.button2]);
EStyleSheet.setStyleAttributePreprocessor('color', () => 'red');
React.createElement(View, { style: eStyles.button1 })
