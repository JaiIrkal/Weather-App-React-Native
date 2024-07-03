import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../styles/colors'
import { Avatar } from 'react-native-paper'

const HomeScreen = () => {

    const [showSearch, toggleSearch] = useState(false)

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        {
            showSearch?<TextInput placeholder='Search City' style={styles.searchTf}/>:
            null
        }
        <TouchableOpacity 
            activeOpacity={0.6} 
            style={styles.searchIconContainer}
            onPress={()=>{
                toggleSearch(!showSearch)
            }}
        >
            <Avatar.Icon 
                icon={'magnify'} 
                size={50} 
                style={{backgroundColor:'transparent'}}
                color='black'
            />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    searchIconContainer:{
        justifyContent:'center',
        backgroundColor:colors.yellow,
        borderRadius:10
    },
    searchTf:{
        height:50,
        width:'70%',
        backgroundColor:'white',
        alignSelf:'center',
        padding:15,
        borderRadius:20
    },
    searchContainer:{
        marginTop:20,
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    mainContainer:{
        flex:1,
        backgroundColor:colors.cobaltBlue,
        paddingTop:Platform.OS === 'android'?20:0
    }
})