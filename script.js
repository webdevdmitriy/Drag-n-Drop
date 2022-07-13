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
    this.div.classList.add('signal-main')
    this.num = 10
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
// let block5 = new Signal({
//   color: 'orange',
//   text: 'Сигнал',
// })
// block5.create()
// let block6 = new Signal({
//   color: 'purple',
//   text: 'Сигнал',
// })
// block6.create()
// let block7 = new Signal({
//   color: 'purple',
//   text: 'Сигнал',
// })
// block7.create()

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
        saveHTMLToLS()
      }
    })
  })
})
//
//========================================================
//========================================================
//========================================================

const zones = document.querySelectorAll('.zones [data-zone]')
let zonesArray = [...zones] // все зоны

zones.forEach(item => (item.ondragover = e => e.preventDefault()))

let dragsItems = document.querySelectorAll('.dragItem')
// Перетаскиваемые объекты
dragsItems.forEach(item => {
  item.addEventListener('dragstart', handlerDragStart)
  item.addEventListener('dragend', handlerDragEnd)
})

// Получаем в коллекцию новые элементы
function getNewDragsItems() {
  dragsItems = document.querySelectorAll('.dragItem')
  dragsItems.forEach(item => {
    item.addEventListener('dragstart', handlerDragStart)
    item.addEventListener('dragend', handlerDragEnd)
  })
}

