import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { element } from 'prop-types';
import { Song } from './Song';
//import Video from 'react-native-video';
import { Audio } from 'expo-av';

const soundObject = new Audio.Sound(); //можно ли так делать!??? Спросить Оксану!)


interface S { listSong?:Song } 

export class PlayList extends Component<S> {
    constructor(props){
      super(props);
      this.state = {
        isLoading: true, 
        listSong:[], 
        isPlaying: false, 
        selectedItem: 'null',
        selected: (new Map(): Map <string, boolean>),
      };
    }
    
    onPressAction = (key: string) => {
      this.setState((state) => {
        //create new Map object, maintaining state immutability
        const selected = new Map(state.selected);
        //remove key if selected, add key if not selected
        this.state.selected.has(key) ? selected.delete(key, !selected.get(key)) : selected.set(key, !selected.get(key));
        console.log("!!!!", selected);
        return {selected};
      });
    }

    onPress = () => {
      let t = this.state.isPlaying;
      this.setState({isPlaying: !t});
 //     this.playSound(!t);   /////////////////////
    }
    onPressFlatlist = (rowItem) => {
      console.log('ListItem was selected');
      console.dir(rowItem);
      this.setState({selectedItem: rowItem.id.value});
      //  this.state.listSong.index;
      console.log("!!!!", rowItem.id.value);
    }

    loadSound = async() =>{        //параметры??? // путь к файлу way (this.state.listSong[7].preview)!!!
      try {
        if (soundObject._loaded == false) {
          console.log("1", soundObject._loaded);
          await soundObject.loadAsync(require('./assets/sounds/hello.mp3'), { shouldPlay: false }, downloadFirst = true); //{uri: this.state.listSong[2].preview}
        }
        else {
          console.log("2", soundObject._loaded);
          await soundObject.unloadAsync();
          console.log("3", soundObject._loaded);
          await soundObject.loadAsync(require('./assets/sounds/hello.mp3'), { shouldPlay: false }, downloadFirst = true); //{uri: this.state.listSong[2].preview}
          console.log("4", soundObject._loaded);
        }
      } catch (error) {
          console.log("5 Что за нафиг", error);
      };
    }
    
    playSound = async(isPlaying) => {      // путь к файлу way (this.state.listSong[7].preview), нажат ли плей isPlaying (this.state.isPlaying)
          try {
            if (isPlaying == true){
              await soundObject.playAsync();
            }
            else {
              await soundObject.pauseAsync();
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
      this.loadSound(); 
   }
   
   renderRow = (item) => {
      <RowItem
        item={item}
        onPressItem={this.onPressAction}
        selected={!!this.state.selected.get(item.key)} />
    }
   
    /* renderRow = ({item,index}) =>(
      
      <View>
        <TouchableOpacity style={styles.touchFlat} onPress={() => this.onPressFlatlist(item)}>
          <Image source ={{uri : item.picture }}  style={styles.image}/>
          <View style={styles.qqq}>
            <Text style={styles.id}>{index+1}. {item.title}</Text>
            <Text style={styles.title}>Исполнитель: {item.artist}</Text>
          </View>
        </TouchableOpacity>   
      </View>
      ) */
      render() {
        if(this.state.isLoading){
          return(
            <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
            </View>
        )}
      this.playSound(this.state.isPlaying);   /////////////////////пусть побудет здесь
      
      return (
        console.log("Нажали"),
        console.log(this.state.isPlaying),
        //console.log("hhh", soundObject.getStatusAsync()),
       // console.log(video),
       // console.log(this.state),
        <View style={styles.container}>
          <Text style={styles.tstyle}>Музыкальный плеер (версия 1.0)</Text>
          <View style={styles.wstyle}>
          <TouchableOpacity style={styles.bstyle}>
            <Image source={require('./assets/prev.png')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bstyleP} onPress={this.onPress}>
            <Image  source={this.state.isPlaying === true ? require('./assets/pause.png'): require('./assets/play.png')} style={{width: 100, height: 100}} ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bstyle}>
            <Image source={require('./assets/next.png')} style={{width: 70, height: 70}} ></Image>
          </TouchableOpacity>
          </View>
          <FlatList 
            data={this.state.listSong} 
            renderItem={({ item }) => (this.renderRow(item))} 
            keyExtractor={item => item.id.toString()}
          />  
          
        
        </View>
        
        //<Video source={{uri: "http://cdn-preview-b.deezer.com/stream/c-be6c763188230b2bdd6c97ec5badb09e-4.mp3"}} paused='false'/>  
      );
    }
}

class RowItem extends Component {
  render(){
    //render styles and components conditionally using this.props.selected ? _ : _
    
    return (
      <TouchableOpacity style={styles.touchFlat} onPress={this.props.onPressItem(this.props.id)}>
      <Image source ={{uri : item.picture }}  style={styles.image}/>
      <View style={styles.qqq}>
        <Text style={styles.id}>{index+1}. {item.title}</Text>
        <Text style={styles.title}>Исполнитель: {item.artist}</Text>
      </View>
    </TouchableOpacity>  
    )
  }
}
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#5ff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
      },
      tstyle: {
        fontSize: 20,
        fontStyle: 'italic',
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
      card: {
        padding: 10,
        margin: 10,
        borderColor: '#ff7a00',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#f3ea68',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
        },
      image: {
        height: 120,
        width: 120,
        borderColor: '#00ff7a',
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 20,
      },
      title: {
        fontSize: 15,
        color: '#707070',
        textAlign: 'left'
      },
      id: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      qqq: {
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
      borderColor: '#ff7a00',
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: '#f3ea68',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flexWrap: 'wrap'
    },
    });
    


