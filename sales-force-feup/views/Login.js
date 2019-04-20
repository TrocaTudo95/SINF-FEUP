import React from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Dimensions } from 'react-native'
import {ColorTheme, Styles, saveLocally, getLocally} from '../utils/utils'

import {connect} from 'react-redux'
import {authActions} from '../redux/actions'

import {login, loginWithToken} from '../network/authentication'

class Login extends React.Component {

    componentDidMount() {

        this.checkLogged()
    }
    
    checkLogged = async () => {

        this.setState({activityIndicator:true})
        
        let user = await getLocally(['salesmanCode','userId','username','sessionToken','primaveraToken'])
        
        if(user.sessionToken != null)
            this.login(null, null, user.sessionToken, user.userId)
        else 
            this.setState({activityIndicator:false})
    }

    state = {
        salesmanCode: this.props.navigation.getParam('salesmanCode') !== null ? this.props.navigation.getParam('salesmanCode') : '',
        password: '',
        error: '',
        activityIndicator: false,
    }


    login = async (salesmanCode, password, sessionToken, userId) => {

        try {

            this.setState({activityIndicator: true})
            let user = sessionToken === undefined ? await login(salesmanCode,password) : await loginWithToken(userId,sessionToken)
            this.enterApp(user.body)
        }

        catch(err) {
            this.setState({error: err.error, activityIndicator: false})
        }
    
    }


    saveUserToReduxAndPhone = (user) => {

        this.props.updateUser(user)
        saveLocally([{key:'salesmanCode',value:user.salesmanCode}, {key:'userId',value:`${user.userId}`}, {key:'username',value:user.username},{key:'sessionToken',value:user.sessionToken}, {key:'primaveraToken', value: user.primaveraToken}])

    }

    enterApp = async (user) => {

        this.setState(()=> ({loading:false}))
        this.saveUserToReduxAndPhone(user)
        this.props.navigation.navigate('DrawerNavigator')

    }


    render() {

        const code = this.props.navigation.getParam('salesmanCode') !== null ? this.props.navigation.getParam('salesmanCode') : ''
        const name = this.props.navigation.getParam('salesmanName') !== null ? this.props.navigation.getParam('salesmanName') : '' 
        const msg = this.props.navigation.getParam('msg') !== null ? this.props.navigation.getParam('msg') : '' 
        const activityIndicatorTextColor = this.state.activityIndicator ? ColorTheme.lightGreen : ColorTheme.black

        return (
            <KeyboardAvoidingView style={Styles.loginSignup.mainView} behavior='padding' enabled>

            <View style={Styles.loginSignup.upperView}>

                <Text style={Styles.loginSignup.logo}>Sales Force FEUP</Text>
                <Text style={{color:ColorTheme.lightGreen, fontSize: 20}}>Móveis FEUP</Text>
            
            </View>

            <Text style = {{color: ColorTheme.lightGreen}}>{msg}</Text>
            <Text style = {{fontSize: 20, color: ColorTheme.lightGreen}}>{name}</Text>
            
            <View style={[Styles.loginSignup.warningsView, {marginTop: 15}]}>
                <Text style={Styles.loginSignup.warnings}>{this.state.error}</Text>
            </View>

            <ActivityIndicator size="large" color={ColorTheme.strongGreen} style={{paddingBottom: 5}} animating={this.state.activityIndicator} />
            <Text style={{color: activityIndicatorTextColor, fontSize: 10}}>Connecting to ERP</Text>

            <View style={Styles.loginSignup.bottomView}>
                <TextInput 
                    placeholder='salesman code' 
                    placeholderTextColor={ColorTheme.white}
                    style={Styles.loginSignup.textField} 
                    value={code}
                    onChangeText={(text) => {this.setState({salesmanCode: text, error: ''})}}
                    autoCapitalize='none'
                    />
                <TextInput 
                    placeholder='password' 
                    placeholderTextColor={ColorTheme.white}
                    style={Styles.loginSignup.textField} 
                    onChangeText={(text) => {this.setState({password: text, error:''})}}
                    value={this.state.password}
                    autoCapitalize='none'
                    secureTextEntry/>
                <TouchableOpacity
                    onPress={() => {this.login(this.state.salesmanCode, this.state.password)}}
                    //onPress={this.enterApp}
                    style={Styles.loginSignup.buttonView}
                    disabled={this.state.activityIndicator}
                >
                    <Text style={Styles.loginSignup.button}>Login</Text>
                </TouchableOpacity>

                <Text style={{marginTop: 50, color:ColorTheme.lightGrey}}>Do not have an account?</Text>
                <TouchableOpacity 
                    onPress={() => {this.props.navigation.navigate('Signup')}}
                    style={Styles.loginSignup.buttonView}
                >
                    <Text style={Styles.loginSignup.button}>Signup</Text>
                </TouchableOpacity>
                
            </View>

                
            </KeyboardAvoidingView>
        );

    }

}

const actionTriggers = {
    updateUser: authActions.updateUser
}

export default connect(null,actionTriggers)(Login)