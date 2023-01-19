<template>
    <div class="completed-tasks-page">
        <h1>Historia zleceń</h1>
        <div class="search-bar">
            <input type="text" v-model="searchTerm" placeholder="Szukaj..." />
        </div>
        <div class="tasks-container">
            <div class="task" v-for="task in filteredTasks" :key="task.id"
                @click="selectedTask === task ? selectedTask = null : selectedTask = task">
                <div>{{ task.name }}</div>
                <div v-if="selectedTask === task" class="task-details">
                    <p>Data zakończenia: <br /> {{ selectedTask.date }}</p>
                    <p>Numer telefonu: <br /> {{ selectedTask.phoneNumber }}</p>
                    <p>Końcowa wycena: <br /> {{ selectedTask.costs }}</p>
                    <p>Opis: <br /> {{ selectedTask.description /* .join(', ') */ }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            tasks: [
                { id: 1, name: 'Task 1', status: 'completed', date: '2023-01-05', phoneNumber: '123-456-789', description: 'This is a description of task 1' },
                { id: 2, name: 'Task 2', status: 'completed', date: '2023-01-04', phoneNumber: '123-456-789', description: 'This is a description of task 2' },
                { id: 3, name: 'Task 3', status: 'completed', date: '2023-01-03', phoneNumber: '123-456-789', description: 'This is a description of task 3' },
                { id: 4, name: 'Task 4', status: 'completed', date: '2023-01-02', phoneNumber: '123-456-789', description: 'This is a description of task 4' },
                { id: 5, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 6, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 7, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 8, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 9, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 10, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 11, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 12, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 13, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
                { id: 14, name: 'Task 5', status: 'completed', date: '2023-01-01', phoneNumber: '123-456-789', description: 'This is a description of task 5' },
            ],
            searchTerm: '',
            selectedTask: null,
        }
    },
    computed: {
        filteredTasks() {
            let completedTasks = this.tasks.filter(task => task.status === 'completed');
            return completedTasks.filter(task => task.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }
    }
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
</style>