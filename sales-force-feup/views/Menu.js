import React from "react";
import { ScrollView, Dimensions, View, Text, TouchableOpacity } from "react-native";

import { logout } from '../network/authentication'
import { deleteLocally, ColorTheme } from '../utils/utils'
import { authActions } from '../redux/actions'

import { Styles } from '../utils/utils'

import { connect } from 'react-redux'

class Menu extends React.Component {

    logout = async () => {

        await deleteLocally(['salesmanCode', 'userId', 'username', 'sessionToken', 'primaveraToken'])
        await logout(this.props.user.userId, this.props.user.sessionToken)
        this.props.updateUser({})
        this.props.navigation.navigate('Login')


    }

    render() {

        styles = Styles.sideMenu

        return (
            
            <View style={{ marginTop: 24, flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{padding: 20, flex: 5, backgroundColor: ColorTheme.lightGreen}}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                {this.props.user.username}
                            </Text>
                        </View>
                        <View style={{padding: 20, flex: 1, backgroundColor: ColorTheme.lightGrey}}>
                            <Text style={{ color: ColorTheme.white, textAlign: "center", fontSize: 17, fontWeight: "bold" }}>
                                {this.props.user.salesmanCode}
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: "baseline" }}>
                        <TouchableOpacity
                        style={{ padding: 20 }}
                            onPress={() => { this.logout() }}
                        >
                            <Text style={{ fontSize: 16, color: "darkred" }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ padding: 20, alignItems: "center", backgroundColor: 'lightgrey' }}>
                    <Text style={{color: ColorTheme.strongGreen}}>Sales Force Feup - Móveis FEUP</Text>
                </View>

            </View>
        )
    }
}


const mapStateToProps = (state) => ({

    user: state.user

})

const mapActionsToProps = {

    updateUser: authActions.updateUser

}

export default connect(mapStateToProps, mapActionsToProps)(Menu)