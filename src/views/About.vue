<template>
    <div class="container">
        <div>

            <v-timeline side="end">
                <v-timeline-item v-for="task in tasks.filter(task => task.status != 'completed')" :key="task.id"
                    :dot-color="getDotColor(task.status)">
                    <span slot="opposite">{{ task.date }}</span>
                    <v-card class="elevation-2">
                        <v-card-title class="headline">{{ task.name }}</v-card-title>
                        <v-card-text>
                            {{ task.description }}
                        </v-card-text>
                    </v-card>
                </v-timeline-item>
            </v-timeline>
        </div>
        <div class="column" data-status="not started" @dragover="onDragOver" @dragenter="onDragEnter" @drop="onDrop">
            <div class="column-bg">
                <h2 class="header-notStarted" draggable="false">Nie zaczęte</h2>
                <button class="plus" @click="showAddTaskModal = true">Dodaj zlecenie</button>
                <modal v-bind:show-add-task-modal="showAddTaskModal" v-bind:new-task="newTask" v-bind:add-task="addTask"
                    v-bind:close="close"></modal>
                <div v-for="task in tasks.filter(task => task.status === 'not started')" :key="task.id" class="task"
                    draggable="true" @dragstart="onDragStart(task)" @dragend="onDragEnd" @dragenter="onDragEnter"
                    @dragover="onDragOver" @drop="onDrop"
                    @click="selectedTask === task ? selectedTask = null : selectedTask = task">
                    <div>{{ task.name }}</div>
                    <div v-if="selectedTask === task" class="task-buttons-pos">
                        <v-btn color="gray" variant="plain" @click="editTask(selectedTask)">Edytuj</v-btn>
                        <v-btn color="error" variant="plain" @click="deleteTask(selectedTask)">Usuń</v-btn>
                    </div>
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Szacowana wycena: <br /> {{ selectedTask.costs }}</p>
                        <p>Opis: <br /> {{ selectedTask.description /* .join(', ') */ }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="column" data-status="in progress" @dragover="onDragOver" @dragenter="onDragEnter" @drop="onDrop">
            <div class="column-bg">
                <h2 class="header-inProgress" draggable="false">W trakcie</h2>
                <div v-for="task in tasks.filter(task => task.status === 'in progress')" :key="task.id" class="task"
                    draggable="true" @dragstart="onDragStart(task)" @dragend="onDragEnd" @dragenter="onDragEnter"
                    @dragover="onDragOver" @drop="onDrop"
                    @click="selectedTask === task ? selectedTask = null : selectedTask = task">
                    <div>{{ task.name }}</div>
                    <div v-if="selectedTask === task" class="task-buttons-pos">
                        <v-btn color="gray" variant="plain" @click="editTask(selectedTask)">Edytuj</v-btn>
                        <v-btn color="error" variant="plain" @click="deleteTask(selectedTask)">Usuń</v-btn>
                    </div>
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Szacowana wycena: <br /> {{ selectedTask.costs }}</p>
                        <p>Opis: <br /> {{ selectedTask.description /* .join(', ') */ }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="column" data-status="completed" @dragover="onDragOver" @dragenter="onDragEnter" @drop="onDrop">
            <div class="column-bg">
                <h2 class="header-Completed" draggable="false">Zakończone</h2>
                <div v-for="task in tasks.filter(task => task.status === 'completed')" :key="task.id" class="task"
                    draggable="true" @dragstart="onDragStart(task)" @dragend="onDragEnd" @dragenter="onDragEnter"
                    @dragover="onDragOver" @drop="onDrop"
                    @click="selectedTask === task ? selectedTask = null : selectedTask = task">
                    <div>{{ task.name }}</div>
                    <div v-if="selectedTask === task" class="task-buttons-pos">
                        <v-btn color="gray" variant="plain" @click="editTask(selectedTask)">Edytuj</v-btn>
                        <v-btn color="error" variant="plain" @click="deleteTask(selectedTask)">Usuń</v-btn>
                    </div>
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Szacowana wycena: <br /> {{ selectedTask.costs }}</p>
                        <p>Opis: <br /> {{ selectedTask.description /* .join(', ') */ }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import Modal from '../components/addTask.vue';
import moment from 'moment'

export default {
    components: {
        Modal
    },
    data() {
        return {
            tasks: [
                { id: 1, name: 'Task 1', status: 'not started', date: '2023-01-05', phoneNumber: '123-456-789', description: 'This is a description of task 1' },
                { id: 2, name: 'Task 2', status: 'completed', date: '2023-01-04', phoneNumber: '123-456-789', description: 'This is a description of task 2' },
                { id: 3, name: 'Task 3', status: 'in progress', date: '2023-01-03', phoneNumber: '123-456-789', description: 'This is a description of task 3' },
                { id: 4, name: 'Task 4', status: 'not started', date: '2023-01-02', phoneNumber: '123-456-789', description: 'This is a description of task 4' },
                { id: 5, name: 'Task 5', status: 'not started', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
            ].sort((a, b) => new Date(a.date) - new Date(b.date)),
            currentTask: null,
            showTaskModal: false,
            selectedTask: null,
            mouseDown: false,
            showAddTaskModal: false,
            newTask: {
                date: '',
                name: '',
                description: '',
                phoneNumber: '',
                costs: '',
                status: '',
            },
            showError: false,
        };
    },
    computed: {
        notStartedTasks() {
            return this.tasks.filter(task => task.status === 'not started');
        },
        inProgressTasks() {
            return this.tasks.filter(task => task.status === 'in progress');
        },
        completedTasks() {
            return this.tasks.filter(task => task.status === 'completed');
        },
    },
    methods: {
        onDragStart(task) {
            this.currentTask = task;
        },
        onDragEnd() {
            this.currentTask = null;
        },
        onDragOver(event) {
            event.preventDefault();
        },
        onDragEnter(event) {
            event.preventDefault();
        },
        onDrop(event) {
            event.preventDefault();
            const status = event.currentTarget.getAttribute('data-status');
            this.currentTask.status = status;
            this.tasks = this.tasks.map(task => {
                if (task.id === this.currentTask.id) {
                    return this.currentTask;
                }
                return task;
            });
        },
        close() {
            this.showAddTaskModal = false;
        },
        addTask() {
            // Add the new order to the orders
            if (this.newTask.name !== '' && this.newTask.date !== '') {
                let formattedDate = moment().format('DD-MM-YYYY');
                this.tasks.push({
                    id: this.tasks.length + 1,
                    date: formattedDate,
                    name: this.newTask.name,
                    description: this.newTask.description,
                    phoneNumber: this.newTask.phoneNumber,
                    costs: this.newTask.costs,
                    status: 'not started',
                })
                this.$emit('update:show-add-task-modal', false);
                this.showError = false
                console.log(this.showError)
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
        getDotColor(status) {
            if (status === 'not started') return 'red'
            if (status === 'in progress') return 'orange'
            return 'gray'
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
};
</script>

<style>
.container {
    display: flex;
    width: 100%;
}

.column {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    background-color: var(--light);
}

.column-bg {
    background-color: rgb(118, 128, 131);
    border-radius: 10px;
    min-height: 100px;
}

.plus {
    display: table;
    background-color: var(--light);
    border: 1px solid rgb(0, 0, 0);
    padding: 20px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
    text-align: center;
    width: calc(100% - 20px);
    height: 64px;
    margin: 10px;
    margin-bottom: 30px;
}

.plus:hover {
    background-color: #f5f5f5;
}

.task {
    display: table;
    background-color: var(--light);
    border: 1px solid rgb(0, 0, 0);
    padding: 20px;
    border-radius: 10px;
    cursor: grab;
    font-size: 18px;
    text-align: center;
    width: calc(100% - 20px);
    height: calc(30px + 10px);
    /* add 10px to the height of each task */
    margin: 10px;
}

.task:hover {
    background-color: #f5f5f5;
}

.task[dragging] {
    opacity: 0.5;
    cursor: grabbing;
}

.task-details {
    display: flex;
    flex-direction: column;
    border-radius: 0 0 4px 4px;
}

.header {
    text-align: center;
    margin: 0;
    padding: 10px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.header-notStarted {
    color: white;
    margin-bottom: 10px;
    margin: 0;
    padding: 10px;
    text-align: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: var(--primary);
}

.header-inProgress {
    color: white;
    margin-bottom: 10px;
    margin: 0;
    padding: 10px;
    text-align: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: rgb(253, 172, 21);
}

.header-Completed {
    color: white;
    margin-bottom: 10px;
    margin: 0;
    padding: 10px;
    text-align: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: rgb(11, 129, 11);
}

.v-timeline {
    padding: 10px;
}

.task-buttons-pos {
    display: flex;
    justify-content: space-evenly;
}
</style>