import React from "react"
import {View,Text,FlatList,TouchableOpacity,ActivityIndicator, Button} from "react-native"
import { connect } from "react-redux"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ColorTheme, Styles, DateUtils, Hr } from "../utils/utils"
import { DrawerActions } from 'react-navigation-drawer'

import moment from 'moment';
import { fetchTasks, updateTask, deleteTask } from "../network/tasks"

import { taskActions } from "../redux/actions"

import Swipeout from 'react-native-swipeout'

class Tasks extends React.Component {

  constructor(props) {
    super(props);
    this.props.tasks = [];
    this.state = {
      tasksLoading: [],
      nextTask: -1,
      offset: 0,
      calendarView: true
    }
  }

  static navigationOptions = ({ navigation }) => {

    const user = navigation.getParam('user')

    return {
      headerTitle: (
        <Text style={Styles.header.title}>Calendar</Text>
      ),
      headerRight: (
        <View>
          <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 8 }}
            onPress={navigation.getParam("changeCalendarView")}
          >
            <Ionicons name={"md-calendar"} size={30} color={ColorTheme.white} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: (

        <View>
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            > 
              <View style={{ paddingLeft: 10 }}>
                <Ionicons name='ios-menu-outline' size={32} color={ColorTheme.lightGreen}></Ionicons>
              </View>

              
          </TouchableOpacity>
        </View>

      )
    };
  };

  componentDidMount() {
    this.fetchTasks()
    this.props.navigation.setParams({
      updateTasks: this.fetchTasks,
      changeCalendarView: this.changeCalendarView,
      getCalendarIcon: this.getCalendarIcon,
      user: this.props.user.username
    })
  }

  render() {
    this.todayColor = this.state.offset ? ColorTheme.light2Grey : ColorTheme.lightGreen;

    return (
      <View style={Styles.tasks.mainView}>
        <View style={{ flex: -1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', backgroundColor: this.todayColor }}>
          <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 8 }}
            onPress={() => {
              this.setState((prevState) => ({ offset: prevState.offset - 1 }));
            }}
          >
            <Ionicons name={"ios-arrow-back"} size={30} />
          </TouchableOpacity>
          <View style={{}} >
            <Text style={{ fontSize: 15 }}>
              {this.state.calendarView ?
                moment().add(this.state.offset, 'months').format("MMMM YYYY")
                :
                moment().add(this.state.offset, 'days').calendar(null, {
                  sameDay: '[Today,] D MMM',
                  nextDay: '[Tomorrow,] D MMM',
                  nextWeek: 'dddd, D MMM',
                  lastDay: '[Yesterday,] D MMM',
                  lastWeek: '[Last] dddd, D MMM',
                  sameElse: 'dddd, D MMM'
                })}
            </Text>
          </View>
          <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 8 }}
            onPress={() => {
              this.setState((prevState) => ({ offset: prevState.offset + 1 }));
            }}
          >
            <Ionicons name={"ios-arrow-forward"} size={30} />
          </TouchableOpacity>
        </View>

        <TasksContentView
          tasks={this.props.tasks}
          tasksLoading={this.state.tasksLoading}
          offset={this.state.offset}
          fetchTasks={this.fetchTasks}
          setTaskLoading={this.setTaskLoading}
          userPrimaveraToken={this.props.user.primaveraToken}
          calendarView={this.state.calendarView}
          navigateToDay={this.navigateToDay}
        />


        <View elevation={5} style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          borderRadius: 30,
          backgroundColor: ColorTheme.lightGreen
        }} >
          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate("NewTaskView", { updateTasks: this.props.navigation.getParam("updateTasks") }) }}
          >
            <Ionicons style={{ marginVertical: 10, marginHorizontal: 16 }} name='md-add' size={32} color={ColorTheme.white}></Ionicons>
          </TouchableOpacity>
        </View>
      </View >
    );
  }

  fetchTasks = async () => {

    tasks = await fetchTasks(this.props.user)

    this.props.updateTasks(tasks.body.DataSet.Table)

    // nextTask = this.calculateNextTask()

    this.setState(() => ({ tasksLoading: []/*, nextTask: nextTask*/ }))

  };

  setTaskLoading = (index) => {

    this.setState((prevState) => {

      newTasksLoading = prevState.tasksLoading.slice()
      newTasksLoading.push(index)
      return { tasksLoading: newTasksLoading }

    })

  }

  changeCalendarView = () => {
    this.setState((prevState) => ({ calendarView: !prevState.calendarView, offset: 0 }));
  }

  navigateToDay = (dayOffset) => {
    this.setState(() => ({ calendarView: false, offset: dayOffset }));
  }

  getCalendarIcon = () => {
    return this.state.calendarView ? "md-checkbox-outline" : "md-calendar";
  }

}

