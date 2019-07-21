import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { element, array } from 'prop-types';
import { Song } from './Song';
import { Audio } from 'expo-av';


//interface S { listSong:Song} 

export class PlayList extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true, 
      listSong:[], 
      isPlaying: false, 
      selectedItem: 'null',
    };
    this.soundObject = new Audio.Sound()
  }
  soundObject;// 
  onPressPrev = () => {
    const prevIndex = (this.state.selecteItem==0? 9 : this.state.selecteItem-1)
    this.setState({selecteItem: prevIndex});
    this.setState({isPlaying: true});
    this.loadSound(this.state.listSong[prevIndex].preview)
  }

  onPressNext = () => {
    const nextIndex = (this.state.selecteItem==9? 0 : this.state.selecteItem+1)
    this.setState({selecteItem: nextIndex});
    this.setState({isPlaying: true});
    this.loadSound(this.state.listSong[nextIndex].preview)
  }

  onPressPlay = () => {
    this.setState({isPlaying: !this.state.isPlaying});
  }
  
  loadSound = async(urlToTrack) =>{        //параметры: путь к файлу way (this.state.listSong[7].preview)!!!
    try {
      if (this.soundObject._loaded == false) {
        await this.soundObject.loadAsync({uri: urlToTrack}, { shouldPlay: true }, downloadFirst = true); 
      }
      else {
        await this.soundObject.unloadAsync();
        await this.soundObject.loadAsync({uri: urlToTrack}, { shouldPlay: true }, downloadFirst = true); 
      }
    } catch (error) {
        console.log("loadSound error: ", error);
      };
  }
    
  onPressFlatList = (item, index) => {
    this.loadSound(item.preview);
    this.setState({isPlaying: true});
    this.setState({selecteItem: index});
  }
  
  playSound = async(isPlaying) => {      //  нажат ли плей isPlaying (this.state.isPlaying)
    try {
      if (isPlaying == true){
        await this.soundObject.playAsync();
      }
      else {
        await this.soundObject.pauseAsync();
      }
    } catch (error) {
      console.log("playSound error: ", error);
    };
  }

  componentDidMount() {
    fetch('http://api.deezer.com/chart')
    .then((response) => response.json())
    .then((responseJson) => {
      const songs = [];
      const arr = Object.values(responseJson.tracks.data);
      arr.forEach(element =>{
          let song = new Song(element);
           songs.push(song);
        })
        this.setState({isLoading: false, listSong: songs}, function(){});
      })
      .catch((error) => {
        console.error(error);
      });
//      this.loadSound(songs); 
   }

  renderItem = ({item,index}) =>(
      <View>
        <TouchableOpacity style={styles.touchFlat} onPress={() => this.onPressFlatList(item, index)}>
          <Image source ={{uri : item.picture }}  style={styles.image}/>
          <View style={styles.containerText}>
            <Text style={styles.id}>{index+1}. {item.title}</Text>
            <Text style={styles.title}>Исполнитель: {item.artist}</Text>
          </View>
        </TouchableOpacity>   
      </View>
  )
      
  render() {
        if(this.state.isLoading){
          return(
            <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
            </View>
  )}
      this.playSound(this.state.isPlaying);
    
    return (
        console.log("Нажали"),
        console.log(this.state.isPlaying),
//        this.playSound(this.state.isPlaying),
       //console.log("hhh", soundObject.getStatusAsync()),
       // console.log(video),
       // console.log(this.state),
        <View style={styles.container}>
          <Text style={styles.tstyle}>Музыкальный плеер</Text>
          <Text style={styles.tstyle}>(версия 1.0)</Text>
          <View style={styles.wstyle}>
          <TouchableOpacity style={styles.bstyle} onPress={this.onPressPrev}>
            <Image source={require('./assets/prev.png')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bstyleP} onPress={this.onPressPlay}>
            <Image  source={this.state.isPlaying === true ? require('./assets/pause.png'): require('./assets/play.png')} style={{width: 100, height: 100}} ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bstyle} onPress={this.onPressNext}>
            <Image source={require('./assets/next.png')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          </View>
          <FlatList data={this.state.listSong} renderItem={this.renderItem} keyExtractor={item => item.id.toString()}/>  
          
        
        </View>
        
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6495ED',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  tstyle: {
    fontSize: 20,
    fontStyle: 'normal',
    color: '#000080',
    textDecorationLine: 'underline',
    fontWeight: 'bold', 
  },
  bstyle: {
    height: 70,
    width: 70,
    margin: 10,
  },
  bstyleP: {
    height: 100,
    width: 100,
    margin: 10,
  },
  wstyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hstyle: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  image: {
    height: 120,
    width: 120,
    borderColor: '#1E90FF',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 20,
  },
  title: {
    fontSize: 15,
    color: '#4169E1',
    textAlign: 'left'
  },
  id: {
    fontSize: 18,
    color: '#000080',
    textDecorationLine: 'underline',
  },
  containerText: {
    height: 100,
    width: 170,
  },
  audioElement: {
    height: 0,
    width: 0,
  }, 
  touchFlat: {
    padding: 10,
    margin: 10,
    borderColor: '#1E90FF',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#87CEFA',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
});
    

