import React from 'react';

import {View, Text, Dimensions} from 'react-native'

import store from './redux/store'
import {Provider} from 'react-redux'


import {Menu, Login, Tasks, NewTask, OpportunityList, Opportunity, AddOpportunity, ProductsList, Signup, Customers,EditCustomer,  Dashboard, NewCustomer, CustomerPage} from './views'

import {createBottomTabNavigator, createSwitchNavigator, createStackNavigator, createDrawerNavigator} from 'react-navigation'
import { Styles, ColorTheme } from './utils/utils';

import Ionicons from '@expo/vector-icons/Ionicons';

const CalendarNavigator = createStackNavigator(

  {
    TasksList: Tasks, 
    NewTaskView: NewTask,
  },

  {
    initialRouteName: 'TasksList',
    navigationOptions: {

      headerStyle: Styles.header.view,
      headerTintColor: ColorTheme.lightGreen,
      // headerTransparent: true

    }
  }
  
)

CalendarNavigator.navigationOptions = {

  tabBarLabel: ({focused}) => {

    return focused 
    ? (
      <View style={Styles.tabBar.view}>
          <Ionicons name='ios-calendar' size={24} color={ColorTheme.lightGreen}></Ionicons>
          <Text style={Styles.tabBar.textSelected}>Calendar</Text>
      </View>
    ) 
    : (
      <View style={Styles.tabBar.view}>
        <Ionicons name='ios-calendar-outline' size={24} color={ColorTheme.strongGrey}></Ionicons>
        <Text style={Styles.tabBar.textNotSelected}>Calendar</Text>
      </View>
    )
    
  }  

}

const ProductCatalogueNavigator = createStackNavigator(

  {
    ProductList: ProductsList, 
  },

  {
    initialRouteName: 'ProductList',
    navigationOptions: {

      headerStyle: Styles.header.view,
      headerTintColor: ColorTheme.lightGreen

    }
  }
  
)

ProductCatalogueNavigator.navigationOptions = {

  tabBarLabel: ({focused}) => {

    return focused 
    ? (
      <View style={Styles.tabBar.view}>
          <Ionicons name='ios-book' size={24} color={ColorTheme.lightGreen}></Ionicons>
          <Text style={Styles.tabBar.textSelected}>Catalogue</Text>
      </View>
    ) 
    : (
      <View style={Styles.tabBar.view}>
        <Ionicons name='ios-book-outline' size={24} color={ColorTheme.strongGrey}></Ionicons>
        <Text style={Styles.tabBar.textNotSelected}>Catalogue</Text>
      </View>
    )
    
  }  

}


const CustomersNavigator = createStackNavigator(

  {
    Customers: Customers, 
    NewCustomerView: NewCustomer,
    CustomerPage: CustomerPage,
    EditCustomer: EditCustomer

  },

  {
    initialRouteName: 'Customers',
    navigationOptions: {

      headerStyle: Styles.header.view,
      headerTintColor: ColorTheme.lightGreen

    }
  }
  
)

const OpportunitiesNavigator = createStackNavigator(

  {
    OpportunityList: OpportunityList,
    OpportunityDetails: Opportunity,
    AddOpportunity: AddOpportunity,
  },

  {
    initialRouteName: 'OpportunityList',
    navigationOptions: {

      headerStyle: Styles.header.view,
      headerTintColor: ColorTheme.lightGreen

    }
  }
)

OpportunitiesNavigator.navigationOptions = {
  tabBarLabel: ({focused}) => {

    return focused ? (
  
      <View style={Styles.tabBar.view}>
          <Ionicons name='ios-bulb' size={24} color={ColorTheme.lightGreen}></Ionicons>
          <Text style={Styles.tabBar.textSelected}>Opportunities</Text>
      </View>
    ) 
    : (
      <View style={Styles.tabBar.view}>
        <Ionicons name='ios-bulb-outline' size={24} color={ColorTheme.strongGrey}></Ionicons>
        <Text style={Styles.tabBar.textNotSelected}>Opportunities</Text>
      </View>
    )
  }
}



CustomersNavigator.navigationOptions = {

  tabBarLabel: ({focused}) => {

    return focused 
    ? (
      <View style={Styles.tabBar.view}>
          <Ionicons name='ios-contacts' size={24} color={ColorTheme.lightGreen}></Ionicons>
          <Text style={Styles.tabBar.textSelected}>Customers</Text>
      </View>
    ) 
    : (
      <View style={Styles.tabBar.view}>
        <Ionicons name='ios-contacts-outline' size={24} color={ColorTheme.strongGrey}></Ionicons>
        <Text style={Styles.tabBar.textNotSelected}>Customers</Text>
      </View>
    )
    
  }  
}

const DashboardNavigator = createStackNavigator(

  {
    Dashboard: Dashboard, 
  },

  {
    initialRouteName: 'Dashboard',
    navigationOptions: {

      headerStyle: Styles.header.view,
      headerTintColor: ColorTheme.lightGreen

    }
  }
  
)

DashboardNavigator.navigationOptions = {

  tabBarLabel: ({focused}) => {

    return focused 
    ? (
      <View style={Styles.tabBar.view}>
          <Ionicons name='ios-speedometer' size={24} color={ColorTheme.lightGreen}></Ionicons>
          <Text style={Styles.tabBar.textSelected}>Dashboard</Text>
      </View>
    ) 
    : (
      <View style={Styles.tabBar.view}>
        <Ionicons name='ios-speedometer-outline' size={24} color={ColorTheme.strongGrey}></Ionicons>
        <Text style={Styles.tabBar.textNotSelected}>Dashboard</Text>
      </View>
    )
    
  } 

}

const MainNavigator = createBottomTabNavigator(

  {
    Opportunities: OpportunitiesNavigator,
    Catalogue: ProductCatalogueNavigator,
    Tasks: CalendarNavigator,
    Dashboard: DashboardNavigator,
    Customers: CustomersNavigator
  },

  {
    initialRouteName: 'Tasks',
    tabBarOptions: {

    }
  }

)

const DrawerNavigator = createDrawerNavigator(

  {
    Main: MainNavigator
  },

  {
    contentComponent: Menu,
    initialRouteName: 'Main'

  }

)

const SwitchNavigatorLogin = createSwitchNavigator(

  {
    Login: Login,
    Signup: Signup,
    DrawerNavigator: DrawerNavigator
  },

  {
    initialRouteName: 'Login'
  }

)


export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <SwitchNavigatorLogin/>
      </Provider>
    );
  }
}
