import React from 'react';
import { Text } from 'react-native';

export default class MonoText extends React.PureComponent {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}
