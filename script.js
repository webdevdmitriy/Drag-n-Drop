const shelf = document.querySelector('.shelf')
const zone = document.querySelector('.zone ')
const zones = document.querySelectorAll('.zone div')
let blocks = document.querySelectorAll('.block')

let isblock = false

//отменяем запрет перетаскивания элементов в другие элементы
// zone.ondragover = e => {
//   e.preventDefault()
// }

zones.forEach(item => (item.ondragover = e => e.preventDefault()))

// shelf.ondragover = e => e.preventDefault()

// Записываем данные перетаскиваемого объекта
blocks.forEach(
  item =>
    (item.ondragstart = e => {
      e.dataTransfer.setData('id', e.target.id)
      e.dataTransfer.setData('zone', e.target.getAttribute('data-zone'))
      let zoneId = e.dataTransfer.getData('zone')

      // e.target.classList.add('dragging')

      item.ondragover = e => {
        zones.forEach(item => {
          if (item.getAttribute('zone') != zoneId)
            item.classList.add('dark-background')
        })
      }

      item.dragend = e => {
        zones.forEach(item => {
          item.classList.remove('dark-background')
        })
      }

      // }
    })
)
// block.ondragstart = e => e.dataTransfer.setData('id', e.target.id)

zone.ondrop = drop
shelf.ondrop = drop

const zone1 = document.querySelector('.zone-1')

function drop(e) {
  let itemId = e.dataTransfer.getData('id')
  let zoneId = e.dataTransfer.getData('zone')
  let zone = document.querySelector(`.zone-${zoneId}`)

  zones.forEach(item => {
    item.classList.remove('dark-background')
  })

  if (
    e.composedPath().includes(zone) &&
    (e.target.querySelector('div') || e.target.classList.contains('block'))
  ) {
    document
      .querySelector('.shelf-' + e.dataTransfer.getData('zone'))
      .append(zone.querySelector('div'))
  }

  // console.log(e.target)
  // console.log(e.target.getAttribute('zone'))
  // console.log(zoneId)

  if (e.composedPath().includes(zone))
    zone.append(document.getElementById(itemId))

  if (itemId != 'block-1') {
    drawLine(itemId)
  }

  // let old = document.querySelector('.dragging')
  // old && old.classList.remove('dragging')
  // old = document.querySelector('.over')
  // old && old.classList.remove('over')
  // let v = e.target

  // document.querySelector('.shelf-' + e.dataTransfer.getData('zone')).append(v)

  // document.querySelector('.shelf-' + e.dataTransfer.getData('zone'))
  // console.log(isblock)
  // document
  //   .querySelector('.shelf-' + e.dataTransfer.getData('zone'))
  //   .append(e.target.querySelector('div'))

  // document
  //   .querySelector('.shelf-' + e.dataTransfer.getData('zone'))
  //   .append(e.target.querySelector('div'))

  // isblock = true
}

counter = 1
blocks.forEach(item => {
  // num1 = randomColor()
  // num2 = randomColor()
  // num3 = randomColor()
  // item.style.backgroundColor = `rgb(${num1},${num2},${num3})`
  counter % 2 == 0 && (item.style.backgroundColor = 'red')
  counter % 3 == 0 && (item.style.backgroundColor = 'blue')
  counter++
})

// function randomColor() {
//   let max = 255
//   let min = 0
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

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
