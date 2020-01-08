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
    this.messages = this.shadowRoot.querySelector('#messages')
    this.chat = this.shadowRoot.querySelector('#chat')
    this.message = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'Anon',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.socket.addEventListener('open', this._connected)
    this.socket.addEventListener('message', (event) => {
      this._receive(event)
    })
    this.shadowRoot.querySelector('#send').addEventListener('click', this._send)
    this.shadowRoot.querySelector('#chatinput').addEventListener('click', (event) => {
      this.shadowRoot.querySelector('#chatinput').focus()
    })
  }

  _updateRendering () {

  }

  _connected (event) {
    console.log('connected')
  }

  _receive (event) {
    const li = document.createElement('li')
    console.log(JSON.parse(event.data))
    const data = JSON.parse(event.data)
    li.appendChild(document.createTextNode(`${data.username}: ${data.data}`))
    this.messages.appendChild(li)
  }

  _send (event) {
    console.log('clocked')
  }
}

window.customElements.define('chat-app', ChatApp)
