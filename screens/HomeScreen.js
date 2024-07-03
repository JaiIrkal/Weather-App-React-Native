import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../styles/colors'
import { Avatar } from 'react-native-paper'

const HomeScreen = () => {

    const [showSearch, toggleSearch] = useState(false)
    const [location, setLocation] = useState([1, 2, 3])

    const handleLocation = (loc) => {
        console.log(loc)
    }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        {
            showSearch?<TextInput placeholder='Search City' style={styles.searchTf}/>:
            <Text style={styles.headerTxt}>WeatherWhiz</Text>
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
        {
            location.length>0 && showSearch?(
                <View style={styles.optionContainer}>
                    {
                        location.map((loc, index) => (
                            <TouchableOpacity 
                                style={styles.option} 
                                activeOpacity={0.7}
                                key={index}
                                onPress={()=> handleLocation(loc)}
                            >
                                <Avatar.Icon 
                                    icon={'map-marker'} 
                                    size={50} 
                                    style={{backgroundColor:'transparent'}}
                                    color='black'
                                />
                                <Text style={{
                                    fontWeight:'700',
                                    fontSize:18
                                }}>London, UK</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            ):null
        }
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    option:{
        backgroundColor:colors.lightGrey,
        margin:2,
        padding:8,
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center'
    },
    optionContainer:{
        width:'86%',
        position:'absolute',
        top:96,
        left:22,
        flexDirection:'column',
    },
    headerTxt:{
        fontSize:35,
        fontWeight:'700',
        color:'white'
    },
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