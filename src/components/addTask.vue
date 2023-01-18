<template>
  <div v-if="showAddTaskModal" class="add-task-modal">
    <h2>Dodaj zlecenie</h2>
    <label class = "dateeee">
      Data zakończenia:
      <input type="date" v-model="newTask.date" />
    </label>
    <label>
      <v-text-field
            v-model="newTask.name"
            label="Nazwa"
            required
            variant="underlined"
          ></v-text-field>
    </label>
    <label>
      <v-text-field
            v-model="newTask.phoneNumber"
            label="Kontakt"
            variant="underlined"
          ></v-text-field>
    </label>
    <label>
      <v-text-field
            v-model="newTask.costs"
            label="Szacowane koszty"
            variant="underlined"
          ></v-text-field>
    </label>
    <label>
      <v-row>
        <v-col cols="12">
          <v-combobox
            v-model="newTask.description"
            :items="items"
            label="Wybierz części do naprawy"
            multiple
            variant="underlined"
            chips
          ></v-combobox>
        </v-col>
      </v-row>
    </label>
    <button @click="addTask">Dodaj zlecenie</button>
    <button @click="close">Anuluj</button>
  </div>
</template>
  
<script>

export default {
  props: ['showAddTaskModal', 'newTask', 'addTask', 'close', 'showError',],
  data () {
    return {
      select: [],
      items: [
        'Wymiana dentki',
        'Wymiana opony',
        'Wymiana łańcucha',
      ],
    }
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

.dateeee input{
  border: 1px solid var(--dark-alt); 
  border-radius: 5px;
}

</style>