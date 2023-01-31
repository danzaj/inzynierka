<template>
    <div class="container">
        <div>
            <v-timeline side="end">
                <v-timeline-item v-for="task in tasks.filter(task => task.status != 'completed').sort(function(a, b) { return new Date(a.date) - new Date(b.date) })" :key="task.id"
                    :dot-color="getDotColor(task.status)">
                    <span slot="opposite">{{ new Date(task.date).toISOString().slice(0, 10) }}</span>
                    <v-card class="elevation-2">
                        <v-card-title class="headline">{{ task.name }}</v-card-title>
                        <v-card-text>
                            {{ task.description }}
                        </v-card-text>
                    </v-card>
                </v-timeline-item>
            </v-timeline>
        </div>
        <div class="column" data-status="notStarted" @dragover="onDragOver" @dragenter="onDragEnter" @drop="onDrop">
            <div class="column-bg">
                <h2 class="header-notStarted" draggable="false">Nie zaczęte</h2>
                <button class="plus" @click="showAddTaskModal = true">Dodaj zlecenie</button>
                <modal v-bind:show-add-task-modal="showAddTaskModal" v-bind:new-task="newTask" v-bind:add-task="addTask"
                    @tasksUpdated="refreshTasks" v-bind:close="close"></modal>
                <div v-for="task in tasks.filter(task => task.status === 'notStarted')" :key="task.id" class="task"
                    draggable="true" @dragstart="onDragStart(task)" @dragend="onDragEnd" @dragenter="onDragEnter"
                    @dragover="onDragOver" @drop="onDrop"
                    @click="selectedTask === task && !showEditTaskModal ? selectedTask = null : selectedTask = task">
                    <div>{{ task.name }}</div>
                    <div v-if="selectedTask === task" class="task-buttons-pos">
                        <v-btn color="gray" variant="plain" @click="editTask(selectedTask)">Edytuj</v-btn>
                        <editModal v-if="showEditTaskModal" v-bind:show-edit-task-modal="showEditTaskModal"
                            v-bind:new-task="selectedTask" v-bind:edit-task="editTask"
                            @tasksUpdated="showEditTaskModal = false" v-bind:close="close"></editModal>
                        <v-btn color="error" variant="plain" @click="deleteTask(selectedTask)">Usuń</v-btn>
                    </div>
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ new Date(selectedTask.date).toISOString().slice(0, 10) }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Szacowana wycena: <br /> {{ selectedTask.costs }}</p>
                        <p>Opis: <br /> {{ selectedTask.description}}</p>
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
                    @click="selectedTask === task && !showEditTaskModal ? selectedTask = null : selectedTask = task">
                    <div>{{ task.name }}</div>
                    <div v-if="selectedTask === task" class="task-buttons-pos">
                        <v-btn color="gray" variant="plain" @click="editTask(selectedTask)">Edytuj</v-btn>
                        <editModal v-if="showEditTaskModal" v-bind:show-edit-task-modal="showEditTaskModal"
                            v-bind:new-task="selectedTask" v-bind:edit-task="editTask"
                            @tasksUpdated="showEditTaskModal = false" v-bind:close="close"></editModal>
                        <v-btn color="error" variant="plain" @click="deleteTask(selectedTask)">Usuń</v-btn>
                    </div>
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ new Date(selectedTask.date).toISOString().slice(0, 10) }}</p>
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
                <div v-for="task in tasks.filter(task => task.status === 'completed' && ((Date.now() - new Date(task.date).getTime()) < 432000000))" :key="task.id" class="task"
                    draggable="true" @dragstart="onDragStart(task)" @dragend="onDragEnd" @dragenter="onDragEnter"
                    @dragover="onDragOver" @drop="onDrop"
                    @click="selectedTask === task && !showEditTaskModal ? selectedTask = null : selectedTask = task">
                    <div>{{ task.name }}</div>
                    <div v-if="selectedTask === task" class="task-buttons-pos">
                        <v-btn color="gray" variant="plain" @click="editTask(selectedTask)">Edytuj</v-btn>
                        <editModal v-if="showEditTaskModal" v-bind:show-edit-task-modal="showEditTaskModal"
                            v-bind:new-task="selectedTask" v-bind:edit-task="editTask"
                            @tasksUpdated="showEditTaskModal = false" v-bind:close="close"></editModal>
                        <v-btn color="error" variant="plain" @click="deleteTask(selectedTask)">Usuń</v-btn>
                    </div>
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ new Date(selectedTask.date).toISOString().slice(0, 10) }}</p>
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
import editModal from '../components/editModal.vue'
import moment from 'moment'
import axios from 'axios';

