import React from 'react';
import { StyleSheet, View } from 'react-native';

// functional component
const Card = ((props) =>
  <View style={styles.viewStyle}>
    { props.children }
  </View>
);

export default Card;

const styles = StyleSheet.create({
  viewStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#DDDDDD',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }
});
