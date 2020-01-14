const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
ul{
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
}
li {
  list-style-type: none;
}
#chat {
  height: 400px;
  top: 0;
  background-color: white;
  text-align: left;
  overflow: auto;
}
#input {
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #2196F3;
  height: 100%;
}

</style>
<div id="chat">
<ul id="messages">
</ul>
</div>
<div id="input">
<textarea rows="2" cols="50" id="chatinput" name="chatmessage">
</textarea>
<button type="button" id="send">Send</button>
<button type="button" id="changeusername">Change username</button>
</div>
`

export default class ChatApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._chatMessages = this.shadowRoot.querySelector('#messages')
    this._chatMessage = this.shadowRoot.querySelector('#chatinput')
    this._chatSend = this.shadowRoot.querySelector('#send')
    this._chat = this.shadowRoot.querySelector('#chat')
    this._changeUsername = this.shadowRoot.querySelector('#changeusername')
    this._hasUsername = true
    this._name = ''
    this._chatObj = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: '',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this._socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    if (!window.localStorage.getItem('username')) {
      this._setUserNameInput()
    } else {
      this._chatObj.username = window.localStorage.getItem('username')
    }
    this._socket.addEventListener('open', this._connected)
    this._socket.addEventListener('message', (event) => {
      this._receive(event)
    })
    this._chatSend.addEventListener('click', (event) => {
      this._send()
    })
    this._changeUsername.addEventListener('click', (event) => {
      this._setUserNameInput()
    })
    this._chatMessage.addEventListener('click', (event) => {
      this._chatMessage.focus()
    })
    this._chatMessage.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) { this._send() }
    })
  }

  disconnectedCallback () {
    this._socket.close()
  }

  _updateRendering () {

  }

  _connected (event) {
    console.log('connected')
  }

  _receive (event) {
    const data = JSON.parse(event.data)
    if (data.type === 'message' || data.type === 'notification') {
      if (this._chatMessages.childNodes.length === 50) {
        this._chatMessages.removeChild(this._chatMessages.childNodes[1])
      }
      const li = document.createElement('li')
      li.appendChild(document.createTextNode(`${this._time()} ${data.username}: ${data.data}`))
      this._chatMessages.appendChild(li)
      this._chat.scrollTop = this._chat.scrollHeight
    }
  }

  _send (event) {
    // Set username, else chat
    if (this._hasUsername === false) {
      const username = this._chatMessage.value
      if (username.length > 0) {
        window.localStorage.setItem('username', this._chatMessage.value)
        this._chatMessage.value = ''
        this._chatObj.username = username
        this._removeUserNameInput()
      }
    } else {
      const message = this._chatMessage.value
      if (message.length > 1) {
        this._chatMessage.value = ''
        this._chatObj.data = message
        this._socket.send(JSON.stringify(this._chatObj))
      } else {
        this._chatMessage.value = ''
      }
    }
  }

  _time () {
    const date = new Date()
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return time
  }

  _setUserNameInput () {
    this._changeUsername.disabled = true
    this._chatMessage.value = ''
    this._hasUsername = false
    this._chatSend.textContent = 'Apply'
    const p = document.createElement('p')
    p.textContent = 'Enter username below!'
    this.shadowRoot.querySelector('#input').prepend(p)
  }

  _removeUserNameInput () {
    this._changeUsername.disabled = false
    this.shadowRoot.querySelector('#input').removeChild(this.shadowRoot.querySelector('#input').firstChild)
    this._chatSend.textContent = 'Chat'
    this._hasUsername = true
  }
}

window.customElements.define('chat-app', ChatApp)
