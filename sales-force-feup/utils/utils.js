import React from 'react'
import {View, Dimensions, StyleSheet, Text, StatusBar, Platform} from 'react-native'

import { SecureStore } from 'expo'

export const ColorTheme = {

    black: '#222629',
    strongGreen: '#61892F',
    lightGreen: '#86C232',
    strongGrey: '#474B4F',
    lightGrey: '#6B6E70',
    lightLightGrey: '#F0F0F0',
    white: 'white',
    red: '#C90A0A',
    green: '#29D12F',
    blue: '#029CBF',
    light2Grey: '#D3D3D3',
    light3Grey: '#F0F0F0',
    lightMediumGrey: '#AAAAAA',
    white: 'white',
    papaya: '#E24E42',
    aqua: '#008F95',
    lemon: '#DCB239',

}

export const Styles = {

    loginSignup: StyleSheet.create({

        mainView: {
            flex: 1,
            backgroundColor: ColorTheme.black,
            alignItems: 'center',
            justifyContent: 'center',
        },

        upperView: {
            flex: 0.8,
            alignItems: 'center',
            justifyContent: 'center',
        },

        bottomView: {
            flex: 1.5,
            alignItems: 'center',
            justifyContent: 'flex-start',
        },

        logo: {
            fontSize: 48,
            color: ColorTheme.white
        },

        textField: {
            fontSize: 18,
            borderBottomWidth: 2,
            borderBottomColor: ColorTheme.lightGrey,
            padding: 10,
            width: Dimensions.get('window').width - 50,
            marginBottom: 10,
            color: ColorTheme.white
        },

        picker: {
            borderBottomWidth: 2,
            borderBottomColor: ColorTheme.lightGrey,
            padding: 10,
            width: Dimensions.get('window').width - 50,
            marginBottom: 10,
            color:ColorTheme.white,
            height:20
        },

        loginButton: {
            marginTop: 10,
            color: ColorTheme.strongGreen
        },

        buttonView: {
            marginTop: 10,
            marginBottom: 10
        },

        button: {
            color: ColorTheme.strongGreen,
            fontSize: 22
        },

        warningsView: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: Dimensions.get('window').width - 50
        },

        warnings: {
            color: 'red'
        }

    }),

    newOpportunity: StyleSheet.create({

        mainView: {
            flex: 1,
            backgroundColor: ColorTheme.white,
            alignItems: 'center',
            justifyContent: 'center',
        },

        bottomView: {
 
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10

        },

        textField: {
            fontSize: 18,
            borderBottomWidth: 2,
            borderBottomColor: ColorTheme.lightGrey,
            padding: 10,
            width: Dimensions.get('window').width - 50,
            marginBottom: 10,
            color:ColorTheme.black
        },

        button: {
            color: ColorTheme.strongGreen,
            fontSize: 22
        },

        warningsView: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: Dimensions.get('window').width - 50
        },

        warnings: {
            color: 'red'
        },
        
        androidDateButton: {
            fontSize: 18, 
            padding: 5
        },

        androidDate: {
            flexDirection: 'row', 
            justifyContent:'center', 
            alignItems: 'center'
        },

        productsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: ColorTheme.lightGrey,
            borderBottomWidth: 2
        },

        productsTitle: {
            fontSize: 18, 
            paddingLeft: 10, 
            color:ColorTheme.strongGrey
        },

        selectProductsView: {
            position:'absolute',
            top:0,
            flex:1,
            backgroundColor: ColorTheme.lightLightGrey,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        },

        totalView: {
            marginTop: 10,
            paddingLeft: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }

    }),

    tasks: StyleSheet.create({

        mainView: {
            flex: 1,
            backgroundColor: ColorTheme.white
        },

        item: {
            paddingTop: 12,
            paddingRight: 12,
            paddingBottom: 12,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
    }),

    products: StyleSheet.create({

        mainView: {
            flex: 1,
            backgroundColor: ColorTheme.white
        },

        item: {
            paddingLeft: 10,
            paddingBottom: 15,
            paddingTop: 15,
            paddingRight: 15,
            flexDirection: 'column',
        },
    }),

    


    opportunities: StyleSheet.create({

        mainView: {
            flex: 1,
            backgroundColor: ColorTheme.white
        },

        itemContainer: {
            paddingLeft:6,
            paddingBottom:15,
            paddingTop:15,
            //paddingRight:15,
            flexDirection:'row',
            justifyContent: 'space-between',
        },
    }),

    standard : StyleSheet.create({

        mainView: {
            flex: 1,
            backgroundColor: ColorTheme.white,
            paddingTop: 20,
            paddingLeft: 20,
        },

        textField: {
            fontSize: 18,
            borderBottomWidth: 2,
            borderBottomColor: ColorTheme.black,
            padding: 10,
            width: Dimensions.get('window').width - 50,
            marginBottom: 10,
            color: ColorTheme.white
        },

        picker: {
            padding: 2,
            width: Dimensions.get('window').width,
        },


        button: {
            color: ColorTheme.lightGreen,
            fontSize: 22,
            paddingRight: 10
        },

    }),

    header: StyleSheet.create({

        view: {
            backgroundColor: ColorTheme.strongGrey
        },
        title: {
            color: ColorTheme.white,
            fontSize: 20,
            marginLeft: 15
        },
        back: {
            color: ColorTheme.strongGreen
        }

    }),

    tabBar: StyleSheet.create({
        
        textSelected: {
            color: ColorTheme.strongGreen,
            fontSize: 13
        },
        textNotSelected: {
            color: ColorTheme.strongGrey,
            fontSize: 13
        },
        view: {
            flex: 20,
            alignItems: 'center',
        }
    }),

}