class TasksContentView extends React.Component {
  constructor(props) {
    super(props);

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      this.weekDays.push(moment(0, "d").add(i, "days").format("ddd"))
    }
  }

  render() {
    if (this.props.calendarView) {

      let calendar = [];
      let firstDayOfMonth = moment(moment().add(this.props.offset, "months").format('M'), 'M');

      for (let i = 0; i < 6; i++) {
        let week = {};

        week.key = "W" + i;
        week.value = [];
        for (let j = 0; j < 7; j++) {
          let day = {};

          day.key = "D" + i + j;

          let dayToDisplay = moment(firstDayOfMonth).add(i * 7 + j - firstDayOfMonth.format('d'), "days");

          day.value = dayToDisplay.format("D");
          let sameMonth = dayToDisplay.isSame(firstDayOfMonth, "month");
          let today = dayToDisplay.isSame(moment(), "day");
          day.color = today ? ColorTheme.lightGreen : (sameMonth ? ColorTheme.black : ColorTheme.light2Grey)

          day.offset = dayToDisplay.diff(moment(0, "HH"), 'days');
          let nTasks = this.filterTasksByDay(this.props.tasks, day.offset).length;
          day.tasks = [];

          for (let k = 0; k < Math.min(nTasks, 3); k++) {
            let taskBar = {}
            taskBar.key = "B" + i + j + k

            let colors = [
              ColorTheme.papaya,
              ColorTheme.aqua,
              ColorTheme.lemon
            ]
            taskBar.value = colors[k];

            day.tasks.push(taskBar);
          }

          week.value.push(day);
        }

        calendar.push(week);

      }
      return (
        <View>
          <View style={{ flex: -1, flexDirection: 'row', justifyContent: "space-around", backgroundColor: ColorTheme.light3Grey }}>
            {
              weekDaysTab = this.weekDays.map(weekDay => {
                return (
                  <View key={weekDay} style={{ paddingVertical: 5, width: 40 }} >
                    <Text style={{ textAlign: 'center' }}>{weekDay}</Text>
                  </View>
                )
              })
            }
          </View>
          {
            calendarDays = calendar.map(week => {
              return (
                <View
                  key={week.key}
                  style={{
                    flex: -1,
                    flexDirection: 'row',
                    justifyContent: "space-around",
                    paddingTop: 15
                  }}>
                  {
                    weekCalendarDays = week.value.map(day => {
                      return (
                        <TouchableOpacity
                          key={day.key}
                          onPress={this.props.navigateToDay.bind(this, day.offset)}>

                          <View style={{ paddingVertical: 3, width: 40 }} >
                            <Text style={{ textAlign: 'center', color: day.color }}>{day.value}</Text>
                          </View>
                          <View style={{ width: 40, height: 25, alignItems: 'center' }} >
                            {
                              taskBars = day.tasks.map(bar => {
                                return (
                                  <View key={bar.key} style={{ width: 30, height: 4, borderRadius: 2, marginVertical: 1, backgroundColor: bar.value }} />
                                )
                              })
                            }
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>

              )
            })
          }
        </View>
      );
    }
    else {
      return (
        <FlatList
          data={this.filterTasksByDay(this.props.tasks, this.props.offset)}
          extraData={this.props.tasksLoading}
          renderItem={({ item, index }) => {
            loadingItem = false

            if (this.props.tasksLoading.includes(index))
              loadingItem = true

            return (
              <TaskItemView
                updateTask={this.updateTask}
                nextTask={this.nextTask}
                deleteTask={this.deleteTask}
                index={index}
                loading={loadingItem}
                item={item}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }
  }

  filterTasksByDay = (tasks, offset) => {

    let taskFiltered = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      if (moment(task.DataInicio).isSame(moment().add(offset, 'days'), 'day')) {
        taskFiltered.push(task);
      }
    }

    return taskFiltered;
  }

  updateTask = async (item, index) => {

    this.props.setTaskLoading(index)

    let completed = 1 - item.Estado;

    await updateTask(item.Id, completed, this.props.userPrimaveraToken);
    this.props.fetchTasks();

  }

  deleteTask = async (item, index) => {

    this.props.setTaskLoading(index)
    await deleteTask(item.Id, this.props.userPrimaveraToken)
    this.props.fetchTasks()

  }

  calculateNextTask = () => {

    if (this.props.tasks.length == 0)
      return


    let nextTask = -1

    for (let i = 0; i < this.props.tasks.length; i++) {

      let difference = moment().isBefore(this.props.tasks[i].DataInicio);

      if (difference) {
        nextTask = i
        break
      }
    }

    return nextTask;

  }
}
class TaskItemView extends React.Component {
  render() {

    const marginDesc = new moment(this.props.item.DataInicio).format('H') < 10 ? 25 : 20;

    const taskDone = this.props.item.Estado == 1 ? {
      textColor: { color: ColorTheme.lightMediumGrey },
      iconName: "md-done-all",
      iconColor: ColorTheme.lightGreen
    }
      : {
        iconName: "md-arrow-round-back",
      }


    const nextTaskStyle =
      this.props.nextTask == this.props.index
        ? { height: 100, padding: 0, backgroundColor: ColorTheme.light3Grey }
        : {}

    let swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => { this.props.deleteTask(this.props.item) }
      },
      {
        text: 'Complete',
        onPress: () => { this.props.updateTask(this.props.item, this.props.index) }
      }
    ]

    return (
      <Swipeout autoClose={true} style={{ backgroundColor: ColorTheme.white }} right={swipeoutBtns}>
        <View style={[Styles.tasks.item, nextTaskStyle, { paddingBottom: 20, paddingTop: 20, paddingLeft: 5 }]}>
          <Text style={[taskDone.textColor, { fontSize: 16 }]}> {moment(this.props.item.DataInicio).format("HH:mm")}</Text>
          <Text style={[taskDone.textColor, { marginLeft: marginDesc, fontSize: 17 }]}>{this.props.item.Resumo}</Text>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", paddingRight: 15, alignItems: "center", alignContent: "center" }}>
            {this.props.loading ?
              <ActivityIndicator size="small" color={ColorTheme.lightGreen} style={{ paddingRight: 5, paddingTop: 20, paddingBottom: 20 }} />
              :
              null
            }

          </View>
        </View>
        <Hr color={ColorTheme.lightGrey} lineHeight={1} color={ColorTheme.light3Grey} />
      </Swipeout>

    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  user: state.user
});

export default connect(mapStateToProps, { updateTasks: taskActions.updateTasks })(Tasks);
