<template>
  <div class="all">
    <div class="calendar">
      <h2 class="calendar-header">
        <button @click="prevMonth">&lt;</button>
        {{ monthName }} {{ currentYear }}
        <button @click="nextMonth">&gt;</button>
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
                :class="[selectedDayClass, { 'today': isToday(day), 'has-tasks': hasTasks(day), 'current-day': isCurrentDay(day), 'empty-day': !day }]"
                @click="selectDay(day)">
                {{ day }}
                <template v-if="hasTasks(day)">
                  <div class="task-statuses">
                    <span class="completed">{{ getCompletedTasks(day) }} </span>
                    <span class="in-progress">{{ getInProgressTasks(day) }} </span>
                    <span class="not-completed">{{ getNotCompletedTasks(day) }} </span>
                  </div>
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
            <li v-for="task in tasksForSelectedDay" :key="task.id" :style="{ color: taskColor(task) }">
              <div>
                <strong>{{ task.name }}</strong>
                <br />
                Numer telefonu: {{ task.phone }}
                <br />
                Opis: {{ task.description }}
              </div>
            </li>
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

export default {
  components: {
    Modal
  },
  data() {
    return {
      currentDate: new Date(),
      currentYear: new Date().getFullYear(),
      showAddTaskModal: false,
      newTask: {
        date: '',
        name: '',
        description: '',
        phone: '',
        costs: '',
        status: '',
      },
      tasks: [],
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
      if (this.tasks && this.selectedDay) {
        const month = this.currentMonth + 1
        const monthString = month < 10 ? `0${month}` : month
        const dayString = this.selectedDay < 10 ? `0${this.selectedDay}` : this.selectedDay
        const dateString = `${this.currentYear}-${monthString}-${dayString}`
        return this.tasks.filter(task => task.date === dateString);
      }
      return [];
    }
  },
  methods: {
    isCurrentDay(day) {
      const currentDay = new Date().getDate();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      console.log(day)
      if (day === currentDay && this.currentMonth === currentMonth && this.currentYear === currentYear) {
        return true;
      }
      return false;
    },
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
      if (this.tasks) {
        const month = this.currentMonth + 1
        const monthString = month < 10 ? `0${month}` : month
        const dayString = day < 10 ? `0${day}` : day
        const dateString = `${this.currentYear}-${monthString}-${dayString}`
        if (this.tasks) {
          this.selectedDay = day
        }
      }
    },
    isToday(day) {
      return day === this.currentDate.getDate();
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
      return this.tasks.some(task => task.date.getDate() === day);
    },
    getCompletedTasks(day) {
      // Get the number of completed tasks for the selected day
      return this.tasks.filter(task => task.date.getDate() === day && task.status === 'completed').length;
    },
    getInProgressTasks(day) {
      // Get the number of in progress tasks for the selected day
      return this.tasks.filter(task => task.date.getDate() === day && task.status === 'in progress').length;
    },
    getNotCompletedTasks(day) {
      // Get the number of not completed tasks for the selected day
      return this.tasks.filter(task => task.date.getDate() === day && task.status === 'not started').length;
    },
    addTask() {
      // Add the new order to the orders
      if (this.newTask.name !== '' && this.newTask.date !== '') {
        this.tasks.push({
          id: this.tasks.length + 1,
          date: new Date(this.newTask.date),
          name: this.newTask.name,
          description: this.newTask.description,
          phone: this.newTask.phone,
          costs: this.newTask.costs,
          status: 'not started',
        })
        this.$emit('update:show-add-task-modal', false);
      } else {
        // show error message
        alert("Za mało informacji!");
        return false;
      }
      this.showAddTaskModal = false
      // Reset the form
      this.newTask = {
        date: '',
        name: '',
        description: '',
        phone: '',
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
  },
  created() {
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

.calendar .has-tasks {
  background-color: var(--gray);
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
  background-color: var(--primary);
  color: var(--light);
}

.task-statuses {
  display: flex;
  justify-content: space-between;
}

.task-statuses span {
  display: inline-block;
  width: 33%;
}

.completed {
  color: green;
}

.in-progress {
  color: gray;
}

.not-completed {
  color: red;
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
</style>