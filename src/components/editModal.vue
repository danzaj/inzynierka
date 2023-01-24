<template>
    <div v-if="showEditTaskModal" class="add-task-modal">
        <h2>Edytuj zlecenie</h2>
        <label class="dateeee">
            Data zakończenia:
            <input type="date" v-model="newTask.date" />
        </label>
        <label>
            <v-text-field v-model="newTask.name" label="Nazwa" required variant="underlined"></v-text-field>
        </label>
        <label>
            <v-text-field v-model="newTask.phoneNumber" label="Kontakt" variant="underlined"></v-text-field>
        </label>
        <label>
            <v-text-field v-model="newTask.costs" label="Szacowane koszty" variant="underlined"></v-text-field>
        </label>
        <label>
            <v-row>
                <v-col cols="12">
                    <v-combobox v-model="newTask.description" :items="items" label="Wybierz części do naprawy" multiple
                        variant="underlined" chips></v-combobox>
                </v-col>
            </v-row>
        </label>
        <button @click="editTask(newTask)">Edytuj</button>
        <button @click="close">Anuluj</button>
    </div>
</template>
  
<script>
import axios from 'axios';
import moment from 'moment'

export default {
    props: ['showEditTaskModal', 'newTask', 'close', 'showError',],
    data() {
        return {
            select: [],
            items: [
                'Wymiana dentki',
                'Wymiana opony',
                'Wymiana łańcucha',
            ],
        }
    },
    methods: {
        async editTask(task) {
            try {
                // this.newTask.date = moment(this.newTask.date).format('YYYY-MM-DD');
                const response = await axios.put(`http://localhost:3001/tasks/${task.id}`, {
                    name: task.name,
                    date: task.date,
                    phoneNumber: task.phoneNumber,
                    costs: task.costs,
                    description: task.description,
                    status: task.status
                });
                this.$emit('tasksUpdated');
                console.log(response.data.message);
            } catch (error) {
                console.error(error);
            }
        },
    }
}
</script>

<style>
.add-task-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid var(--gray);
    border-radius: 5px;
    padding: 20px;
    z-index: 20;
}

.add-task-modal label {
    display: block;
    margin-bottom: 10px;
}

.add-task-modal button {
    background-color: var(--primary);
    color: white;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    margin-right: 10px;
}

.add-task-modal input {
    width: 100%;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
}

.dateeee input {
    border: 1px solid var(--dark-alt);
    border-radius: 5px;
}
</style>