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
#bitcoin {
  height: 400px;
  top: 0;
  background-color: white;
  text-align: left;
  overflow: auto;
}
</style>
<div id="bitcoin">
<ul id="messages">
</ul>
<div id="info"></div>
</div>
`

export default class BitcoinApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._bitcoin = this.shadowRoot.querySelector('#bitcoin')
    this._bitcoinMessages = this.shadowRoot.querySelector('#messages')
    this._socket = new window.WebSocket('wss://ws.blockchain.info/inv')
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    this._socket.addEventListener('open', (event) => {
      this._connected()
    })
    this._socket.addEventListener('message', (event) => {
      this._receive(event)
    })
  }

  disconnectedCallback () {
    this._socket.close()
  }

  _updateRendering () {

  }

  _connected (event) {
    this._socket.send(JSON.stringify({ op: 'unconfirmed_sub' }))
  }

  _receive (event) {
    const data = JSON.parse(event.data)
    data.x.out.forEach(element => {
      const value = Number(element.value + 'e-8')
      if (value > 0) {
        if (this._bitcoinMessages.childNodes.length === 50) {
          this._bitcoinMessages.removeChild(this._bitcoinMessages.childNodes[1])
        }
        console.log(`${value} ---> ${element.addr}`)
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(`${value} ---> ${element.addr}`))
        this._bitcoinMessages.appendChild(li)
        this._bitcoin.scrollTop = this._bitcoin.scrollHeight
      }
    })
  }
}
window.customElements.define('bitcoin-app', BitcoinApp)
