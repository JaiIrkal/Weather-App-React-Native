import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../styles/colors'
import { Avatar } from 'react-native-paper'
import debounce from 'lodash/debounce';
import { fetchLocation, fetchWeatherForecast } from '../api/weather';
import { weatherImages } from '../api/constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';

const HomeScreen = () => {

    const [showSearch, toggleSearch] = useState(false)
    const [location, setLocation] = useState([])
    const [weather, setWeather] = useState({})
    const [currWeather, setCurrWeather] = useState({})
    const [currLocation, setCurrLocation] = useState([])
    const [loading, setLoading] = useState(false)

    const handleLocation = (loc) => {
        // console.log(loc)
        setLocation([])
        toggleSearch(false)
        setLoading(true)
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data)
            setCurrLocation(data.location)
            setCurrWeather(data.current)
            // console.log('Got weather data: ', data)
            setLoading(false)
            storeData('city', loc.name)
        })
    }

    const handleSearch = value => {
        if (value.length > 2) {
            fetchLocation({ cityName: value }).then(data => {
                setLocation(data)
            })
        }
    }

    useEffect(() => {
        fetchMyWeatherData()
    }, [])

    const fetchMyWeatherData = async () => {
        let myCity = await getData('city')
        let cityName = 'Hubli'

        if(myCity) cityName = myCity
        setLoading(true)
        fetchWeatherForecast({
            cityName: cityName,
            days: '7'
        }).then(data => {
            setLocation(data.location)
            setWeather(data)
            setCurrLocation(data.location)
            setCurrWeather(data.current)
            setLoading(false)
        })
    }

    const handleTextBounce = useCallback(debounce(handleSearch, 1200), [handleSearch])

    return (
        <View style={styles.mainContainer}>
            {
                loading ? <View style={styles.loaderView}>
                    <Image source={require('../assets/cloudy-sun.png')} style={styles.loaderImg}/>
                    <Text style={styles.loaderText}>Loading...</Text>
                </View> :
                    <>
                        <View style={styles.searchContainer}>
                            {
                                showSearch ?
                                    <TextInput
                                        placeholder='Search City'
                                        style={styles.searchTf}
                                        onChangeText={handleTextBounce}
                                    /> :
                                    <Text style={styles.headerTxt}>WeatherWhiz</Text>
                            }
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.searchIconContainer}
                                onPress={() => {
                                    toggleSearch(!showSearch)
                                }}
                            >
                                <Avatar.Icon
                                    icon={'magnify'}
                                    size={50}
                                    style={{ backgroundColor: 'transparent' }}
                                    color='black'
                                />
                            </TouchableOpacity>
                        </View>
                        {
                            location.length > 0 && showSearch ? (
                                <View style={styles.optionContainer}>
                                    {
                                        location.map((loc, index) => (
                                            <TouchableOpacity
                                                style={styles.option}
                                                activeOpacity={0.7}
                                                key={index}
                                                onPress={() => handleLocation(loc)}
                                            >
                                                <Avatar.Icon
                                                    icon={'map-marker'}
                                                    size={50}
                                                    style={{ backgroundColor: 'transparent' }}
                                                    color='black'
                                                />
                                                <Text style={{
                                                    fontWeight: '700',
                                                    fontSize: 16,
                                                }}>{loc?.name}, {loc?.country}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            ) : null
                        }
                        {/* Forecast Section */}
                        <View style={styles.forecastView}>
                            <View>
                                <Text style={styles.forecastCityName}>
                                    {currLocation?.name}
                                </Text>
                                <Text style={styles.forecastCountryName}>{currLocation?.country}</Text>
                            </View>
                            <View style={styles.imageView}>
                                <Image source={weatherImages[currWeather?.condition?.text]} style={styles.img} />
                            </View>
                            <View>
                                <Text style={styles.temperature}>{currWeather?.temp_c}&#176;</Text>
                            </View>
                            <View>
                                <Text style={styles.condition}>{currWeather?.condition?.text}</Text>
                            </View>
                            <View style={styles.cardContainer}>
                                <View style={styles.card}>
                                    <Image source={require('../assets/wind.png')} style={styles.cardImg} />
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '700',
                                        fontSize: 16
                                    }}>{currWeather?.wind_kph}Km</Text>
                                </View>
                                <View style={styles.card}>
                                    <Image source={require('../assets/drop.png')} style={styles.cardImg} />
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '700',
                                        fontSize: 16
                                    }}>{currWeather?.humidity}%</Text>
                                </View>
                                <View style={styles.card}>
                                    <Image source={require('../assets/sunrise.png')} style={styles.cardImg} />
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '700',
                                        fontSize: 16
                                    }}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.dailyForecast}>
                            <View style={styles.dailyForecastHead}>
                                <Image source={require('../assets/calender.png')} style={styles.calenderIcon} />
                                <Text style={{
                                    color: 'white'
                                }}>Daily Forecast</Text>
                            </View>
                            <ScrollView
                                horizontal
                                contentContainerStyle={{ paddingHorizontal: 10 }}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    weather?.forecast?.forecastday.map((item, index) => {
                                        let date = new Date(item.date)
                                        let options = { weekday: 'long' }
                                        let dayName = date.toLocaleDateString('en-US', options)
                                        dayName = dayName.split(',')[0]
                                        return (
                                            <View style={styles.dailyForecastCard} key={index}>
                                                <Image source={weatherImages[item?.day?.condition?.text]} style={styles.dailyForecastCardImg} />
                                                <Text style={{
                                                    fontWeight: '700',
                                                }}>{dayName}</Text>
                                                <Text style={{
                                                    fontWeight: '500'
                                                }}>{item?.day?.avgtemp_c}&#176;</Text>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </>
            }
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    loaderImg:{
        height:180,
        width:180,
        alignSelf:'center'
    },
    loaderText:{
        fontSize:30,
        fontWeight:'700',
        textAlign:'center',
        color:colors.yellow
    },
    loaderView:{
        flex:1,
        justifyContent:'center'
    },
    dailyForecastCardImg: {
        height: 50,
        width: 50
    },
    dailyForecastCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        height: 110,
        justifyContent: 'center',
        margin: 10
    },
    dailyForecastHead: {
        marginBottom: 2,
        // paddingHorizontal:20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: '85%'
    },
    dailyForecast: {
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    calenderIcon: {
        height: 40,
        width: 40
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 10,
        margin: 13,
        width: 100,
    },
    cardContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-evenly',
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginLeft: 10
    },
    cardImg: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        marginBottom: 10
    },
    condition: {
        fontSize: 24,
        color: 'white',
        fontWeight: '700',
        textAlign: 'center'
    },
    temperature: {
        fontSize: 44,
        color: 'white',
        fontWeight: '700'
    },
    img: {
        height: 120,
        width: 130
    },
    imageView: {
        justifyContent: 'center',
        marginTop: 40,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    forecastCountryName: {
        color: colors.lightGrey,
        fontSize: 18,
        textAlign: 'center'
    },
    forecastCityName: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center'
    },
    forecastView: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 40,
        flexDirection: 'column',
        justifyContent: 'space-around',
        zIndex: -1
    },
    option: {
        backgroundColor: colors.lightGrey,
        margin: 2,
        padding: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap:'wrap'
    },
    optionContainer: {
        width: '86%',
        position: 'absolute',
        top: 96,
        left: 22,
        flexDirection: 'column',
    },
    headerTxt: {
        fontSize: 35,
        fontWeight: '700',
        color: 'white'
    },
    searchIconContainer: {
        justifyContent: 'center',
        backgroundColor: colors.yellow,
        borderRadius: 10
    },
    searchTf: {
        height: 50,
        width: '70%',
        backgroundColor: 'white',
        alignSelf: 'center',
        padding: 15,
        borderRadius: 20
    },
    searchContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: colors.cobaltBlue,
        paddingTop: Platform.OS === 'android' ? 20 : 0
    }
})