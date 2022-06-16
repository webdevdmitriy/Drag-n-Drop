const shelf = document.querySelector('.shelf')
const zone = document.querySelector('.zone ')
const zones = document.querySelectorAll('.zone div')
let dragsItems = document.querySelectorAll('.dragItem')

//отменяем запрет перетаскивания элементов в другие элементы

zones.forEach(item => (item.ondragover = e => e.preventDefault()))

// Перетаскиваемые объекты
dragsItems.forEach(item => {
  item.addEventListener('dragstart', handlerDragStart)
  item.addEventListener('dragend', handlerDragEnd)
})

// Зоны для перетаскивания объектов
zones.forEach(dropZone => {
  dropZone.addEventListener('drop', handlerDrop)
  dropZone.addEventListener('dragenter', handlerDragEnter)
  dropZone.addEventListener('dragleave', handlerDragLeave)
})

function handlerDragStart(e) {
  e.dataTransfer.setData('item', e.target.dataset.item)
  e.dataTransfer.setData('zone', e.target.dataset.zone)

  let zoneId = this.dataset.zone

  zones.forEach(item => {
    if (item.dataset.zone != zoneId) item.classList.add('dark-background')
  })
}

function handlerDragEnd(e) {
  zones.forEach(item => {
    item.classList.remove('dark-background')
  })
}

function handlerDrop(e) {
  let item = e.dataTransfer.getData('item')
  let zoneId = e.dataTransfer.getData('zone')
  let dragItem = document.querySelector(`[data-item="${item}"]`)
  let itemInZone = this.querySelector('div')

  if (this.dataset.zone == zoneId) {
    itemInZone && document.querySelector('.shelf-' + zoneId).append(itemInZone)
    this.append(dragItem)
  }
  document.querySelector('.zone-' + zoneId).classList.remove('dropZone--active')

  let itemInZone1
  let itemInZone2
  if (zoneId >= 2) {
    itemInZone1 = document.querySelector(`.zone-${zoneId - 1}`)
  }

  if (zoneId < zones.length) {
    itemInZone2 = document.querySelector(`.zone-${Number(zoneId) + 1}`)
  }

  if (itemInZone1 && itemInZone1.hasChildNodes()) {
    drawLine(itemInZone1.querySelector('div'), dragItem)
  }
  if (itemInZone2 && itemInZone2.hasChildNodes()) {
    drawLine(dragItem, itemInZone2.querySelector('div'))
  }
}

function handlerDragEnter(e) {
  // console.log(e.dataTransfer.getData('zone'))
}
function handlerDragLeave() {}

//===================================================================================
// Рисуем линию

function drawLine(item1, item2) {
  let react1 = item1 && item1.getBoundingClientRect()
  let react2 = item2 && item2.getBoundingClientRect()

  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'
  console.log(react1.top)

  let zoneY = zone.getBoundingClientRect().top
  let zoneX = zone.getBoundingClientRect().left
  console.log(zoneY)

  line.setAttribute('x1', react1.left - zoneX + react1.width / 2)
  line.setAttribute('y1', react1.top - zoneY + react1.height - 10)
  line.setAttribute('x2', react2.left - zoneX + react1.width / 2)
  line.setAttribute('y2', react2.top - zoneY - 10)

  let svg = document.querySelector('svg')
  svg.append(line)
}

//рандомные цвета
// dragsItems.forEach(item => {
//   dataItem = item.setData('item')
//   i % 2 == 0 && (item.style.backgroundColor = 'red')
//   i % 3 == 0 && (item.style.backgroundColor = 'blue')
// })

// function randomColor() {
//   let max = 255
//   let min = 0
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }
