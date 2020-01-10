const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
ul{
  width: 100%;
  padding-left: 0;
}
li {
  list-style-type: none;
}
#chat {
  height: 400px;
  top: 0;
  background-color: grey;
  text-align: left;
  overflow: auto;
}
#input {
  padding-top: 10px;
  background-color: #2196F3;
  height: 80px;
}

</style>
<div id="chat">
<ul id="messages">
</ul>
</div>
<div id="input">
<textarea rows="3" cols="50" id="chatinput" name="chatmessage">
</textarea>
<button type="button" id="send">Send</button>
</div>
`

export default class ChatApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    this.chatMessages = this.shadowRoot.querySelector('#messages')
    this.chatMessage = this.shadowRoot.querySelector('#chatinput')
    this.chatSend = this.shadowRoot.querySelector('#send')
    this.chat = this.shadowRoot.querySelector('#chat')
    this.chatObj = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'Linus Torvalds',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.socket.addEventListener('open', this._connected)
    this.socket.addEventListener('message', (event) => {
      this._receive(event)
    })
    this.chatSend.addEventListener('click', (event) => {
      this._send()
    })
    this.chatMessage.addEventListener('click', (event) => {
      this.chatMessage.focus()
    })
    this.chatMessage.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) { this._send() }
    })
  }

  disconnectedCallback () {
    this.socket.close()
  }

  _updateRendering () {

  }

  _connected (event) {
    console.log('connected')
  }

  _receive (event) {
    const data = JSON.parse(event.data)
    if (data.type === 'message' || data.type === 'notification') {
      if (this.chatMessages.childNodes.length === 50) {
        this.chatMessages.removeChild(this.chatMessages.childNodes[1])
      }
      const li = document.createElement('li')
      li.appendChild(document.createTextNode(`${this._time()} ${data.username}: ${data.data}`))
      this.chatMessages.appendChild(li)
    }
  }

  _send (event) {
    const message = this.chatMessage.value
    if (message.length > 1) {
      this.chatMessage.value = ''
      this.chatObj.data = message
      this.socket.send(JSON.stringify(this.chatObj))
    } else {
      this.chatMessage.value = ''
    }
  }

  _time () {
    const date = new Date()
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return time
  }
}

window.customElements.define('chat-app', ChatApp)
