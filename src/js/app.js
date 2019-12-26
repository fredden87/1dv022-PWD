import './window-handler.js'
import './chat-app.js'

document.querySelector('#memory').addEventListener('click', startMemory)
document.querySelector('#chat').addEventListener('click', startChat)
document.querySelector('#webcam').addEventListener('click', startWebcam)

function startMemory () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
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
