<template>
    <div class="container">
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
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Opis: <br /> {{ selectedTask.description }}</p>
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
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Opis: <br /> {{ selectedTask.description }}</p>
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
                    <div v-if="selectedTask === task" class="task-details">
                        <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                        <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                        <p>Opis: <br /> {{ selectedTask.description }}</p>
                    </div>
                </div>
            </div>
        </div>
   
    </div>
</template>
  
<script>
import Modal from '../components/addTask.vue';


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
                phone: '',
                costs: '',
                status: '',
            },
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
            console.log('Drag start')
            this.currentTask = task;
        },
        onDragEnd() {
            console.log('Drag end')
            this.currentTask = null;
        },
        onDragOver(event) {
            console.log('Drag over')
            event.preventDefault();
        },
        onDragEnter(event) {
            console.log('Drag enter')
            event.preventDefault();
        },
        onDrop(event) {
            console.log('Drop')
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
                alert("Za mało informacji! Podaj minimum datę i nazwę.");
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

.task-details {
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-radius: 0 0 4px 4px;
    margin-top: 8px;
}
</style>