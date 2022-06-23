const shelfs = document.querySelectorAll('.shelf [data-shelf]')
const zone = document.querySelector('.zone ')
const zones = document.querySelectorAll('.zone div[data-zone]')
let dragsItems = document.querySelectorAll('.dragItem')

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

//отменяем запрет перетаскивания элементов в другие элементы
zones.forEach(item => (item.ondragover = e => e.preventDefault()))
shelfs.forEach(item => (item.ondragover = e => e.preventDefault()))

// Перетаскиваемые объекты
dragsItems.forEach(item => {
  item.addEventListener('dragstart', handlerDragStart)
  item.addEventListener('dragend', handlerDragEnd)
})

// Зоны для перетаскивания объектов
zones.forEach(dropZone => {
  dropZone.addEventListener('drop', handlerDropZone)
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

  // Изменение z index у svg, чтобы svg ушла на второй план и можно было переместить элемент
  document.querySelector('svg').style.zIndex = '0'
}

function handlerDragEnd(e) {
  zones.forEach(item => {
    item.classList.remove('dark-background')
  })
  document.querySelector('svg').style.zIndex = '1'
}

function handlerDropZone(e) {
  let item = e.dataTransfer.getData('item')
  let zoneId = e.dataTransfer.getData('zone')
  let dragItem = document.querySelector(`[data-item="${item}"]`)
  let itemInZone = this.querySelector('div')

  // Для блоков
  if (!dragItem.classList.contains('signal') && this.dataset.zone == zoneId) {
    itemInZone && document.querySelector('.shelf-' + zoneId).append(itemInZone)
    this.append(dragItem)
  }
  // Для сигналов
  if (dragItem.classList.contains('signal') && this.dataset.zone == zoneId) {
    this.querySelector('.signals').append(dragItem)
    const signal_block = document.querySelector(`[data-signalBlock="${dragItem.dataset.signal}"]`)
    signal_block.style.display = 'flex'
  }

  let itemInZone1
  let itemInZone2
  if (zoneId >= 2) {
    itemInZone1 = document.querySelector(`.zone-${zoneId - 1}`)
    if (!itemInZone1.classList.contains('zone-drop')) {
      itemInZone1 = itemInZone1.querySelector('.zone-drop')
    }
  }

  if (zoneId < zones.length) {
    itemInZone2 = document.querySelector(`.zone-${Number(zoneId) + 1}`)
    if (!itemInZone2.classList.contains('zone-drop')) {
      itemInZone2 = itemInZone2.querySelector('.zone-drop')
    }
  }

  if (itemInZone1 && itemInZone1.hasChildNodes()) {
    drawLine(itemInZone1.querySelector('div.dragItem'), dragItem)
  }

  if (itemInZone2 && itemInZone2.hasChildNodes()) {
    drawLine(dragItem, itemInZone2.querySelector('div.dragItem'))
  }
}

function handlerDragEnter(e) {
  // console.log(e.dataTransfer.getData('zone'))
}
function handlerDragLeave() {}

// Перетаскивание блоков обратно на полку
shelfs.forEach(dropZone => {
  dropZone.addEventListener('drop', handlerDropShelf)
})

function handlerDropShelf(e) {
  let item = e.dataTransfer.getData('item')
  let zoneId = e.dataTransfer.getData('zone')
  let dragItem = document.querySelector(`[data-item="${item}"]`)

  if (this.dataset.shelf == zoneId) {
    this.querySelector('.shelf__block').append(dragItem)
  }

  // Удаление линий
  // document.querySelector(`line[data-line="${Number(zoneId)}-${Number(zoneId) + 1}"]`) && document.querySelector(`line[data-line="${Number(zoneId)}-${Number(zoneId) + 1}"]`).remove()
  // document.querySelector(`line[data-line="${Number(zoneId) - 1}-${Number(zoneId)}"]`) && document.querySelector(`line[data-line="${Number(zoneId) - 1}-${Number(zoneId)}"]`).remove()

  lines = document.querySelectorAll('line')

  lines.forEach(function (item) {
    let numbers = item.dataset.line.split('-')
    if (numbers.includes(zoneId)) {
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
    if (numbers.includes(zoneId)) {
      item.remove()
    }
  })

  // Удаление инпутов сигналов
  dragItem.dataset.signal && (document.querySelector(`[data-signalBlock="${dragItem.dataset.signal}"]`).style.display = 'none')
}
//===================================================================================
// Рисуем линии

let zoneY = zone.getBoundingClientRect().top
let zoneX = zone.getBoundingClientRect().left
let zoneLocation = zone.getBoundingClientRect()
let outOffset = document.querySelector('.dragItem_out1').getBoundingClientRect().width / 2 - 1
console.log(zoneY)
console.log(zoneX)

function drawLine(item1, item2) {
  // if ((item1.dataset.signal || item2.dataset.signal) && document.querySelectorAll('.signals [data-signal]').length > 1) {
  //   return
  // }

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
  line.dataset.line = `${item1.dataset.zone}-${item2.dataset.zone}`

  let svg = document.querySelector('svg')
  svg.append(line)
}

// Рисование линии обратной связи
function drawLineFeedBack(block1, block2) {
  // Если такая OC есть, возвращаем, ничего не рисуем
  if (document.querySelector(`polyline[data-line="${block1.dataset.zone}-${block2.dataset.zone}"]`)) {
    return
  }
  // Нельзя сделать обратную свзяь к тому же элементу
  if (block1.dataset.item == block2.dataset.item) {
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

  points += `${x}, ${y} ` //1
  y += 20
  points += `${x}, ${y} ` // 2
  x += 80 + kefX
  points += `${x}, ${y} ` // 3
  y = react2.top - zoneLocation.top - 2 - 20
  y -= kefY
  points += `${x}, ${y} ` // 4
  x = react2.right - zoneLocation.left - outOffset

  points += `${x}, ${y} ` //5
  y = react2.top - zoneLocation.top + 2
  points += `${x}, ${y} ` //6

  line.setAttribute('points', points)
  line.dataset.line = `${block1.dataset.zone}-${block2.dataset.zone}`
  let svg = document.querySelector('svg')
  svg.append(line)

  polylines = document.querySelectorAll('polyline')
  polylines.forEach(item => {
    item.addEventListener('click', function () {
      this.remove()
    })
  })
}

//================================================================

// выбор сигнала

const dataSignalSelects = document.querySelectorAll('.signals-data__select')

dataSignalSelects.forEach(item => {
  item.addEventListener('change', function () {
    let signalBlock = this.closest('[data-signalblock]')

    signalBlock.querySelector('input').value = this.value
  })
})
