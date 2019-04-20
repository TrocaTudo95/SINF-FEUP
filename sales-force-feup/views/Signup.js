import React from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { signup } from '../network/authentication'
import { ColorTheme, Styles } from '../utils/utils'


export default class Signup extends React.Component {

    state = {
        salesmanCode: '',
        salesmanCodeCorrect: true,
        password: '',
        passwordCorrect: true,
        repeatPassword: '',
        repeatPasswordCorrect: true,
        activityIndicator: false,
        salesmanCodeError: ""
    }


    handleSubmit = async () => {

        let pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[1-9])(?=.{6,})/

        let salesmanCode = this.state.salesmanCode
        let pwd = this.state.password.match(pwdRegex)
        let repeatPwd = this.state.password === this.state.repeatPassword

        let ok = true;

        this.setState({ activityIndicator: true })

        if (salesmanCode === '') {

            this.setState({ salesmanCodeCorrect: false, activityIndicator: false })
            ok = false;

        }

        if (pwd === null) {
            this.setState({ passwordCorrect: false, activityIndicator: false })
            ok = false;
        }

        if (repeatPwd === false && pwd !== null) {
            this.setState({ repeatPasswordCorrect: false, activityIndicator: false })
            ok = false;
        }

        if (ok) {
            try {
                let user = await signup(this.state.salesmanCode, this.state.password)
                
                this.setState({ activityIndicator: false })
                this.props.navigation.navigate('Login', { msg: 'User successfully created!', salesmanCode: this.state.salesmanCode, salesmanName: user.body.name })
            
            
            } catch (error) {
                this.setState({ userError: error.error, activityIndicator: false })
            }

        }

    }

    render() {

        const salesmanCodeError = !this.state.salesmanCodeCorrect

            ? <View style={Styles.loginSignup.warningsView}>
                <Text style={Styles.loginSignup.warnings}> Salesman identification is mandatory</Text>
            </View>
            : null

        const pwdError = !this.state.passwordCorrect

            ? <View style={Styles.loginSignup.warningsView}>
                <Text style={Styles.loginSignup.warnings}> Password must have 1 capital, 1 low letter and 1 number and be at least 6 chars long </Text>
            </View>
            : null

        const pwdRepeatError = !this.state.repeatPasswordCorrect

            ? <View style={Styles.loginSignup.warningsView}>
                <Text style={Styles.loginSignup.warnings}> Passwords do not match </Text>
            </View>
            : null

        return (

            <KeyboardAvoidingView style={Styles.loginSignup.mainView} behavior='padding' enabled>

                <View style={Styles.loginSignup.upperView}>
                    <Text style={Styles.loginSignup.logo}>Salesman Signup</Text>
                </View>

                <View style={Styles.loginSignup.warningsView}>
                    <Text style={Styles.loginSignup.warnings}>{this.state.userError}</Text>
                </View>

                <ActivityIndicator size="large" color={ColorTheme.strongGreen} animating={this.state.activityIndicator} />

                <View style={Styles.loginSignup.bottomView}>

                    <TextInput
                        style={Styles.loginSignup.textField}
                        placeholder='salesman code'
                        placeholderTextColor={ColorTheme.white}
                        onChangeText={(text) => this.setState({ salesmanCode: text, salesmanCodeCorrect: true })}
                        value={this.state.username}
                        autoCapitalize="none"
                    />
                    {salesmanCodeError}
                    <TextInput
                        style={Styles.loginSignup.textField}
                        placeholder='password'
                        placeholderTextColor={ColorTheme.white}
                        onChangeText={(text) => this.setState({ password: text, passwordCorrect: true })}
                        value={this.state.password}
                        autoCapitalize="none"
                        secureTextEntry
                    />
                    {pwdError}
                    <TextInput
                        style={Styles.loginSignup.textField}
                        placeholderTextColor={ColorTheme.white}
                        placeholder='repeat password'
                        onChangeText={(text) => this.setState({ repeatPassword: text, repeatPasswordCorrect: true })}
                        value={this.state.repeatPassword}
                        autoCapitalize="none"
                        secureTextEntry
                    />
                    {pwdRepeatError}

                    <TouchableOpacity
                        onPress={() => { this.handleSubmit() }}
                        style={Styles.loginSignup.buttonView}
                    >
                        <Text style={Styles.loginSignup.button}>Confirm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('Login') }}
                        style={{ marginTop: 50 }}
                    >
                        <Text style={Styles.loginSignup.button}>Cancel</Text>
                    </TouchableOpacity>

                </View>


            </KeyboardAvoidingView>

        );

    }
}