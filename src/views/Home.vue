<template>
  <div class="all">
    <div class="calendar">
      <h2 class="calendar-header">
        <button @click="prevMonth"><strong>&lt;</strong></button>
        {{ monthName }} {{ currentYear }}
        <button @click="nextMonth"><strong>&gt;</strong></button>
      </h2>
      <table>
        <thead>
          <tr>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in calendar" :key="index">
            <template v-if="tasks">
              <td v-for="(day, index) in week" :key="index"
                :class="[selectedDayClass, dayColor(day), { 'today': isToday(day), 'has-tasks': hasTasks(day), 'current-day': isCurrentDay(day), 'empty-day': !day }]"
                @click="day && selectDay(day)">
                {{ day }}
                <template v-if="hasTasks(day)">
                  <v-badge :content="getCompletedTasks(day) + getInProgressTasks(day) + getNotCompletedTasks(day)"
                    color="error" inline>
                    <v-icon icon="mdi-vuetify" size="x-large"></v-icon>
                  </v-badge>
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
      <template v-if="selectedDay" class="tasks-for-day">
        <h3 class="tasks-for-day-header">Zlecenia na dzień {{ selectedDay }} {{ monthName }} {{ currentYear }}</h3>
        <template v-if="tasksForSelectedDay.length > 0">
          <ul>
            <div v-for="task in tasksForSelectedDay" :key="task.id" class="task"
              @click="selectedTask === task ? selectedTask = null : selectedTask = task">
              <div>{{ task.name }}</div>
              <div v-if="selectedTask === task" class="task-details">
                <p>Data zakończenia: <br /> {{ moment(selectedTask.date).format('DD-MM-YYYY') }}</p>
                <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                <p>Opis: <br /> {{ selectedTask.description }}</p>
              </div>
            </div>
          </ul>
        </template>
        <template v-else>
          <p>Brak zleceń na ten dzień</p>
        </template>
      </template>
    </div>
    <button class="add-task-button" @click="showAddTaskModal = true">Dodaj zlecenie</button>
    <modal v-bind:show-add-task-modal="showAddTaskModal" v-bind:new-task="newTask" v-bind:add-task="addTask"
      v-bind:close="close"></modal>
  </div>
</template>

<script>
// @keydown="this.console.log($showAddTaskModal.length)"
import Modal from '../components/addTask.vue';
import moment from 'moment';
import axios from 'axios';

export default {
  components: {
    Modal
  },
  data() {
    return {
      moment,
      currentDate: new Date(),
      showAddTaskModal: false,
      newTask: {
        date: '',
        name: '',
        description: '',
        phoneNumber: '',
        costs: '',
        status: '',
      },
      tasks: [],
      selectedTask: null,
      selectedDay: null,
      selectedDayClass: '',
      days: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So', 'Nd'],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      calendar: [],
      week: [],
    };
  },
  computed: {
    monthName() {
      const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
      return months[this.currentMonth];
    },
    firstDayOfMonth() {
      return new Date(this.currentYear, this.currentMonth, 1);
    },
    firstDayOfWeek() {
      return this.firstDayOfMonth.getDay();
    },
    tasksForSelectedDay() {
      if (!this.selectedDay) {
        return [];
      }
      const selectedDate = this.currentYear + '-' + (this.currentMonth.toString().length > 1 ? (this.currentMonth + 1) : '0' + (this.currentMonth + 1)) + '-' + (this.selectedDay.toString().length > 1 ? this.selectedDay : '0' + this.selectedDay);
      return this.tasks.filter(task => task.date === selectedDate);
    },
    dayColor() {
        return (day) => {
            let tasksForDay = this.tasks.filter(task => {
                return this.currentYear + '-' + (this.currentMonth.toString().length>1? (this.currentMonth+1):'0' + (this.currentMonth+1)) + '-' + (day.toString().length>1? day:'0' + day) === task.date;
            });
            let allCompleted = tasksForDay.every(task => task.status === 'completed');
            return allCompleted ? 'green-day' : 'default-day';
        }
    },
  },
  methods: {
    generateCalendar() {
      // Reset calendar
      this.calendar = [];
      this.week = [];

      // Get the first day of the month
      const firstDay = new Date(this.currentYear, this.currentMonth, 0);
      const firstDayOfWeek = firstDay.getDay();

      // Get the last day of the month
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const lastDate = lastDay.getDate();
      const weekNumber = Math.ceil((firstDayOfWeek + lastDate) / 7);

      // Set up variables for looping through the dates
      let day = 1;
      let week = [];

      // Loop through the calendar weeks
      for (let i = 0; i < weekNumber; i++) {
        // Loop through the days of the week
        for (let j = 0; j < 7; j++) {
          // Check if we are on the first week and the day is before the first day of the month
          if (i === 0 && j < firstDayOfWeek) {
            week.push('');
          }
          // Check if the day is after the last date of the month
          else if (day > lastDate) {
            week.push('');
          }
          // Otherwise, add the day to the calendar
          else {
            week.push(day);
            day++;
          }
        }
        // Add the week to the calendar
        this.calendar.push(week);
        week = [];
      }
    },
    selectDay(day) {
      this.selectedDay = day;
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
    },
    isCurrentDay(day) {
      const today = new Date();
      return day === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
    },
    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear()
      );
    },
    prevMonth() {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.generateCalendar();
    },
    nextMonth() {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.generateCalendar();
    },
    hasTasks(day) {
      // Check if the selected day has tasks
      if (this.tasks.length > 0 && day != '') {
        return this.tasks?.some(task => this.currentYear + '-' + (this.currentMonth.toString().length > 1 ? (this.currentMonth + 1) : '0' + (this.currentMonth + 1)) + '-' + (day.toString().length > 1 ? day : '0' + day) == task.date);
      }
    },
    getCompletedTasks(day) {
      let completedTasks = this.tasks.filter(task => {
        return this.currentYear + '-' + (this.currentMonth.toString().length > 1 ? (this.currentMonth + 1) : '0' + (this.currentMonth + 1)) + '-' + (day.toString().length > 1 ? day : '0' + day) === task.date && task.status === 'completed';
      });
      return completedTasks.length;
    },
    getInProgressTasks(day) {
      let inProgressTasks = this.tasks.filter(task => {
        return this.currentYear + '-' + (this.currentMonth.toString().length > 1 ? (this.currentMonth + 1) : '0' + (this.currentMonth + 1)) + '-' + (day.toString().length > 1 ? day : '0' + day) === task.date && task.status === 'in progress';
      });
      return inProgressTasks.length;
    },
    getNotCompletedTasks(day) {
      let notCompletedTasks = this.tasks.filter(task => {
        return this.currentYear + '-' + (this.currentMonth.toString().length > 1 ? (this.currentMonth + 1) : '0' + (this.currentMonth + 1)) + '-' + (day.toString().length > 1 ? day : '0' + day) === task.date && task.status === 'notStarted';
      });
      return notCompletedTasks.length;
    },
    addTask() {
      // Add the new order to the orders
      if (this.newTask.name !== '' && this.newTask.date !== '') {
        this.tasks.push({
          id: this.tasks.length + 1,
          date: new Date(this.newTask.date),
          name: this.newTask.name,
          description: this.newTask.description,
          phoneNumber: this.newTask.phoneNumber,
          costs: this.newTask.costs,
          status: 'not started',
        })
        this.$emit('update:show-add-task-modal', false);
      } else {
        // show error message
        alert("Za mało informacji! Podaj datę zakończenia i nazwę");
        return false;
      }
      this.showAddTaskModal = false
      // Reset the form
      this.newTask = {
        date: '',
        name: '',
        description: '',
        phoneNumber: '',
        costs: '',
      };
    },
    taskColor(task) {
      switch (task.status) {
        case 'not started':
          return 'red';
        case 'in progress':
          return 'gray';
        case 'completed':
          return 'green';
        default:
          return 'black';
      }
    },
    close() {
      this.showAddTaskModal = false;
    },
    editTask(task) {
      this.newTask = Object.assign({}, task);
      this.showAddTaskModal = true;
    },
    deleteTask(task) {
      let index = this.tasks.indexOf(task);
      this.tasks.splice(index, 1);
    },

  },
  created() {
    axios.get('http://localhost:3001/tasks/all')
      .then(response => {
        console.log(response.data)
        this.tasks = response.data;
        for (let i = 0; i < response.data.length; i++) {
          this.tasks[i].date = moment(this.tasks[i].date).format('YYYY-MM-DD')
        }
        console.log(this.tasks)
        //this.response.data = moment(this.response.data).format('YYYY-MM-DD')
      })
      .catch(err => {
        console.log(err);
      });
    this.generateCalendar()
    this.selectDay = this.selectDay.bind(this)
  },
};
</script>

