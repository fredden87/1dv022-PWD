import './window-handler.js'
import './chat-app.js'

// Make the DIV element draggable:
const windowHandler = document.createElement('window-handler')
document.querySelector('#container').prepend(windowHandler)
windowHandler.component = document.createElement('chat-app')
