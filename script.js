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
    this.divOuter = document.createElement('div')
    this.divOuter.classList.add('shelf__block')
    this.divOuter.style.width = this.width
    this.divOuter.style.height = this.height

    this.divOuter.dataset.shelf = this.num
    this.divOuter.append(this.div)
    this.div.style.backgroundColor = this.color
    this.div.style.width = this.width
    this.div.style.height = this.height
    this.div.classList.add('dragItem')
    this.div.dataset.item = this.num
    this.div.setAttribute('draggable', true)
    this.div.textContent = this.text
    document.querySelector('.shelf').append(this.divOuter)
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
  color: 'orange',
  text: 'Сигнал',
})
block5.create()
let block6 = new Signal({
  color: 'purple',
  text: 'Сигнал',
})
block6.create()
let block7 = new Signal({
  color: 'purple',
  text: 'Сигнал',
})
block7.create()

// Сохраняем разметку в LS
//===================================================================
const main = document.querySelector('.main')
if (localStorage.getItem('mainHTML')) {
  main.innerHTML = localStorage.getItem('mainHTML')
}
function saveHTMLToLS() {
  localStorage.setItem('mainHTML', main.innerHTML)
}
document.querySelector('.clearLS').addEventListener('click', function () {
  localStorage.clear()
  location.reload()
})
// ==================================================================================================
// Добавление входов и выходов для каждого блока
let dragsItemsWithoutSignals = document.querySelectorAll('.dragItem')
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
  item.append(out1)

  // Не добавляем вторые вход и выход для сигналов
  if (!item.classList.contains('signal')) {
    item.append(out2)
    item.append(enter2)
  }
})

let outs2 = document.querySelectorAll('.dragItem_out2')
let enters2 = document.querySelectorAll('.dragItem_enter2')

outs2.forEach(function (item) {
  item.addEventListener('click', function () {
    let block1 = item.parentNode

    enters2.forEach(function (item) {
      item.onclick = function () {
        let block2 = item.parentNode
        drawLineFeedBack(block1, block2)
      }
    })
  })
})
//
//========================================================
//========================================================
//========================================================

const dragsItems = document.querySelectorAll('.dragItem')
const zones = document.querySelectorAll('.zones [data-zone]')

zones.forEach(item => (item.ondragover = e => e.preventDefault()))

