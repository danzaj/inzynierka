<template>
  <div v-if="showAddTaskModal" class="add-task-modal">
    <h2>Dodaj zlecenie</h2>
    <label>
      Data zakończenia:
      <input type="date" v-model="newTask.date" />
    </label>
    <br />
    <label>
      Nazwa:
      <input type="text" v-model="newTask.name" />
    </label>
    <br />
    <label>
      Opis:
      <textarea v-model="newTask.description"></textarea>
    </label>
    <br />
    <label>
      Numer telefonu:
      <input type="tel" v-model="newTask.phone" />
    </label>
    <br />
    <label>
      Szacowane koszty:
      <input type="text" v-model="newTask.costs" />
    </label>
    <br />
    <button @click="addTask">Dodaj zlecenie</button>
    <button @click="close">Anuluj</button>
  </div>
</template>
  
<script>
export default {
  props: ['showAddTaskModal', 'newTask', 'addTask', 'close'],
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

.add-task-modal input[type="text"],
.add-task-modal input[type="tel"],
.add-task-modal textarea {
  width: 100%;
  padding: 0.5em;
  border: 1px solid var(--gray);
}

.add-task-modal textarea {
  height: 5em;
}

.add-task-modal button {
  background-color: var(--primary);
  color: white;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-right: 10px;
}


.add-task-modal input,
.add-task-modal textarea {
  width: 100%;
  border-radius: 5px;
  border: 1px solid var(--dark-alt);
  padding: 10px;
  font-size: 16px;
}
</style>