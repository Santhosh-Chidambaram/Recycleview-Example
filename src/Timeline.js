import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import VideoListView from './VideoList'

const Timeline = () => {

    return (
        <View style={{flex:1}}>
            <StatusBar />
            <VideoListView />
        </View>
    )
}

export default Timeline

const styles = StyleSheet.create({})

