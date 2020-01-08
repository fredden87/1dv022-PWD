const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
</style>
<div id="chat">
hej
</div>
`

export default class ChatApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
    this.message = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'Anon',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.socket.addEventListener('open', function (event) {
      console.log(event)
    })

    this.socket.addEventListener('message', this.receive(this.event))
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

  receive (event) {
    console.log(this.data)
  }
}

window.customElements.define('chat-app', ChatApp)
