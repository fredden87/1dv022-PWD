import './window-handler.js'
import './chat-app.js'
import Memory from './Memory.js'

document.querySelector('#memory').addEventListener('click', startMemory)
document.querySelector('#chat').addEventListener('click', startChat)
document.querySelector('#webcam').addEventListener('click', startWebcam)

function startMemory () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
  const template = document.querySelector('#memory-template').content.firstElementChild
  const container = template.cloneNode(true)
  Memory(2, 2, container)
  windowHandler.component = container
}

function startChat () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
  windowHandler.component = document.createElement('chat-app')
}
function startWebcam () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
}