export default {
    components: {
        Modal,
        editModal
    },
    data() {
        return {
            tasks: [],
            currentTask: null,
            selectedTask: null,
            mouseDown: false,
            showAddTaskModal: false,
            showEditTaskModal: false,
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
    created() {
        axios.get('http://localhost:3001/tasks/all')
            .then(response => {
                console.log(response)
                //this.response.data = moment(this.newTask.date).format('YYYY-MM-DD')
                this.tasks = response.data;
                console.log(this.tasks)
            })
            .catch(error => {
                console.log(error);
            });
    },
    computed: {
        notStartedTasks() {
            return this.tasks.filter(task => task.status === 'notStarted');
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
            console.log('drag start')
            this.currentTask = task;
        },
        onDragEnd() {
            console.log('drag end')
            this.currentTask = null;
        },
        onDragOver(event) {
            console.log('drag over')
            event.preventDefault();
        },
        onDragEnter(event) {
            console.log('drag enter')
            event.preventDefault();
        },
        onDrop(event) {
            console.log('drop')
            event.preventDefault();
            const status = event.currentTarget.getAttribute('data-status');
            this.currentTask.status = status;
            this.tasks = this.tasks.map(task => {
                if (task.id === this.currentTask.id) {
                    this.updateTaskStatus(task, status)
                    return this.currentTask;
                }
                //this.updateTaskStatus(task, status)
                return task;
            });
        },
        async refreshTasks() {
            axios.get('http://localhost:3001/tasks/all')
                .then((response) => {
                    // this.newTask.date = moment(this.newTask.date).format('YYYY-MM-DD')
                    this.tasks = response.data
                })
                .catch((err) => { console.log(err) })
        },
        async updateTaskStatus(task, status) {
            task.date = moment(task.date).format('YYYY-MM-DD')
            axios.put(`http://localhost:3001/tasks/${task.id}`, { 
                    name: task.name,
                    date: task.date,
                    phoneNumber: task.phoneNumber,
                    costs: task.costs,
                    description: task.description,
                    status: status })
                .then(response => {
                    this.refreshTasks()
                })
                .catch((err) => { console.log(err) })
        },
        async removeTask(id) {
            try {
                const response = await axios.delete(`http://localhost:3001/tasks/${id}`);
                console.log(response.data.message);
            } catch (error) {
                console.error(error);
            }
        },
        close() {
            this.showAddTaskModal = false;
            this.showEditTaskModal = false;
            this.refreshTasks()
            this.newTask = {
                date: '',
                name: '',
                description: '',
                phoneNumber: '',
                costs: 0,
            };
        },
        addTask() {
            // Add the new order to the orders
            if (this.newTask.name !== '' && this.newTask.date !== '') {
                console.log(newTask.date)
                this.tasks.push({
                    id: this.tasks.length + 1,
                    date: moment(new Date()).format('YYYY-MM-DD'),
                    name: this.newTask.name,
                    description: this.newTask.description,
                    phoneNumber: this.newTask.phoneNumber,
                    costs: Number(this.newTask.costs),
                    status: 'notStarted',
                })
                this.$emit('update:show-add-task-modal', false);
                console.log(this.tasks.date)
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
                costs: 0,
            };
        },
        getDotColor(status) {
            if (status === 'notStarted') return 'red'
            if (status === 'in progress') return 'orange'
            return 'gray'
        },
        editTask(task) {
            this.task = Object.assign({}, task);
            console.log(task)
            this.showEditTaskModal = true;
        },
        deleteTask(task) {
            let index = this.tasks.indexOf(task);
            this.tasks.splice(index, 1);
            this.removeTask(task.id)
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

.elevation-2 {
    max-width: 300px;
}
</style>