let dragSrcEl // Перетаскиваемый объект
function handlerDragStart(e) {
  try {
    e.dataTransfer.setData('item', e.target.dataset.item)
  } catch {}

  e.target.closest('.zone') && e.dataTransfer.setData('zone', e.target.closest('.zone').dataset.zone)

  dragSrcEl = this

  // e.dataTransfer.setData('zone', zone)

  // Изменение z index у svg, чтобы svg ушла на второй план и можно было переместить элемент
  document.querySelector('svg').style.zIndex = '-1'
}
function handlerDragEnd() {
  document.querySelector('svg').style.zIndex = '0'
  // Получаем в коллекцию новые элементы
  getNewDragsItems()
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
//==================================================================================================
//==================================================================================================
//==================================================================================================

// Перетаскиваем объекты в зоны
function handlerDrop(e) {
  // Если перетаскиваем в зону с сигналами обычный блок выходим
  if (this.classList.contains('zone-signal') && !dragSrcEl.classList.contains('signal')) {
    return
  }
  //Если перетаскиваем в обычную зону сигнал выходим
  if (!this.classList.contains('zone-signal') && dragSrcEl.classList.contains('signal')) {
    return
  }

  let item = e.dataTransfer.getData('item')
  let zoneId = this.dataset.zone

  // Добавляем  блок в зону
  let dragItem = document.querySelector(`[data-item="${item}"]`)

  // Сигнал или обычный блок. Отображаем инпуты данных
  // Сигнал

  if (dragItem.classList.contains('signal') && this.classList.contains('zone-signal')) {
    !localStorage.getItem('counterItems') && localStorage.setItem('counterItems', 1)

    // Сколько можно расположить сигналов
    if (this.querySelectorAll('.dragItem').length < 3) {
      const clone = dragItem.cloneNode(true)
      let counter = localStorage.getItem('counterItems')
      const atrDataNew = +clone.dataset.item + counter++
      clone.dataset.item = atrDataNew
      clone.classList.remove('signal-main')
      localStorage.setItem('counterItems', counter)
      this.append(clone)
    }
  }

  //===============================================================================================
  //===============================================================================================
  //===============================================================================================
  // Показ данных

  // Блок
  if (!dragItem.classList.contains('signal') && !this.classList.contains('zone-signal')) {
    this.append(dragItem)
    //Показ блока с инпутами
    document.querySelector(`.data [data-zone="${zoneId}"] .data-inner`).style.display = 'block'
  }

  // Сигнал
  // Создание инпутов
  const dataBlock = document.querySelector(`.data [data-zone="${zoneId}"] .data-inner`)
  if (dataBlock.closest('.data-signal')) {
    const div = document.createElement('div')
    div.classList.add('data-inner__block')
    div.dataset.dataInner = +localStorage.getItem('counterItems') + Number(item) - 1 // Берем значение из счетчика из LS + значение основного сиганал и вычитаем инкремент счетчика
    const label = document.createElement('label')
    label.textContent = 'Текст'
    const select = document.createElement('select')
    const option = document.createElement('option')
    option.textContent = 'Нагрузка руды'
    const option2 = document.createElement('option')
    option2.textContent = 'Расход воды'
    const option3 = document.createElement('option')
    option3.textContent = 'ПЛОТН-МД38'
    select.append(option)
    select.append(option2)
    select.append(option3)
    const input = document.createElement('input')
    div.append(label)
    div.append(select)
    div.append(input)
    dataBlock.append(div)
  }

  // Рисуем линии

  lines = document.querySelectorAll('line') // все нарисованные линии

  // Рисуем линии между сигналами
  let signals = [...this.querySelectorAll('.signal')] // линии между сигналами
  let signal2 = signals[signals.length - 1] // Последний сигнал
  let signal1 = signals[signals.length - 2] // Предпоследний сигнал
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
        let item1 = zonesArray[i].querySelector('.dragItem')
        let item2 = signals[0]
        drawLine(item1, item2, item1.dataset.item, item2.dataset.item)
        console.log('item1: ', item1)
        console.log('item2: ', item2)
        // deleteLineBetweenZoneAndSignals('up') // Удаляем линию между зоной и сигналом
      } else {
        let item1 = dragItemsInzone[dragItemsInzone.length - 1]
        let item2 = dragItem
        console.log('item1: ', item1)
        console.log('item2: ', item2)
        drawLine(item1, item2, item1.dataset.item, item2.dataset.item)
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
        let item1 = signals[signals.length - 1]
        console.log('item1: ', item1)
        let item2 = zonesArray[i].querySelector('.dragItem')
        console.log('item2: ', item2)

        drawLine(item1, item2, item1.dataset.item, item2.dataset.item)
        deleteLineBetweenZoneAndSignals('down') // Удаляем линию между зоной и сигналом
      } else {
        drawLine(dragItem, dragItemsInzone[0], dragItem.dataset.item, dragItemsInzone[0].dataset.item)
      }
      break
    }
  }

  // function deleteLineBetweenZoneAndSignals(direction) {
  //   operand = direction == 'up' ? 1 : -1
  //   lines.forEach(function (line) {
  //     let [num1, num2] = line.dataset.line.split('-').map(Number)
  //     if (num2 == +zoneId + operand && num1 == +zoneId && !line.dataset.isSignal) {
  //       line.remove()
  //     }
  //   })
  // }

  function deleteLineBetweenZoneAndSignals(direction) {
    // let operand = direction == 'down' ? 1 : -1

    lines.forEach(function (line) {
      let numbers = line.dataset.line.split('-').map(Number)
      let zone = document.querySelector(`[data-zone="${+zoneId + 1}"]`)
      let item
      if (zone.querySelector('.dragItem')) {
        item = zone.querySelector('.dragItem').dataset.item
      }
      if (numbers.includes(+item)) {
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
  let zone = e.dataTransfer.getData('zone')

  // Если бросаем объект не из зоны(с полки). Взяли с полки и отпустили

  if (!zone) {
    return
  }

  let item = dragSrcEl.dataset.item

  if (dragSrcEl.classList.contains('signal') && !dragSrcEl.classList.contains('signal-main')) {
    dragSrcEl.remove()
  } else {
    // Возвращаем элемент на свою позицию
    document.querySelector(`[data-shelf="${item}"]`).append(dragSrcEl)
  }

  // Удаление линий
  lines = document.querySelectorAll('line')

  lines.forEach(function (line) {
    let numbers = line.dataset.line.split('-')
    let itemId = dragSrcEl.dataset.item

    if (numbers.includes(itemId)) {
      line.remove()
    }
  })

  //======================================================================
  // Перерисовываем нафиг все линии в зоне с сигналами

  const currentZone = document.querySelector(`[data-zone="${zone}"]`)
  let currentZoneDragItems = [...currentZone.querySelectorAll('.dragItem')]
  // Удаляем все линии
  for (let elem of currentZoneDragItems) {
    lines.forEach(function (line) {
      let numbers = line.dataset.line.split('-')
      let itemId = elem.dataset.item

      if (numbers.includes(itemId)) {
        line.remove()
      }
    })
  }

  //
  if (currentZoneDragItems.length > 1) {
    for (let i = 0; i < currentZoneDragItems.length; i++) {
      let elem1 = currentZoneDragItems[i]
      let elem2 = currentZoneDragItems[++i]
      drawLine(elem1, elem2, elem1.dataset.item, elem2.dataset.item, true)
    }
  }

  // Чекаем зоны снизу
  for (let i = zone, counter = 0; i < zonesArray.length, counter <= 1; i++, counter++) {
    if (i >= zonesArray.length) break
    const dragItemsInzone = zonesArray[i].querySelectorAll('.dragItem')
    if (zonesArray[i].querySelector('.dragItem')) {
      let item1 = currentZoneDragItems[currentZoneDragItems.length - 1]
      let item2 = dragItemsInzone[0]

      item1 && item2 && drawLine(item1, item2, item1.dataset.item, item2.dataset.item)

      break
    }
  }
  for (let i = zone - 2, counter = 0; i >= 0, counter <= 1; i--, counter++) {
    if (i < 0) break // Если первая зона
    if (i >= zonesArray.length) break
    const dragItemsInzone = zonesArray[i].querySelectorAll('.dragItem')
    if (zonesArray[i].querySelector('.dragItem')) {
      let item1 = currentZoneDragItems[0]
      let item2 = dragItemsInzone[dragItemsInzone.length - 1]

      item1 && item2 && drawLine(item1, item2, item1.dataset.item, item2.dataset.item)

      break
    }
  }

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

  if (dragSrcEl.classList.contains('signal')) {
    document.querySelector(`[data-data-inner="${dragSrcEl.dataset.item}"]`).remove()
  }
  saveHTMLToLS()
}

//===================================================================================
// Рисуем линии
const zone = document.querySelector('.zones')

function drawLine(item1, item2, itemId1, itemid2, isSignal) {
  let zoneLocation = zone.getBoundingClientRect()
  let outOffset = document.querySelector('.dragItem_out1').getBoundingClientRect().width / 2 - 1

  //Если такая OC есть, возвращаем, ничего не рисуем
  if (document.querySelector(`line[data-line="${itemId1}-${itemid2}"]:not([data-is-signal='true'])`)) {
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
  line.dataset.line = `${itemId1}-${itemid2}`
  console.log('x1', react1.left - zoneLocation.left + outOffset)
  console.log('y1', react1.bottom - zoneLocation.top - 2)

  // let length = Math.ceil(line.getAttribute('y2') - line.getAttribute('y1'))

  // line.style.strokeDasharray = length + 'px'
  // line.classList.add('line')

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
