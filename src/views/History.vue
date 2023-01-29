<template>
    <div class="completed-tasks-page">
        <h1 class="page-header">Historia zleceń</h1>
        <div class="search-bar">
            <input type="text" v-model="searchTerm" placeholder="Szukaj..." />
        </div>
        <div class="tasks-container">
            <div class="task" v-for="task in filteredTasks" :key="task.id"
                @click="selectedTask === task ? selectedTask = null : selectedTask = task"
                :class="{ 'selected': selectedTask === task }">
                <div class="task-name">{{ task.name }}</div>
                <div v-if="selectedTask === task" class="task-details">
                    <p>Data zakończenia: <br /> <strong>{{ selectedTask.date }}</strong></p>
                    <p>Numer telefonu: <br /> <strong>{{ selectedTask.phoneNumber }}</strong></p>
                    <p>Końcowa wycena: <br /> <strong>{{ selectedTask.costs }}</strong></p>
                    <p>Opis: <br /> <strong>{{ selectedTask.description /* .join(', ') */ }}</strong></p>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            tasks: [],
            searchTerm: '',
            selectedTask: null,
        }
    },
    created() {
        axios.get('http://localhost:3001/tasks/completed')
            .then(response => {
                this.tasks = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    computed: {
        filteredTasks() {
            return this.tasks.filter(task => task.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }
    },
}
</script>
  
<style>
.completed-tasks-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-bar {
    width: 80%;
    margin-bottom: 20px;
}

.search-bar input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 10px;
    font-size: 16px;
}

.tasks-container{
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.task {
    width: 500px;
    min-height: 70px;
}
</style>