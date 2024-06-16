<template>
  <v-data-table :headers="headers" :items="equipments" :sort-by="[{ key: 'name', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Equipment Management</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props"> New Item </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.name" label="Equipment Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.category" label="Category"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.status" label="Status"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.location" label="Location"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-date-input
                      v-model="editedItem.lastMaintenanceDate"
                      label="Last Maintenance Date"
                    ></v-date-input>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.rentalRate"
                      label="Rental Rate"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)" icon="mdi-pencil" />
      <v-icon size="small" @click="deleteItem(item)" icon="mdi-delete" />
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick, reactive } from 'vue'
import api from '../services/api'

const dialog = ref(false)
const dialogDelete = ref(false)
const headers = [
  { title: 'Id', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Category', key: 'category' },
  { title: 'Status', key: 'status' },
  { title: 'Location', key: 'location' },
  { title: 'Last Maintenance Date', key: 'lastMaintenanceDate' },
  { title: 'Rental Rate', key: 'rentalRate' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const equipments = ref([])
const editedIndex = ref(-1)
const editedItem = ref({
  id: 0,
  name: '',
  category: '',
  status: '',
  location: '',
  lastMaintenanceDate: new Date().toJSON(),
  rentalRate: 0
})

const defaultItem = {
  id: 0,
  name: '',
  category: '',
  status: '',
  location: '',
  lastMaintenanceDate: new Date().toJSON(),
  rentalRate: 0
}

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Item' : 'Edit Item'
})

watch(dialog, (val) => {
  val || close()
})

watch(dialogDelete, (val) => {
  val || closeDelete()
})

onMounted(() => {
  initialize()
})

const initialize = async () => {
  const allEquipments = await api.get('/equipment').then((response) => {
    equipments.value = response.data
  })
}

const editItem = (item) => {
  editedIndex.value = equipments.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

const deleteItem = (item) => {
  editedIndex.value = equipments.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

const deleteItemConfirm = async () => {
  const equipmentDelete = await api.delete('/equipment/' + editedItem.value.id)
  if (equipmentDelete) {
    equipments.value.splice(editedIndex.value, 1)
    closeDelete()
  }
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem)
    editedIndex.value = -1
  })
}

const closeDelete = () => {
  dialogDelete.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem)
    editedIndex.value = -1
  })
}

const save = async () => {
  if (editedIndex.value > -1) {
    const equipmentUpdate = await api.put('/equipment/' + editedItem.value.id, editedItem.value)
    if (equipmentUpdate) {
      equipments.value[editedIndex.value] = editedItem.value
    }
  } else {
    const equipmentAdd = await api.post('/equipment/', editedItem.value)
    if (equipmentAdd) {
      equipments.value.push(editedItem.value)
    }
  }
  close()
}
</script>
