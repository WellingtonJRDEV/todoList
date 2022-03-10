'use strict'

const getLocalStorage = () => {
  if (!JSON.parse(localStorage.getItem('db_tarefa'))) return []
  else return JSON.parse(localStorage.getItem('db_tarefa'))
}

const setLocalStorage = dbTarefa =>
  localStorage.setItem('db_tarefa', JSON.stringify(dbTarefa))

const deleteTarefa = indice => {
  const dbTarefa = readTarefa()
  dbTarefa.splice(indice, 1)
  setLocalStorage(dbTarefa)
}

const updateTarefa = (tarefa, indice) => {
  const dbTarefa = readTarefa()
  dbTarefa[indice] = tarefa
  setLocalStorage(dbTarefa)
}

const readTarefa = () => getLocalStorage()

const createTarefa = tarefa => {
  const dbTarefa = getLocalStorage()
  dbTarefa.push(tarefa)
  setLocalStorage(dbTarefa)
}

const isValidFields = () => {
  return document.getElementById('inputTarefa').reportValidity()
}

const clearInput = () => {
  const input = document.getElementById('inputTarefa')
  input.value = ''
}

//INTERAÇÕES
const saveTarefa = () => {
  if (isValidFields()) {
    const tarefa = {
      tarefa: document.getElementById('inputTarefa').value
    }
    const index = document.getElementById('inputTarefa').dataset.index
    if (index == 'new') {
      createTarefa(tarefa)
      clearInput()
      updateList()
    } else {
      updateTarefa(tarefa, index)
      updateList()
      clearInput()
    }
  }
}

const createList = (task, index) => {
  const li = document.createElement('li')
  li.innerHTML = `
    <div class="itemTarefa">
      <span>${task.tarefa}</span>
    </div>
    <div class="botoesAcaoTarefa">
      <button class="editar" type="button" id="edit-${index}">Editar</button>
      <button class="excluir" type="button" id="delete-${index}">Excluir</button>
    </div>
  `
  document.getElementById('listaTarefas').appendChild(li)
}

const clearList = () => {
  const lista = document.querySelectorAll('.listas>ul li')
  lista.forEach(li => li.parentNode.removeChild(li))
}

const updateList = () => {
  const dbClient = readTarefa()
  clearList()
  dbClient.forEach(createList)
}

const fillFields = task => {
  document.getElementById('inputTarefa').value = task.tarefa
  document.getElementById('inputTarefa').dataset.index = task.index
}

const editTarefa = index => {
  const tarefa = readTarefa()[index]
  tarefa.index = index
  fillFields(tarefa)
}

const editDelete = event => {
  if (event.target.type === 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editTarefa(index)
    } else {
      const response = confirm(`Deseja realmente excluir esta tarefa?`)
      if (response) {
        deleteTarefa(index)
        updateList()
      }
    }
  }
}

updateList()

//EVENTOS
document.getElementById('adicionarTarefa').addEventListener('click', saveTarefa)

document.getElementById('inputTarefa').addEventListener('keypress', e => {
  if (e.keyCode === 13) {
    saveTarefa()
  }
})

document.querySelector('.listas> ul').addEventListener('click', editDelete)
