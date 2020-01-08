const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
ul{
  width: 100%;
}
li {
  list-style-type: none;
  z-index: inherit;
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
<input type="text" id="chatinput" name="chatmessage" value="Mickey">
<button type="button">Send</button>
</div>
`

export default class ChatApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.messages = this.shadowRoot.querySelector('#messages')
    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
    this.chat = this.shadowRoot.querySelector('#chat')
    this.message = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'Anon',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.socket.addEventListener('open', this.connected)
    this.socket.addEventListener('message', (event) => {
      this.receive(event)
    })
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {

  }

  _updateRendering () {

  }

  connected (event) {
    console.log('connected')
  }

  receive (event) {
    const li = document.createElement('li')
    console.log(JSON.parse(event.data))
    const data = JSON.parse(event.data)
    li.appendChild(document.createTextNode(`${data.username}: ${data.data}`))
    this.messages.appendChild(li)
  }
}

window.customElements.define('chat-app', ChatApp)
