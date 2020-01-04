export default function (rows, cols, container) {
  let a
  let tiles = []
  let turn1
  let turn2
  let lastTile
  let pairs = 0
  let tries = 0

  tiles = getPictureArray(rows, cols)
  const bricks = document.querySelector('#memory-pic-template').content.firstElementChild
  tiles.forEach(function (tile, index) {
    a = document.importNode(bricks, true)

    container.appendChild(a)

    a.addEventListener('click', function (event) {
      event.preventDefault()
      const img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
      turnBrick(tile, img)
    })

    if ((index + 1) % cols === 0) {
      container.appendChild(document.createElement('br'))
    }
  })

  function turnBrick (tile, img) {
    if (turn2) {
      return
    }

    img.src = '/image/' + tile + '.png'

    if (!turn1) {
      turn1 = img
      lastTile = tile
    } else {
      if (img === turn1) {
        return
      }

      tries += 1
      turn2 = img

      if (tile === lastTile) {
        pairs += 1
        if (pairs === (cols * rows) / 2) {
          console.log('Winner! you won on ' + tries)
        }

        setTimeout(function () {
          turn1.parentNode.classList.add('removed')
          turn2.parentNode.classList.add('removed')
          turn1 = null
          turn2 = null
        }, 500)
      } else {
        setTimeout(function () {
          turn1.src = 'image/0.png'
          turn2.src = 'image/0.png'
          turn1 = null
          turn2 = null
        }, 500)
      }
    }
  }

  function getPictureArray (rows, cols) {
    const array = []
    for (let i = 1; i <= (rows * cols) / 2; i += 1) {
      array.push(i)
      array.push(i)
    }

    let currentIndex = array.length
    const zero = 0
    while (zero !== currentIndex) {
      const randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      const temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
}
