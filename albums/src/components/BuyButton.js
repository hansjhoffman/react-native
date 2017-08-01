import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const BuyButton = ((props) =>
  <TouchableOpacity style={styles.button} onPress={props.action}>
    <Text style={styles.text}>{ props.children }</Text>
  </TouchableOpacity>
);

export default BuyButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginLeft: 5,
    marginRight: 5
  },

  text: {
    alignSelf: 'center',
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 10,
    paddingTop: 10
  }
});
