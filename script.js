const shelf = document.querySelector('.shelf')
const zone = document.querySelector('.zone')
let blocks = document.querySelectorAll('.block')

//отменяем запрет перетаскивания элементов в другие элементы
zone.ondragover = e => e.preventDefault()
shelf.ondragover = e => e.preventDefault()

// Записываем данные перетаскиваемого объекта
blocks.forEach(
  item => (item.ondragstart = e => e.dataTransfer.setData('id', e.target.id))
)
// block.ondragstart = e => e.dataTransfer.setData('id', e.target.id)

zone.ondrop = drop
shelf.ondrop = drop

function drop(e) {
  let itemId = e.dataTransfer.getData('id')
  //   e.target.append(document.getElementById(itemId))
  zone.append(document.getElementById(itemId))
  if (itemId != 'block-1') {
    drawLine(itemId)
  }
  //   drawLine()
}

blocks.forEach(item => {
  num1 = randomColor()
  num2 = randomColor()
  num3 = randomColor()
  item.style.backgroundColor = `rgb(${num1},${num2},${num3})`
})

function randomColor() {
  let max = 255
  let min = 0
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//===================================================================================
// Рисуем линию

function drawLine(id) {
  let blocks = document.querySelectorAll('.zone .block')

  //   let react = blocks[0].getBoundingClientRect()
  let react1 = blocks[blocks.length - 2].getBoundingClientRect()

  let react2 = blocks[blocks.length - 1].getBoundingClientRect()

  console.log(react1)
  console.log(react2)

  //   let line = document.querySelector('line')
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'

  let zoneY = zone.getBoundingClientRect().top
  let zoneX = zone.getBoundingClientRect().left

  line.setAttribute('x1', react1.left - zoneX + react1.width / 2)
  line.setAttribute('y1', react1.top - zoneY + react1.height)
  line.setAttribute('x2', react2.left - zoneX + react1.width / 2)
  line.setAttribute('y2', react2.top - zoneY)

  let svg = document.querySelector('svg')
  svg.append(line)
}