// Перетаскиваемые объекты
dragsItems.forEach(item => {
  item.addEventListener('dragstart', handlerDragStart)
  item.addEventListener('dragend', handlerDragEnd)
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

  // Изменение z index у svg, чтобы svg ушла на второй план и можно было переместить элемент
  document.querySelector('svg').style.zIndex = '-1'
}
function handlerDragEnd() {
  document.querySelector('svg').style.zIndex = '0'
}

// Зоны для перетаскивания объектов
zones.forEach(dropZone => {
  dropZone.addEventListener('drop', handlerDrop)
  // dropZone.addEventListener('dragenter', handlerDragEnter)
  // dropZone.addEventListener('dragleave', handlerDragLeave)
})

//==================================================================================================
//==================================================================================================
//==================================================================================================
// Перетаскиваем объекты в зоны
function handlerDrop(e) {
  let item = e.dataTransfer.getData('item')
  let zoneId = this.dataset.zone

  // Добавляем  блок в зону
  let dragItem = document.querySelector(`[data-item="${item}"]`)

  // Сигнал или обычный блок. Отображаем инпуты данных
  // Сигнал
  if (dragItem.classList.contains('signal') && this.classList.contains('zone-signal')) {
    this.append(dragItem)
    //Показ блока с инпутами
    document.querySelector(`.data [data-zone="${zoneId}"] .data-inner`) && (document.querySelector(`.data [data-zone="${zoneId}"] .data-inner`).style.display = 'block')
  }
  // Блок
  if (!dragItem.classList.contains('signal') && !this.classList.contains('zone-signal')) {
    this.append(dragItem)
    //Показ блока с инпутами
    document.querySelector(`.data [data-zone="${zoneId}"] .data-inner`) && (document.querySelector(`.data [data-zone="${zoneId}"] .data-inner`).style.display = 'block')
  }

  // Рисуем линии

  let zonesArray = [...zones] // все зоны
  lines = document.querySelectorAll('line') // все нарисованные линии

  let signals = [...this.querySelectorAll('.signal')] // линии между сигналами
  let signal2 = signals[signals.length - 1] // Последний сигнал
  let signal1 = signals[signals.length - 2] // Предпоследний сигнал

  // Рисуем линии между сигналами
  if (signals.length >= 2) {
    drawLine(signal1, signal2, signal1.dataset.item, signal2.dataset.item, true)
  }

  // Чекаем зоны сверху
  for (let i = zoneId - 2, counter = 0; i >= 0, counter <= 1; i--, counter++) {
    if (i < 0) break // Если первая зона

    let dragItemsInzone = zonesArray[i].querySelectorAll('.dragItem')
    // Линии проводяет только до ближайших двух зон

    if (zonesArray[i].querySelector('.dragItem')) {
      let zone = zonesArray[i].dataset.zone
      if (dragItem.classList.contains('signal')) {
        drawLine(zonesArray[i].querySelector('.dragItem'), signals[0], zone, zoneId)
        deleteLineBetweenZoneAndSignals('up') // Удаляем линию между зоной и сигналом
      } else {
        drawLine(dragItemsInzone[dragItemsInzone.length - 1], dragItem, zone, zoneId)
      }

      break
    }
  }

  // Чекаем зоны снизу
  for (let i = zoneId, counter = 0; i < zonesArray.length, counter <= 1; i++, counter++) {
    if (i >= zonesArray.length) break

    const dragItemsInzone = zonesArray[i].querySelectorAll('.dragItem')
    if (zonesArray[i].querySelector('.dragItem')) {
      let zone = zonesArray[i].dataset.zone
      // Линии проводяет только до ближайших двух зон

      if (dragItem.classList.contains('signal')) {
        drawLine(signals[signals.length - 1], zonesArray[i].querySelector('.dragItem'), zone, zoneId)
        deleteLineBetweenZoneAndSignals('down') // Удаляем линию между зоной и сигналом
      } else {
        drawLine(dragItem, dragItemsInzone[0], zone, zoneId)
      }
      break
    }
  }

  function deleteLineBetweenZoneAndSignals(direction) {
    operand = direction == 'up' ? 1 : -1
    lines.forEach(function (line) {
      let [num1, num2] = line.dataset.line.split('-').map(Number)
      if (num2 == +zoneId + operand && num1 == +zoneId && !line.dataset.isSignal) {
        line.remove()
      }
    })
  }
  saveHTMLToLS()
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

    let signalsInThisZone = [...document.querySelectorAll(`[data-zone="${zone}"] .signal`)]
    // Линия между сигналом и соседней секцией удаляется, если нет больше сигналов
    if ((numbers.includes(zone) || numbers[1] == zone || numbers[0] == zone) && signalsInThisZone.length == 0 && !line.dataset.isSignal) {
      line.remove()
    }

    // Если линии между сигналами
    if (dragItem.classList.contains('signal') && line.dataset.isSignal && numbers.includes(dragItem.dataset.item)) {
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
let zoneLocation = zone.getBoundingClientRect()
let outOffset = document.querySelector('.dragItem_out1').getBoundingClientRect().width / 2 - 1

function drawLine(item1, item2, zoneid, zone, isSignal) {
  //Если такая OC есть, возвращаем, ничего не рисуем
  if (document.querySelector(`line[data-line="${zoneid}-${zone}"]:not([data-is-signal='true'])`)) {
    return
  }
  let react1 = item1 && item1.getBoundingClientRect()
  let react2 = item2 && item2.getBoundingClientRect()

  // Меняем координаты точек при изменении размеров экрана
  window.addEventListener('resize', function () {
    const zoneLocation = document.querySelector('.zones').getBoundingClientRect()
    let delta1 = item1.getBoundingClientRect().left - zoneLocation.left + outOffset
    let delta2 = item2.getBoundingClientRect().left - zoneLocation.left + outOffset

    const lines = this.document.querySelectorAll('line')
    lines.forEach(function (item) {
      item.setAttribute('x1', delta1)
      item.setAttribute('x2', delta2)
    })
  })

  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'

  line.setAttribute('x1', react1.left - zoneLocation.left + outOffset)
  line.setAttribute('y1', react1.bottom - zoneLocation.top - 2)
  line.setAttribute('x2', react2.left - zoneLocation.left + outOffset)
  line.setAttribute('y2', react2.top - zoneLocation.top)
  line.dataset.line = `${zoneid}-${zone}`

  isSignal && (line.dataset.isSignal = true)

  let svg = document.querySelector('svg')
  svg.append(line)
}

// Рисование линии обратной связи
function drawLineFeedBack(block1, block2) {
  // Если такая OC есть, возвращаем, ничего не рисуем

  if (document.querySelector(`polyline[data-line="${block1.closest('[data-zone]').dataset.zone}-${block2.closest('[data-zone]').dataset.zone}"]`)) {
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

  // // Меняем координаты точек при изменении размеров экрана
  // window.addEventListener('resize', function () {
  //   const zoneLocation = document.querySelector('.zones').getBoundingClientRect()
  //   let delta1 = block1.getBoundingClientRect().left - zoneLocation.left + outOffset
  //   let delta2 = block2.getBoundingClientRect().left - zoneLocation.left + outOffset

  //   const polylines = this.document.querySelectorAll('polyline')
  //   polylines.forEach(function (item) {
  //     let points = item.getAttribute('points')
  //     console.log('points: ', points)
  //     let points1 = points.split(',')
  //     console.log('points1: ', points1)
  //     let points2 = points1.map(item => item.split(' ')).map(item => Number(item[2]) + delta1)
  //     console.log('points2: ', points2)
  //   })
  // })

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

  // Если уже есть линия Ос
  if (polylines.length == 1) {
    kefX = 20
    kefY = 5
    line.style.stroke = 'green'
  }

  // Если уже есть 2 линии Ос
  if (polylines.length == 2) {
    kefX = 30
    kefY = 10
    line.style.stroke = 'orange'
  }

  points += `${x}, ${y} ` //1  точка
  y += 20 + kefY
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
