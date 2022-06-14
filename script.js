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
  if (itemId == 'block-2') {
    drawLine()
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

// blocks[1].onmouseup = function () {
//   drawLine()
// }
// blocks[1].onmousedown = function (event) {
//   console.log('нажали')
// }
// blocks[1].onmouseup = function () {
//   drawLine()
//   console.log('отпустили')
// }
//===================================================================================
// Рисуем линию

function drawLine() {
  let blocks = document.querySelectorAll('.block')
  let react = blocks[0].getBoundingClientRect()
  let react2 = blocks[1].getBoundingClientRect()
  let line = document.querySelector('line')
  let zoneY = zone.getBoundingClientRect().top
  let zoneX = zone.getBoundingClientRect().left

  line.setAttribute('x1', react.left - zoneX + react.width / 2)
  line.setAttribute('y1', react.top - zoneY + react.height)
  line.setAttribute('x2', react2.left - zoneX + react.width / 2)
  line.setAttribute('y2', react2.top - zoneY)
}
