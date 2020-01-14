import './window-handler.js'
import './chat-app.js'
import './bitcoin-app.js'
import Memory from './Memory.js'

document.querySelector('#memory').addEventListener('click', startMemory)
document.querySelector('#chat').addEventListener('click', startChat)
document.querySelector('#bitcoin').addEventListener('click', startBitcoin)

// Starts a memory window
function startMemory () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
  const template = document.querySelector('#memory-template').content.firstElementChild
  const container = template.cloneNode(true)
  Memory(4, 4, container)
  windowHandler.icon = '/image/memory.svg'
  windowHandler.name = 'Memory'
  windowHandler.component = container
}

// Starts a chat window
function startChat () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
  windowHandler.icon = '/image/chat.svg'
  windowHandler.name = 'Chat'
  windowHandler.component = document.createElement('chat-app')
}

// Starts a bitcoin window
function startBitcoin () {
  const windowHandler = document.createElement('window-handler')
  document.querySelector('#container').prepend(windowHandler)
  windowHandler.icon = '/image/bitcoin.svg'
  windowHandler.name = 'Bitcoin'
  windowHandler.component = document.createElement('bitcoin-app')
}
