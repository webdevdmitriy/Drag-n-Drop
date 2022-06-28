// Создаем объекты
class Component {
  constructor(options) {
    this.text = options.text
    this.color = options.color
    this.num = Component.counter++
    this.div = document.createElement('div')
  }
  width = '100px'
  height = '100px'

  create() {
    this.div.style.backgroundColor = this.color
    this.div.style.width = this.width
    this.div.style.height = this.height
    this.div.classList.add('dragItem')
    this.div.dataset.item = this.num
    this.div.setAttribute('draggable', true)
    this.div.textContent = this.text
    document.querySelector('.shelf').append(this.div)
  }
}
Component.counter = 1

class Signal extends Component {
  constructor(options) {
    super(options)
    this.div.classList.add('signal')
  }
  width = '50px'
  height = '50px'
}

let block1 = new Component({
  color: 'skyblue',
  text: 'Конвейр + Вода',
})
block1.create()
let block2 = new Component({
  color: 'blue',
  text: 'МСЦ-8',
})
block2.create()
let block3 = new Component({
  color: 'green',
  text: 'ММС-1 Вода',
})
block3.create()
let block4 = new Signal({
  color: 'orange',
  text: 'Сигнал',
})
block4.create()
let block5 = new Signal({
  color: 'purple',
  text: 'Сигнал',
})
block5.create()
// ==================================================================================================
// Добавление входов и выходов для каждого блока
let dragsItemsWithoutSignals = document.querySelectorAll('.dragItem:not(.signal)')
dragsItemsWithoutSignals.forEach(function (item) {
  let enter1 = document.createElement('span')
  let enter2 = document.createElement('span')
  let out1 = document.createElement('span')
  let out2 = document.createElement('span')
  enter1.classList.add('dragItem_enter1')
  enter2.classList.add('dragItem_enter2')
  out1.classList.add('dragItem_out1')
  out2.classList.add('dragItem_out2')
  item.append(enter1)
  item.append(enter2)
  item.append(out1)
  item.append(out2)
})

let outs2 = document.querySelectorAll('.dragItem_out2')
let enters2 = document.querySelectorAll('.dragItem_enter2')

outs2.forEach(function (item) {
  item.addEventListener('click', function () {
    let block1 = item.parentNode

    enters2.forEach(function (item) {
      item.onclick = function () {
        let block2 = item.parentNode
        drawLineFeedBack(block1, block2, block1.dataset.item, block2.dataset.item)
      }
    })
  })
})
//
//========================================================

const dragsItems = document.querySelectorAll('.dragItem')
const zones = document.querySelectorAll('.zones [data-zone]')
console.log('zones: ', zones)

zones.forEach(item => (item.ondragover = e => e.preventDefault()))

// Перетаскиваемые объекты

dragsItems.forEach(item => {
  item.addEventListener('dragstart', handlerDragStart)
  // item.addEventListener('dragend', handlerDragEnd)
})

function handlerDragStart(e) {
  e.dataTransfer.setData('item', e.target.dataset.item)
}

// Зоны для перетаскивания объектов
zones.forEach(dropZone => {
  dropZone.addEventListener('drop', handlerDrop)
  // dropZone.addEventListener('dragenter', handlerDragEnter)
  // dropZone.addEventListener('dragleave', handlerDragLeave)
})

function handlerDrop(e) {
  let item = e.dataTransfer.getData('item')
  let zone = this.dataset.zone
  console.log('zone: ', zone)

  // Добавляем  блок в зону
  let dragItem = document.querySelector(`[data-item="${item}"]`)
  // this.append(dragItem)

  // Показываем инпуты

  // Сигнал или обычный блок
  // Сигнал
  if (dragItem.classList.contains('signal') && this.classList.contains('zone-signal')) {
    this.append(dragItem)
  }
  // Блок

  if (!dragItem.classList.contains('signal') && !this.classList.contains('zone-signal')) {
    this.append(dragItem)
    document.querySelector(`.data__block[data-zone="${zone}"] .data__block-inner`) && (document.querySelector(`.data__block[data-zone="${zone}"] .data__block-inner`).style.display = 'block')
  }

  zones.forEach(function (item, i) {
    let zoneWithBlock = item.dataset.zone
    let dataItem1 = item.querySelector('.dragItem') && item.querySelector('.dragItem').dataset.item
    let dataItem2 = dragItem.dataset.item

    if (item.querySelector('.dragItem') && zone < zoneWithBlock) {
      drawLine(item.querySelector('.dragItem'), dragItem, dataItem1, dataItem2)
    }
    if (item.querySelector('.dragItem') && zone > zoneWithBlock) {
      drawLine(dragItem, item.querySelector('.dragItem'), dataItem1, dataItem2)
    }
  })
}

// Перетаскивание объектов обратно на полку
let shelf = document.querySelector('.shelf')
shelf.ondragover = e => e.preventDefault()
shelf.addEventListener('drop', handlerDropShelf)

