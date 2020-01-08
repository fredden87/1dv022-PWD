const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
li {
    list-style-type: none;
}
#chat {
  height: 350px;
  background-color: green;
}
</style>
<div id="chat">
<ul id="messages">
</ul>
</div>
<div id="footer">hej</div>
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