<style>
.all {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
  background-color: var(--light);
}

.calendar {
  width: 1000px;
  display: block;
  text-align: center;
  border-radius: 5px;
  color: var(--dark);
  font-size: 18px;
}

.calendar-header {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--primary);
  font-size: 24px;
  font-weight: bold;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: white;
}

.calendar button {
  background-color: var(--primary);
  color: white;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.calendar td {
  border-radius: 5px;
  background-color: white;
  color: var(--dark);
  padding: 10px;
}

.calendar .today {
  background-color: var(--primary);
  color: white;
}

.calendar .task-statuses {
  display: flex;
  justify-content: space-around;
  font-size: 12px;
}

.calendar .completed {
  width: 45%;
  background-color: green;
  color: rgb(255, 255, 255);
  border-radius: 100%;
}

.calendar .in-progress {
  width: 45%;
  background-color: orange;
  color: rgb(255, 255, 255);
  border-radius: 100%;
}

.calendar .not-completed {
  width: 45%;
  background-color: red;
  color: rgb(255, 255, 255);
  border-radius: 100%;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: var(--dark);
  color: var(--light);
  font-size: 1.2em;
}

td {
  border: 1px solid var(--gray);
  text-align: center;
  vertical-align: middle;
  padding: 0.5em;
  cursor: pointer;
}

td.today {
  background-color: var(--light);
}

td.has-tasks {
  background-color: var(--light);
}

.task-statuses {
  display: flex;
  justify-content: space-between;
}

.task-statuses span {
  display: inline-block;
  width: 33%;
}

.add-task-button {
  background-color: var(--primary);
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.empty-day {
  background-color: rgb(128, 128, 128);
}

.tasks-for-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

.tasks-for-day-header {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 1em;
}

.tasks-for-day ul {
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
}

.tasks-for-day li {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1em;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 1em;
}

.tasks-for-day li strong {
  font-size: 1.5em;
}

.tasks-for-day li div {
  width: 80%;
  text-align: center;
}

.task {
  display: table;
  background-color: var(--light);
  border: 1px solid rgb(0, 0, 0);
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  width: calc(243px - 20px);
  height: calc(30px + 10px);
  margin: 10px;
}

.task:hover {
  background-color: #f5f5f5;
}

.task-details {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 0 0 4px 4px;
  margin-top: 8px;
}

.v-badge {
  width: 0px;
}

.green-day.has-tasks {
    background-color: lightgray; ;
}

.green-day.has-tasks.today {
  background-color: var(--primary) ;
}

.default-day {
    background-color: #ddd;
}
</style>