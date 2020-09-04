import React, { Component, useEffect, useState } from "react";
import { View, Text, Dimensions,ActivityIndicator } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import Video from 'react-native-video'




const VideoListView = (props) => {
    let { width,height } = Dimensions.get("window");
    const [page,setPage] = useState(0)  
    const [showIndicator,setShowIndicator] = useState(true)
    const [state,setState] = useState({
        dataProvider:[],
        videos:[],
        showList:false
    })

    const fetchVideos  = async() =>{
        console.log("fetch Called")
      try {
        let response = await fetch('https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed',{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                page:page
            })
        })
        let res = await response.json()
        console.log("Response",res)
        setState({
            ...state,
            videos:res,
            dataProvider:new DataProvider((r1, r2) => {
                return r1 !== r2;}).cloneWithRows(res),
            showList:true 
        })
        setTimeout(() =>{
            setShowIndicator(false)
        },3000)

      } catch (error) {
        console.log(error)    
      }
    }

    const getMoreData = async() =>{
        console.log("called")
        try {
            let response = await fetch('https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed',{
                method:'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    page:page+1
                })
            })
            let res = await response.json()
            setPage(page+1)
            setState({
                ...state,
                dataProvider:new DataProvider((r1, r2) => {
                    return r1 !== r2;
                }).cloneWithRows(state.videos.concat(res)),
                videos:state.videos.concat(res),
                showList:true  
            })
            
          } catch (error) {
            console.log(error)    
          }
        }
    
    useEffect(() =>{
        if(state.dataProvider.length === 0){
            fetchVideos()
           
        }
    },[])

       
    const layoutProvider = new LayoutProvider(
            () => 0,
            (type, dim) => {
              dim.width = width;
              dim.height = height;
            },
    );
    
    //Row Renderer For Each Video
    const rowRenderer = (type, data) => {
        return (
            <View style={styles.container}>
                
                <Video 
                source={{uri: data.playbackUrl}}  // Can be a URL or a local file.                             // Store reference 
                rate={1.0}
                volume={1.0}
                isMuted={false}
                onBuffer={data =>{
                    console.log(data)
                }}
                onReadyForDisplay={() => setShowIndicator(false)}
                resizeMode="cover"
                shouldPlay={false}
                useNativeControls={true}
                isLooping
                repeat={true}
                style={{ width: '100%', height: Dimensions.get('screen').height}}
             />

            </View>
        );
    }

    
        return(
            <>
               
            
                {
                    state.showList && !showIndicator?
                    <RecyclerListView 
                    layoutProvider={layoutProvider} 
                    dataProvider={state.dataProvider} 
                    rowRenderer={rowRenderer}
                    onEndReachedThreshold ={20}
                    onEndReached={getMoreData}
                    />
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color="#00ff00" /></View>
                }
            </>
        )
    }

const styles = {
    container: {
        flex: 1,
        backgroundColor:'white',
        height:Dimensions.get('window').height
    },
   
};

export default VideoListView;


