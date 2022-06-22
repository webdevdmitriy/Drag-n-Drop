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
  showDataSignal()
}

function handlerDragEnter(e) {
  // console.log(e.dataTransfer.getData('zone'))
}
function handlerDragLeave() {}

//===================================================================================
// Рисуем линию

let zoneY = zone.getBoundingClientRect().top
let zoneX = zone.getBoundingClientRect().left

function drawLine(item1, item2) {
  console.log(item1)
  console.log(item2)
  let react1 = item1 && item1.getBoundingClientRect()
  let react2 = item2 && item2.getBoundingClientRect()

  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'

  line.setAttribute('x1', react1.left - zoneX)
  line.setAttribute('y1', react1.top - zoneY + react1.height - 10)
  line.setAttribute('x2', react2.left - zoneX)
  line.setAttribute('y2', react2.top - zoneY - 10)

  let svg = document.querySelector('svg')
  svg.append(line)
}

// Рисование линии обратной связи
function drawLineFeedBack(block1, block2) {
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
  line.style.stroke = 'rgb(255, 0, 0)'
  line.style.strokeWidth = '2'
  line.style.fill = 'none'

  let react1 = block1.getBoundingClientRect()
  let react2 = block2.getBoundingClientRect()

  let points = ''
  points += `${react1.right - zoneX - 5}, ${react1.top - zoneY + react1.height - zoneY - 10} `
  points += `${react1.right - zoneX - 5}, ${react1.top - zoneY + react1.height - zoneY - 10 + 20} `
  points += `${react1.right - zoneX - 5 + 80}, ${react1.top - zoneY + react1.height - zoneY - 10 + 20} `
  points += `${react1.right - zoneX - 5 + 80}, ${react1.top - zoneY + react1.height - 10} `
  points += `${react1.right - zoneX - 5 + 80}, ${react2.top - zoneY - 10 - 10} `
  points += `${react2.right - zoneX - 5}, ${react2.top - zoneY - 10 - 10} `
  points += `${react2.right - zoneX - 5}, ${react2.top - zoneY - 10} `
  line.setAttribute('points', points)
  let svg = document.querySelector('svg')
  svg.append(line)
}

//================================================================
// Добавление входов и выходов для каждого блока
dragsItems.forEach(function (item) {
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
      item.addEventListener('click', function () {
        let block2 = item.parentNode
        drawLineFeedBack(block1, block2)
      })
    })
  })
})

//========================================================
// выбор сигнала

const dataSignalSelect = document.querySelector('.data-signal_select')
const dataSignalInput = document.querySelector('.data-signal_input')

dataSignalSelect.addEventListener('change', function () {
  dataSignalInput.value = this.value
  if (this.value != 0) document.querySelector('.point').style.backgroundColor = 'green'
  else document.querySelector('.point').style.backgroundColor = 'red'
})

function showDataSignal() {
  if (document.querySelector('.zone-1').hasChildNodes()) {
    document.querySelector('.data-signal_block').style.display = 'block'
  }
}
