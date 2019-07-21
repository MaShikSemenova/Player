import React, { Component } from 'react';


export class Song {
    id:String;
    title:String;
    picture:String;
    preview:String;
    artist:String;
    album:String;
    constructor(song){
       this.id = song.id;
       this.title = song.title;
       this.picture = song.album.cover_medium;
       this.preview = song.preview;
       this.artist = song.artist.name;
       this.album = song.album.title;
    
    }
}