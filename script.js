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
    let div = document.createElement('div')
    div.classList.add('shelf__block')
    div.dataset.shelf = this.num
    div.append(this.div)
    this.div.style.backgroundColor = this.color
    this.div.style.width = this.width
    this.div.style.height = this.height
    this.div.classList.add('dragItem')
    this.div.dataset.item = this.num
    this.div.setAttribute('draggable', true)
    this.div.textContent = this.text
    document.querySelector('.shelf').append(div)
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
        console.log('Клик2')
        drawLineFeedBack(block1, block2)
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

  // Для удаление линий при перетаскивании обратно на полку
  let zone
  try {
    zone = e.target.closest('[data-zone]').dataset.zone
  } catch {
    zone = null
  }

  e.dataTransfer.setData('zone', zone)
}

// Зоны для перетаскивания объектов
zones.forEach(dropZone => {
  dropZone.addEventListener('drop', handlerDrop)
  // dropZone.addEventListener('dragenter', handlerDragEnter)
  // dropZone.addEventListener('dragleave', handlerDragLeave)
})

function handlerDrop(e) {
  let item = e.dataTransfer.getData('item')
  let zoneId = this.dataset.zone

  // Добавляем  блок в зону
  let dragItem = document.querySelector(`[data-item="${item}"]`)
  // this.append(dragItem)

  // Показываем инпуты

  // Сигнал или обычный блок
  // Сигнал
  if (dragItem.classList.contains('signal') && this.classList.contains('zone-signal')) {
    this.append(dragItem)
    //Показ блока с инпутами
    document.querySelector(`.data [data-zone="${zone}"] .data-inner`) && (document.querySelector(`.data [data-zone="${zone}"] .data-inner`).style.display = 'block')
  }
  // Блок
  if (!dragItem.classList.contains('signal') && !this.classList.contains('zone-signal')) {
    this.append(dragItem)
    //Показ блока с инпутами
    document.querySelector(`.data [data-zone="${zone}"] .data-inner`) && (document.querySelector(`.data [data-zone="${zone}"] .data-inner`).style.display = 'block')
  }

  // Удаление линии, если вверху и внизу от перетаскиваемого(блока) есть блоки
  lines = document.querySelectorAll('line')
  // let itemId = dragItem.dataset.item
  lines.forEach(function (line) {
    let numbers = line.dataset.line.split('-').map(Number)
    let [num1, num2] = line.dataset.line.split('-').map(Number)
    if (num1 == +zoneId - 1 && num2 == +zoneId + 1) {
      line.remove()
    }
  })

  //  Рисуем линии
  let zonesArray = [...zones]
  for (let i = zoneId - 2; i >= 0; i--) {
    if (zonesArray[i].querySelector('.dragItem')) {
      let zone = zonesArray[i].dataset.zone

      drawLine(zonesArray[i].querySelector('.dragItem'), dragItem, zone, zoneId)
      break
    }
  }
  for (let i = zoneId; i < zonesArray.length; i++) {
    if (zonesArray[i].querySelector('.dragItem')) {
      let zone = zonesArray[i].dataset.zone
      console.log(12)
      drawLine(dragItem, zonesArray[i].querySelector('.dragItem'), zone, zoneId)
      break
    }
  }
}

// Перетаскивание объектов обратно на полку
let shelf = document.querySelector('.shelf')
shelf.ondragover = e => e.preventDefault()
shelf.addEventListener('drop', handlerDropShelf)

function handlerDropShelf(e) {
  let item = e.dataTransfer.getData('item')
  let zone = e.dataTransfer.getData('zone')

  let dragItem = document.querySelector(`[data-item="${item}"]`)

  // Возвращаем элемент на свою позицию
  document.querySelector(`[data-shelf="${item}"]`).append(dragItem)

  // Удаление линий
  lines = document.querySelectorAll('line')

  lines.forEach(function (line) {
    let numbers = line.dataset.line.split('-')
    console.log(numbers[1])
    if (numbers.includes(zone) || numbers[1] == zone || numbers[0] == zone) {
      line.remove()
    }
  })

  // Удаление линий ОС
  polylines = document.querySelectorAll('polyline')

  polylines.forEach(function (item) {
    let numbers = item.dataset.line.split('-')

    if (numbers.includes(zone)) {
      item.remove()
    }
  })

  // Скрытие инпутов
  document.querySelector(`.data [data-zone="${item}"] .data-inner`) && (document.querySelector(`.data [data-zone="${item}"] .data-inner`).style.display = 'none')
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
  // if (document.querySelector(`line[data-line="${zoneid}-${zone}"]`)) {
  //   return
  // }
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
function drawLineFeedBack(block1, block2) {
  console.log(1)
  // Если такая OC есть, возвращаем, ничего не рисуем
  if (document.querySelector(`polyline[data-line="${block1.dataset.zone}-${block2.dataset.zone}"]`)) {
    return
  }

  // Нельзя сделать обратную свзяь к тому же элементу
  if (block1.dataset.item == block2.dataset.item) {
    return
  }
  // Нельзя делать ос от верхнего блока к нижнему
  if (block2.dataset.zone < block1.dataset.zone) {
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
  line.dataset.line = `${block1.closest('[data-zone]').dataset.zone}-${block2.closest('[data-zone]').dataset.zone}`
  let svg = document.querySelector('svg')
  svg.append(line)

  polylines = document.querySelectorAll('polyline')
  polylines.forEach(item => {
    item.addEventListener('click', function () {
      this.remove()
    })
  })
}
