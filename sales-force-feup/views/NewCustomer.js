import React from 'react';
import { View, StyleSheet, Text, Button, ScrollView } from 'react-native'
import {connect} from 'react-redux'
import { ColorTheme, Styles } from '../utils/utils'
import t from 'tcomb-form-native'; // 0.6.9
import moment from 'moment';
import { fetchNewCustomer } from '../network/customers'

const Form = t.form.Form;
var District = t.enums({
    A:'Aveiro',
    B:'Beja',
    C:'Braga',
    D:'Bragança',
    E:'Castelo Branco',
    F:'Coimbra',
    G:'Évora',
    H:'Faro',
    I:'Guarda',
    J:'Leiria',
    K:'Lisboa',
    L:'Portalegre',
    M:'Porto',
    N:'Santarém',
    O:'Setúbal',
    P:'Viana do Castelo',
    Q:'Vila Real',
    R:'Viseu'
  });

const NewCustomerForm = t.struct({
    client: t.String,
    name: t.String,
    description: t.maybe(t.String),
    address: t.maybe(t.String),
    city: t.maybe(t.String),
    cellphone:t.String,
   // district: t.maybe(District),
    taxpayerNumber: t.String,
});

var options = {
    fields: {
        name: {
            error: 'Insert a valid name for the new customer',
        },
        date: {
            mode: 'date', // display the Date field as a DatePickerAndroid
            config: {
                format: (date) => moment(date).format("dddd, D MMMM YYYY")
            }
        },
        district: {
            mode: 'picker', // display the Date field as a DatePickerAndroid
            config: {
                format: (date) => moment(date).format("HH:mm"),
                defaultValueText: "Tap here to select the time"
            }
        },
        terms: {
            label: 'Premium Client',
      }
    }
};

 class NewCustomer extends React.Component {
    constructor(props) {
        super(props);

        this.submitNewCustomer = this.submitNewCustomer.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                <Text style={Styles.header.title}>New Customer</Text>
            )
        };
    };

    render() {

        return (
            <View style={styles.container}>
            <ScrollView>
                <Form
                    ref="form"
                    type={NewCustomerForm}
                    options={options}
                />
                <Button style={styles.submitButton}
                    title="Add Customer"
                    color={ColorTheme.lightGreen}
                    onPress={this.submitNewCustomer}
                />
            </ScrollView>
            </View>


        )
    }

    submitNewCustomer = async () => {
        var value = this.refs.form.getValue();

        if (value) { // if validation fails, value will be null
            let body = {};
          
            body.Cliente=value.client;
            body.Nome=value.name;
            body.Descricao=value.description;
            body.Morada=value.address;
            body.Telefone=value.cellphone;
            body.Distrito="";
            body.Localidade=value.city;
            body.NumContribuinte=value.taxpayerNumber;
            body.Pais="PT";
            body.Moeda="EUR";

            await fetchNewCustomer(body,this.props.user.primaveraToken);

            this.props.navigation.getParam("fetchCustomers")()

            this.props.navigation.pop()
            
        }
    }
}
const mapPropsToState = state => ({

    customers: state.customers,
    user: state.user
  
  })

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 10,
        padding: 20,
        backgroundColor: '#ffffff',
    }

});

export default connect(mapPropsToState)(NewCustomer)



