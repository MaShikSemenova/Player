import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { PlayList } from './PlayList';


export default function App() {

  return (
    <PlayList></PlayList>
  );

}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5ff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    
  },
  tstyle: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold', 
  },
  bstyle: {
    height: 70,
    width: 70,
    backgroundColor: '#fff',  
    margin: 10,
  },
  wstyle: {
    flexDirection: 'row',
  }
}); */