function handlerDropShelf(e) {
  let item = e.dataTransfer.getData('item')

  let dragItem = document.querySelector(`[data-item="${item}"]`)

  this.append(dragItem)

  // Удаление линий
  // document.querySelector(`line[data-line="${Number(zoneId)}-${Number(zoneId) + 1}"]`) && document.querySelector(`line[data-line="${Number(zoneId)}-${Number(zoneId) + 1}"]`).remove()
  // document.querySelector(`line[data-line="${Number(zoneId) - 1}-${Number(zoneId)}"]`) && document.querySelector(`line[data-line="${Number(zoneId) - 1}-${Number(zoneId)}"]`).remove()

  lines = document.querySelectorAll('line')
  let itemId = dragItem.dataset.item
  lines.forEach(function (item) {
    let numbers = item.dataset.line.split('-')
    if (numbers.includes(itemId)) {
      item.remove()
    }
  })
  // Удаление линий ОС

  // document.querySelector(`polyline[data-line="${Number(zoneId)}-${Number(zoneId) - 1}"]`) && document.querySelector(`polyline[data-line="${Number(zoneId)}-${Number(zoneId) - 1}"]`).remove()
  // document.querySelector(`polyline[data-line="${Number(zoneId) + 1}-${Number(zoneId)}"]`) && document.querySelector(`polyline[data-line="${Number(zoneId) + 1}-${Number(zoneId)}"]`).remove()

  // Удаление линий ОС
  polylines = document.querySelectorAll('polyline')

  polylines.forEach(function (item) {
    let numbers = item.dataset.line.split('-')

    if (numbers.includes(itemId)) {
      item.remove()
    }
  })

  // Удаление инпутов сигналов
  dragItem.dataset.signal && (document.querySelector(`[data-signalBlock="${dragItem.dataset.signal}"]`).style.display = 'none')
}

//===================================================================================
// Рисуем линии

const zone = document.querySelector('.zones')
let zoneY = zone.getBoundingClientRect().top
let zoneX = zone.getBoundingClientRect().left
let zoneLocation = zone.getBoundingClientRect()
let outOffset = document.querySelector('.dragItem_out1').getBoundingClientRect().width / 2 - 1

function drawLine(item1, item2, zoneid, zone) {
  // Если такая OC есть, возвращаем, ничего не рисуем
  if (document.querySelector(`line[data-line="${item1.dataset.zone}-${item2.dataset.zone}"]`)) {
    return
  }
  let react1 = item1 && item1.getBoundingClientRect()
  let react2 = item2 && item2.getBoundingClientRect()

  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'

  line.setAttribute('x1', react1.left - zoneLocation.left + outOffset)
  line.setAttribute('y1', react1.bottom - zoneLocation.top - 2)
  line.setAttribute('x2', react2.left - zoneLocation.left + outOffset)
  line.setAttribute('y2', react2.top - zoneLocation.top)
  line.dataset.line = `${zoneid}-${zone}`

  let svg = document.querySelector('svg')
  svg.append(line)
}

// Рисование линии обратной связи
function drawLineFeedBack(block1, block2, item1, item2) {
  // Если такая OC есть, возвращаем, ничего не рисуем
  if (document.querySelector(`polyline[data-line="${block1.dataset.zone}-${block2.dataset.zone}"]`)) {
    return
  }
  // Нельзя сделать обратную свзяь к тому же элементу
  if (block1.dataset.item == block2.dataset.item) {
    return
  }
  // Нельзя делать ос от верхнего блока к нижнему
  if (block2.dataset.zone > block1.dataset.zone) {
    return
  }

  let line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'
  line.style.fill = 'none'
  let outOffset = document.querySelector('.dragItem_out2').getBoundingClientRect().width / 2 + 1

  let react1 = block1.getBoundingClientRect()
  let react2 = block2.getBoundingClientRect()

  let points = ''

  let x = react1.right - zoneLocation.left - outOffset
  let y = react1.bottom - zoneLocation.top - 2

  let polylines = document.querySelectorAll('polyline')
  let kefX = 0
  let kefY = 0
  if (polylines.length == 1) {
    kefX = 20
    kefY = 5
    line.style.stroke = 'green'
  }
  if (polylines.length == 2) {
    kefX = 40
    kefY = 10
    line.style.stroke = 'orange'
  }

  points += `${x}, ${y} ` //1  точка
  y += 20
  points += `${x}, ${y} ` // 2 точка
  x += 20 + kefX
  points += `${x}, ${y} ` // 3
  y = react2.top - zoneLocation.top - 2 - 20
  y -= kefY
  points += `${x}, ${y} ` // 4
  x = react2.right - zoneLocation.left - outOffset

  points += `${x}, ${y} ` //5
  y = react2.top - zoneLocation.top + 2
  points += `${x}, ${y} ` //6

  line.setAttribute('points', points)
  line.dataset.line = `${item1}-${item2}`
  let svg = document.querySelector('svg')
  svg.append(line)

  polylines = document.querySelectorAll('polyline')
  polylines.forEach(item => {
    item.addEventListener('click', function () {
      this.remove()
    })
  })
}
