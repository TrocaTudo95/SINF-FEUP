import React from 'react';
import { View, StyleSheet, Text, Button, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { ColorTheme, Styles } from '../utils/utils'
import t from 'tcomb-form-native'; // 0.6.9
import moment from 'moment';
import { fetchNewCustomer } from '../network/customers'

const Form = t.form.Form;


const NewCustomerForm = t.struct({
    name: t.maybe(t.String),
    description: t.maybe(t.String),
    address: t.maybe(t.String),
    city: t.maybe(t.String),
    cellphone: t.maybe(t.String),
    taxpayerNumber: t.maybe(t.String)
});

var options = {
    fields: {
        name: {
            error: 'Insert a valid name for the new customer',
        },
    },
};

class EditCustomer extends React.Component {
    constructor(props) {
        super(props);

        this.submitNewCustomer = this.submitNewCustomer.bind(this);
    }
    componentWillMount() {

        const customer = this.props.navigation.getParam('customer')
        var values = {};
        values.name = customer.Nome;
        values.description = customer.Descricao;
        values.address = customer.Morada;
        values.cellphone = customer.Telefone;
        values.city = customer.Localidade;
        values.taxpayerNumber = customer.NumContribuinte;

        this.setState(() => ({ customer: customer }))
        this.setState(() => ({ values: values }))
    }


    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                <Text style={Styles.header.title}>Edit Customer</Text>
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
                        value={this.state.values}
                    />
                    <Button style={styles.submitButton}
                        title="Edit Customer"
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

            body = this.state.customer;
            if (value.name != null)
                body.Nome = value.name;
            if (value.description != null) {
                body.Descricao = value.description;
            }
            if (value.address != null)
                body.Morada = value.address;
            if (value.cellphone != null)
                body.Telefone = value.cellphone;
            if (value.taxpayerNumber != null)
                body.NumContribuinte = value.taxpayerNumber;

            await fetchNewCustomer(body, this.props.user.primaveraToken);
            this.props.navigation.getParam('getCustomerDetails')(this.state.customer.Cliente);
            this.props.navigation.getParam('fetchCostumers')();
            this.props.navigation.pop();


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

export default connect(mapPropsToState)(EditCustomer)



