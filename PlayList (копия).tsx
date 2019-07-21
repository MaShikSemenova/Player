import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { element } from 'prop-types';
import { Song } from './Song';

export class PlayList extends Component {
    componentDidMount() {
       fetch('http://api.deezer.com/chart')
       .then((response) => response.json())
       .then((responseJson) => {
         console.log(responseJson.tracks)
         const arr = Object.values(responseJson.tracks.data);
         arr.forEach(element =>{
            console.log("element");
            let song = new Song(element);
             console.log(song);})
       })
       .catch((error) => {
         console.error(error);
       });
    }
    renderItem = ({item,index}) =>(
        <View style={styles.card} flexDirection='row'>
          <Image source ={{uri : item.album.cover }}  style={styles.image}/>
          <Text>{index+1}. </Text>
          <Text>{item.key}</Text>
        </View>
      )
      render () {
      return (
        <View style={styles.container}>
          <Text style={styles.tstyle}>Музыкальный плеер (версия 1.0)</Text>
          <View style={styles.wstyle}>
          <TouchableOpacity style={styles.bstyle}>
            <Image source={require('./assets/prev.jpg')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bstyle}>
            <Image source={require('./assets/play.png')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bstyle}>
            <Image source={require('./assets/next.jpg')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          </View>
          <FlatList data={[{key: 'a'}, {key: 'b'}, {key: 'w'}, {key: 'r'}]} renderItem={this.renderItem}/>
        </View>
      );
    }
}
    
    const styles = StyleSheet.create({
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
       // backgroundColor: '#fff',  
        margin: 10,
      },
      wstyle: {
        flexDirection: 'row',
      },
      card: {
        padding: 10,
        margin: 10,
        borderColor: '#ff7a00',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#f3ea68',
        flex: 1,
        },
        image: {
          height: 120,
          width: 120,
          borderColor: '#00ff7a',
          borderWidth: 1,
          borderRadius: 20,
          },
    });
    

