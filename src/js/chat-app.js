const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
ul{
  width: 100%;
}
li {
  list-style-type: none;
}
#chat {
  height: 340px;
  top: 0;
  background-color: grey;
  text-align: left;
}
#input {
  background-color: green;
}

</style>
<div id="chat">
<ul id="messages">
</ul>
</div>
<div id="input">
<input type="text" id="chatinput" name="chatmessage">
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
      const li = document.createElement('li')
      li.appendChild(document.createTextNode(`${data.username}: ${data.data}`))
      this.chatMessages.appendChild(li)
    }
  }

  _send (event) {
    const message = this.chatMessage.value
    if (message) {
      this.chatMessage.value = ''
      this.chatObj.data = message
      this.socket.send(JSON.stringify(this.chatObj))
    }
  }
}

window.customElements.define('chat-app', ChatApp)
