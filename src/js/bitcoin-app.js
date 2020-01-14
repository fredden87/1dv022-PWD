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
#buttom {
  padding-top: 10px;
  background-color: #2196F3;
  height: 100%;
}
#total {
    padding-top: 10px;
}
</style>
<div id="bitcoin">
<ul id="messages">
</ul>
</div>
<div id="buttom">
<div id="price">Bitcoin price: </div>
<div id="total">Total transfered: </div>
</div>
`

export default class BitcoinApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._bitcoin = this.shadowRoot.querySelector('#bitcoin')
    this._bitcoinMessages = this.shadowRoot.querySelector('#messages')
    this._info = this.shadowRoot.querySelector('#info')
    this._price = this.shadowRoot.querySelector('#price')
    this._total = this.shadowRoot.querySelector('#total')
    this._totalBitcoins = 0
    this._socket = new window.WebSocket('wss://ws.blockchain.info/inv')
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    this._setBitcoinPrice()
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
        this._totalBitcoins = this._totalBitcoins + value
        this._total.textContent = `Total transfered: ${this._totalBitcoins.toFixed(2)} BTC`
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(`${value} ---> ${element.addr.substring(0, 25)}...`))
        this._bitcoinMessages.appendChild(li)
        this._bitcoin.scrollTop = this._bitcoin.scrollHeight
      }
    })
  }

  async _setBitcoinPrice () {
    const url = 'https://api.coindesk.com/v1/bpi/currentprice/SEK.json'
    const req = await window.fetch(url)
    const json = await req.json()
    console.log(json.bpi.SEK.rate)
    this._price.textContent = `Bitcoin price: ${json.bpi.SEK.rate} SEK`
  }
}
window.customElements.define('bitcoin-app', BitcoinApp)
