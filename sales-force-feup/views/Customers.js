import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from "react-native";
import Swipeout from "react-native-swipeout";

import { Styles, ColorTheme, Hr } from "../utils/utils";

import { connect } from "react-redux";

import Ionicons from "@expo/vector-icons/Ionicons";

import { customersActions } from "../redux/actions";

import { DrawerActions } from "react-navigation-drawer";

import { fetchCustomers, deleteCostumer } from "../network/customers";

class Customers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text style={Styles.header.title}> Customers</Text>,
      headerRight: (
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.getParam("fetchCustomers")();
            }}
          >
            <View style={{ paddingRight: 15 }}>
              <Ionicons name="ios-refresh" size={36} color={ColorTheme.lightGreen} />
            </View>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: (
        <View>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <View style={{ paddingLeft: 10 }}>
              <Ionicons
                name="ios-menu-outline"
                size={32}
                color={ColorTheme.lightGreen}
              />
            </View>
          </TouchableOpacity>
        </View>
      )
    };
  };

  state = {
    loading: false,
    text: "Fetching customers from Primavera..."
  };

  componentDidMount() {
    this.fetchCustomers();
    this.props.navigation.setParams({ fetchCustomers: this.fetchCustomers });
  }

  fetchCustomers = async () => {
    this.setState(() => ({ loading: true }));

    try {
      const customers = await fetchCustomers(this.props.user.primaveraToken);
      this.props.updateCustomers(customers.body.DataSet.Table);
      this.setState(() => ({
        loading: false,
        text: "Fetching customers from Primavera..."
      }));
    } catch (error) {
      this.setState(() => ({
        loading: false,
        text: "Could not connect to Primavera, please try again"
      }));
    }

    const customers = await fetchCustomers(this.props.user.primaveraToken);
    this.props.updateCustomers(customers.body.DataSet.Table);
    this.setState(() => ({
      loading: false,
      text: "Fetching customers from Primavera..."
    }));
  };

  nativateToDetails = id => {
    this.props.navigation.navigate("CustomerPage", {
      customerId: id,
      fetchCustomers: this.props.navigation.getParam("fetchCustomers")
    });
  };

  render() {
    return (
      <View style={Styles.products.mainView}>
        {this.state.loading ? (
          <View>
            <ActivityIndicator
              size="small"
              color={ColorTheme.lightGreen}
              style={{ paddingRight: 5, paddingTop: 14.7, paddingBottom: 14.7 }}
            />
            <Text style={{ color: ColorTheme.strongGrey }}>
              {this.state.text}
            </Text>
          </View>
        ) : (
            <FlatList
              data={this.props.customers}
              renderItem={({ item }) => {
                return (
                  <CustomerItemView
                    item={{
                      customerId: item.Cliente,
                      customerName: item.Nome,
                      customerAdress: item.Fac_Mor,
                      token: this.props.user.primaveraToken
                    }}
                    navigateFunction={this.nativateToDetails}
                    syncCostumers={this.fetchCustomers}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        <View
          elevation={5}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            borderRadius: 30,
            backgroundColor: ColorTheme.lightGreen
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("NewCustomerView", {
                fetchCustomers: this.props.navigation.getParam("fetchCustomers")
              });
            }}
          >
            <Ionicons
              style={{ marginVertical: 10, marginHorizontal: 16 }}
              name="md-add"
              size={32}
              color={ColorTheme.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class CustomerItemView extends React.Component {
  deleteCostumers = async (customer, token) => {
    try {
      await deleteCostumer(customer, token);
      this.props.syncCostumers;
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    let swipeoutBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        onPress: () => {
          this.deleteCostumers(
            this.props.item.customerId,
            this.props.item.token
          );
        }
      }
    ];

    return (
      <Swipeout
        autoClose={true}
        style={{ backgroundColor: ColorTheme.white }}
        right={swipeoutBtns}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.navigateFunction(this.props.item.customerId);
          }}
        >
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={Styles.products.item}>
              <Text style={{ fontSize: 21, marginRight: 10 }}>
                {this.props.item.customerName}
              </Text>
              <Text style={{ fontSize: 14, color: ColorTheme.lightGrey }}>
                {this.props.item.customerAdress}
              </Text>
            </View>
            <Text style={{paddingRight:10}}>{this.props.item.customerId}</Text>
          </View>
          <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={15} />
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

const mapPropsToState = state => ({
  customers: state.customers,
  user: state.user
});

const actionTriggers = {
  updateCustomers: customersActions.updateCustomers
};

export default connect(
  mapPropsToState,
  actionTriggers
)(Customers);
