import React from 'react';
import { View, StyleSheet, Text, Button, ScrollView } from 'react-native'

import { ColorTheme, Styles } from '../utils/utils'

import t from 'tcomb-form-native'; // 0.6.9
import moment from 'moment';
import { fetchNewTask, fetchTaskType } from '../network/tasks'
import { connect } from "react-redux"
import { taskActions } from "../redux/actions"

const Form = t.form.Form;

const NewTaskForm = t.struct({
    name: t.String,
    date: t.Date,
    time: t.Date,
    details: t.String

});

var options = {
    fields: {
        name: {
            error: 'Insert a valid name for the new task',
        },
        date: {
            mode: 'date', // display the Date field as a DatePickerAndroid
            config: {
                format: (date) => moment(date).format("dddd, D MMMM YYYY")
            }
        },
        time: {
            mode: 'time', // display the Date field as a DatePickerAndroid
            config: {
                format: (date) => moment(date).format("HH:mm"),
                defaultValueText: "Tap here to select the time"
            }
        }
    }
};

class NewTask extends React.Component {
    constructor(props) {
        super(props);
        this.submitNewTask = this.submitNewTask.bind(this);

    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                <Text style={Styles.header.title}>New Task</Text>
            )
        };
    };

    render() {

        return (
            <View style={styles.container}>
            <ScrollView>
                <Form
                    ref="form"
                    type={NewTaskForm}
                    options={options}
                />
                <Button style={styles.submitButton}
                    title="Submit"
                    color={ColorTheme.lightGreen}
                    onPress={this.submitNewTask}
                />
            </ScrollView>
            </View>


        )
    }

    submitNewTask = async () => {
        var value = this.refs.form.getValue();

        if (value) { // if validation fails, value will be null
            let body = {};
            body.name = value.name;

            // const taskTime = moment(value.date).format("YYYY/MM/D") + moment(value.time).format(" HH:mm:00");
            // body.date = moment(taskTime).format("X");

            body.date = moment(value.date).format("YYYY/MM/D") + moment(value.time).format(" HH:mm:00");
            body.details = value.details;

            let taskTypes = await fetchTaskType(this.props.user);
            
            try{ 
                body.taskType = taskTypes.body.DataSet.Table[0].Id; 
            }
            catch(e){
                console.error("There is no Task Type. Please create one")
            }
            
            await fetchNewTask(body, this.props.user);

            this.props.navigation.getParam("updateTasks")()

            this.props.navigation.pop()
            
        }
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 10,
        padding: 20,
        backgroundColor: '#ffffff',
    }

});


const mapStateToProps = state => ({
    tasks: state.tasks,
    user: state.user
});
  
export default connect(mapStateToProps, { updateTasks: taskActions.updateTasks })(NewTask);





