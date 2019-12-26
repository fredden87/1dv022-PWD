const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
  
#app {
    background-color: #f1f1f1;
    text-align: center;
  }

#appheader {
    padding: 5px;
    cursor: move;
    background-color: #2196F3;
    color: #fff;
  }
</style>
<div id="app">
<div id="appheader">Click here to move</div>
</div>
`

export default class WindowHandler extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  set component (component) {
    this.shadowRoot.querySelector('#app').appendChild(component)
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    this._pos1 = 0; this._pos2 = 0; this._pos3 = 0; this._pos4 = 0
    this._appHeader = this.shadowRoot.querySelector('#appheader')
    // this._appHeader.addEventListener('mousedown', this._drag)
    this.addEventListener('mousedown', this._dragMouseDown)
  }

  _updateRendering () {

  }

  _dragMouseDown (event) {
    // event = event || window.event
    event.preventDefault()
    // get the mouse cursor position at startup:
    this._pos3 = event.clientX
    this._pos4 = event.clientY
    event.target.onmouseup = this._closeDragElement
    // call a function whenever the cursor moves:
    event.target.onmousemove = this._elementDrag
  }

  _elementDrag (event) {
    // event = event || window.event
    event.preventDefault()
    // calculate the new cursor position:
    this._pos1 = this._pos3 - event.clientX
    this._pos2 = this._pos4 - event.clientY
    this._pos3 = event.clientX
    this._pos4 = event.clientY
    // set the element's new position:
    event.target.style.top = `${(event.target.offsetTop - this._pos2)}px`
    event.target.style.left = `${(event.target.offsetLeft - this._pos1)}px`
  }

  _closeDragElement (event) {
    // stop moving when mouse button is released:
    event.target.onmouseup = null
    event.target.onmousemove = null
  }
}

window.customElements.define('window-handler', WindowHandler)
