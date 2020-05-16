/**
 * Type definition tests.
 */

import {StyleSheet} from 'react-native';
import EStyleSheet, {MediaQuery} from '..';

const eStyles = EStyleSheet.create({
    $var: 10,
    button1: {
        width: () => '100%',
        height: 40,
       '@media (min-width: 350)': {
           width: '$var'
        } as MediaQuery
    },
    button2: {
        width: 200
    },
    '@media ios': {
        button3: {
            width: '100%'
        }
    } as MediaQuery,
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
const x = EStyleSheet.absoluteFill;
EStyleSheet.flatten(eStyles.button1);
EStyleSheet.flatten([eStyles.button1, eStyles.button2]);
EStyleSheet.flatten(styles.button1);
EStyleSheet.flatten([styles.button1, styles.button2]);
EStyleSheet.setStyleAttributePreprocessor('color', () => 'red');