export class Bubble extends React.Component {

    render = () => {

        return (

            <View style={{backgroundColor:this.props.backgroundColor, borderWidth:3, justifyContent:'center', alignItems:'center', height: this.props.size, width: this.props.size, borderRadius: this.props.size/2, borderColor: this.props.color}}>
                <Text style={{textAlign: 'center', fontSize: this.props.fontSize}}>{this.props.text}</Text>
            </View>
        )

    }

}

export class Hr extends React.Component {

    constructor(props) {
        super(props);

        this.color = this.props.color == undefined ? 'black' : this.props.color
        this.offset = this.props.offset == undefined ? 0 : this.props.offset
        this.lineHeight = this.props.lineHeight == undefined ? 1 : this.props.lineHeight


        this.style = StyleSheet.create({

            view: {
                height: this.lineHeight,
                backgroundColor: this.color,
                width: Dimensions.get('window').width,
                marginLeft: this.offset,
            }
        })
    }

    render() {

        return (

            <View style={this.style.view}></View>

        );

    }

}


export const saveLocally = async (values) => {

    try {

        for (let i = 0; i < values.length; i++) {

            await SecureStore.setItemAsync(values[i].key, values[i].value);

        }
        return true
    }

    catch (err) {
        return false
    }

}

export const getLocally = async (keys) => {

    try {

        let result = {}

        for (let i = 0; i < keys.length; i++) {

            const load = await SecureStore.getItemAsync(keys[i]);
            result[keys[i]] = load

        }

        return result

    }

    catch (err) {
        return false
    }

}

export const deleteLocally = async (keys) => {

    try {

        for (let i = 0; i < keys.length; i++) {

            await SecureStore.deleteItemAsync(keys[i]);

        }
        return true
    }

    catch (err) {
        return false
    }

}

export const fetchRequestMethod = {

    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE'

}


export const fetchRequest = (method, url, body, authToken) => {
    const options = {
        method: method,
        headers: {}
    }

    if (method != fetchRequestMethod.GET) {
        options.headers['content-type'] = 'application/json',
            options.body = typeof body === 'object' && body !== null ? JSON.stringify(body) : body
    }

    if (authToken !== null)
        options.headers.Authorization = `Bearer ${authToken}`

    return new Promise((resolve, reject) => {

        const fetchPromise = fetch(url, options)

        fetchPromise.then((response) => {

            if (response.ok) {

                let bodyPromise = response.json();
                bodyPromise.then((responseBody) => {
                    resolve({ status: response.status, body: responseBody })
                }).catch((err) => {

                    resolve({ status: response.status, body: {} })

                })

            }

            else {

                let bodyPromise = response.text();
                    bodyPromise.then((responseText) => {
                        reject({status: response.status, body: {}, error: responseText});
                    }).catch((err) => {
                        reject({status: 500, body: {}, error: err.toString});
                    })

            }

        }).catch((err) => {

            reject({status: 'unknown', body:{}, error: err.toString()})

        })

    })

}

export class DateUtils {

    static convertDateToEpochSecs = date => Math.floor(date.getTime() / 1000);

    static convertEpochSecsToDateStringWithLocale = (seconds, locale) => new Date(seconds * 1000).toLocaleDateString(locale);

    static convertEpochSecsToDateTimeStringLocale = (seconds, locale) => new Date(seconds * 1000).toLocaleString(locale);

    static convertEpochSecsToDateString = seconds => {

        let date = new Date(seconds * 1000);

        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth();
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        return date.getFullYear() + '-' + month + '-' + day;

    }

    static convertEpochSecsToTimeString = seconds => {

        let date = new Date(seconds * 1000);

        let hour = date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

        return hour + ':' + minutes;

    }

    static getCurrentDayEpochSecs = () => {

        let time = new Date();
        let todayString = (time.getMonth() + 1) + "/" + time.getDate() + "/" + time.getFullYear();

        let seconds = DateUtils.convertDateToEpochSecs(todayString);

        return seconds;

    }

    static getCurrentEpochSecs = () => parseInt(new Date().getTime() / 1000);

}

