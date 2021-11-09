import { numberWithPrecision } from '@/utils/number'
import { smvhOrUnits } from '@/utils/scheme'
import { truncate } from '@/utils/string'
import { SVGPathData } from 'svg-pathdata'
import { jsPDF } from 'jspdf'
import './fonts/OpenSans-Regular'
import './fonts/OpenSans-SemiBold'
import './fonts/OpenSans-Bold'

const LOGO = `
  M36 15.999C36 9.039 32.058 3.005 26.291 0v12.033H9.709V0
  C3.941 3.005 0 9.04 0 15.999 0 22.96 3.94 28.996 9.709 32
  V19.967h16.582V32C32.058 28.996 36 22.96 36 15.999M42 1
  h8.859v10.13h8.28V1H68v29h-8.862V18.57H50.86V30H42V1m49.015
  15.185c0-4.032.08-8.185-10.085-8.185-5.042 0-10.7.968-10.945
  6.855h7.542c.043-.913.534-2.173 3.035-2.173 1.31 0 2.663.527
  2.663 1.95 0 1.34-1.107 1.665-2.213 1.869C76.87 17.273 69
  17.029 69 23.689 69 28.076 72.402 30 76.504 30c2.622 0 5.12
  -.564 6.842-2.485h.084c-.043.522.082 1.37.286 1.934H92c-.905
  -1.333-.985-3.109-.985-4.681v-8.583zm-7.79 5.802c-.123 2.177
  -1.556 3.266-3.403 3.266-1.473 0-2.54-.97-2.54-1.936 0-1.411
  .944-1.854 2.746-2.256 1.106-.241 2.213-.525 3.197-1.007v1.933
  zm23.684-5.507c-.085-.848-.376-1.533-.92-1.965-.5-.443-1.208
  -.684-2.084-.684-3.169 0-3.63 2.656-3.63 5.191 0 2.535.461
  5.147 3.63 5.147 1.792 0 3.044-1.409 3.211-3.055H115c-.794
  5.693-5.422 8.886-11.262 8.886C97.224 30 92 25.638 92 19.017
  92 12.402 97.224 8 103.738 8c5.671 0 10.511 2.706 11.011 8.48
  h-7.84M115 1h8.246v14.016l5.238-6.08h9.31l-7.69 7.945L139 30
  h-9.893l-4.406-7.649-1.455 1.545V30H115V1m24 7.552h7.794v2.716
  h.08C148.376 9.118 150.529 8 153.737 8 157.53 8 161 10.358 161
  15.286V30h-8.08V18.756c0-2.478-.285-4.215-2.636-4.215-1.38 0
  -3.206.702-3.206 4.134V30H139V8.552m46 12.213C185 12.609 181.403
  8 173.076 8 166.446 8 162 12.93 162 19.034 162 26.062 167.055
  30 173.763 30c4.769 0 9.176-2.09 10.794-6.588h-7.48c-.64 1.001
  -2.057 1.494-3.35 1.494-2.508 0-3.882-1.725-4.086-4.141H185z
  m-15.315-4.143c.361-2.273 1.735-3.531 4.117-3.531 2.063 0 3.516
  1.582 3.516 3.531h-7.633zM200.955 28.522c-.656 1.874-1.392 4.277
  -2.662 5.87-2.129 2.649-5.405 2.608-8.56 2.608h-3.685v-6.442
  h1.882c.82 0 1.884.083 2.46-.203.49-.243.776-.652.776-1.588 0
  -1.02-3.112-8.803-3.562-10.026L184 9h8.681l3.401 12.145h.082
  L199.604 9H208l-7.045 19.522
`

const drawSVGPath = (pdf, data, location, scale) => {
  const [x, y] = location ? location : [0, 0]
  const [scaleX, scaleY] = scale ? scale : [1, 1]

  const path = new SVGPathData(data)
  const normalizedPath = path
    .toAbs()
    .normalizeHVZ()
    .scale(scaleX, scaleY)
    .translate(x, y)

  normalizedPath.commands.forEach((cmd) => {
    switch (cmd.type) {
      case SVGPathData.MOVE_TO:
        pdf.moveTo(cmd.x, cmd.y)
        break

      case SVGPathData.LINE_TO:
        pdf.lineTo(cmd.x, cmd.y)
        break

      case SVGPathData.CURVE_TO:
        pdf.curveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
        break

      case SVGPathData.CLOSE_PATH:
        pdf.close()
        break

      default:
        console.log(`Unexpected command type: ${cmd.type}`)
    }
  })

  pdf.fillEvenOdd()
}

const withGraphicsState = (pdf, block) => {
  pdf.saveGraphicsState()
  block.apply(null)
  pdf.restoreGraphicsState()
}

const drawLogo = (pdf) => {
  drawSVGPath(pdf, LOGO, [154.3, 16.3], [0.2, 0.2])
}

const drawSummary = (pdf, operative, timesheet) => {
  const { week } = timesheet
  const { bonusPeriod } = week

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(24)
  pdf.text('Bonus – Weekly Report', 15.7, 22.2)

  pdf.setFontSize(18)
  pdf.text(operative.name, 17.7, 32.2)

  pdf.setFillColor(223)
  pdf.setLineWidth(0.3)
  pdf.rect(14.3, 35.5, 181.4, 35.7, 'FD')

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(10)

  pdf.text('Employee No:', 17.7, 42.6)
  pdf.text('Trade:', 17.7, 48.5)
  pdf.text('Salary Band:', 17.7, 54.4)
  pdf.text('Period:', 17.7, 60.3)
  pdf.text('Week Starting:', 17.7, 66.2)

  pdf.text('Section / Team:', 107.6, 42.6)
  pdf.text('Scheme:', 107.6, 48.5)
  pdf.text('Fixed Band:', 107.6, 54.4)
  pdf.text('Period Year:', 107.6, 60.3)
  pdf.text('Week No:', 107.6, 66.2)

  pdf.setFont('OpenSans', 'normal', 400)

  pdf.text(`${operative.id}`, 45.0, 42.6)
  pdf.text(`${operative.tradeDescription}`, 45.0, 48.5)
  pdf.text(`${operative.salaryBand}`, 45.0, 54.4)
  pdf.text(`${bonusPeriod.number}`, 45.0, 60.3)
  pdf.text(`${week.startDate}`, 45.0, 66.2)

  pdf.text(`${operative.section}`, 136.0, 42.6)
  pdf.text(`${operative.schemeDescription}`, 136.0, 48.5)
  pdf.text(`${operative.fixedBand ? 'Yes' : 'No'}`, 136.0, 54.4)
  pdf.text(`${bonusPeriod.year}`, 136.0, 60.3)
  pdf.text(`${week.number}`, 136.0, 66.2)
}

const drawNonProductiveTime = (pdf, operative, timesheet) => {
  const originX = 17.7
  const originY = 76.6
  const width = 174.6
  const lineHeight = 5.8

  const {
    hasNonProductivePayElements,
    nonProductivePayElements,
    nonProductiveDuration,
    nonProductiveTotal,
  } = timesheet

  const { scheme } = operative

  let x, y, x1, y1, x2, y2, text, value

  pdf.setFillColor(223)
  pdf.rect(originX, originY, 40.5, 7.0, 'F')

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(14)
  pdf.text('Non-Productive', 18.8, 81.9)

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(9)

  x = originX + 3.6
  y = originY + 13.1

  pdf.text('Pay element', x, y)

  x = originX + 58.5
  y = originY + 13.1

  pdf.text('Note', x, y)

  x = originX + width - 24.0
  y = originY + 13.1

  pdf.text('Hours (AT)', x, y, { align: 'right' })

  x = originX + width - 3.6
  y = originY + 13.1

  pdf.text('SMVh', x, y, { align: 'right' })

  pdf.setLineWidth(0.3)

  x1 = originX
  y1 = originY + 14.9
  x2 = originX + width
  y2 = originY + 14.9

  pdf.line(x1, y1, x2, y2, 'S')

  pdf.setFont('OpenSans', 'normal', 400)
  pdf.setLineWidth(0.1)

  let row = 0

  if (hasNonProductivePayElements) {
    nonProductivePayElements.forEach((payElement) => {
      row = row + 1

      x = originX + 3.6
      y = originY + 13.1 + lineHeight * row

      pdf.text(payElement.description, x, y)

      if (payElement.comment) {
        x = originX + 58.5
        y = originY + 13.1 + lineHeight * row
        text = truncate(payElement.comment, 50, { omission: ' …' })

        pdf.text(text, x, y)
      }

      x = originX + width - 24.0
      y = originY + 13.1 + lineHeight * row
      text = numberWithPrecision(payElement.duration, 2)

      pdf.text(text, x, y, { align: 'right' })

      x = originX + width - 3.6
      y = originY + 13.1 + lineHeight * row
      value = smvhOrUnits(scheme, payElement.value)
      text = numberWithPrecision(value, 2)

      pdf.text(text, x, y, { align: 'right' })

      x1 = originX
      y1 = originY + 14.9 + lineHeight * row
      x2 = originX + width
      y2 = originY + 14.9 + lineHeight * row

      pdf.line(x1, y1, x2, y2, 'S')
    })
  } else {
    row = row + 1

    x = originX + 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('There are no non-productive items for this week.', x, y)

    x1 = originX
    y1 = originY + 14.9 + lineHeight * row
    x2 = originX + width
    y2 = originY + 14.9 + lineHeight * row

    pdf.line(x1, y1, x2, y2, 'S')

    x = originX + width - 24.0
    y = originY + 13.1 + lineHeight * row

    pdf.text('0.00', x, y, { align: 'right' })

    x = originX + width - 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('0.00', x, y, { align: 'right' })
  }

  row = row + 1

  x = originX + width - 24.0
  y = originY + 13.1 + lineHeight * row
  text = numberWithPrecision(nonProductiveDuration, 2)

  pdf.text(text, x, y, { align: 'right' })

  x = originX + width - 3.6
  y = originY + 13.1 + lineHeight * row
  value = smvhOrUnits(scheme, nonProductiveTotal)
  text = numberWithPrecision(value, 2)

  pdf.text(text, x, y, { align: 'right' })

  x = originX + width - 42.2
  y = originY + 13.1 + lineHeight * row

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.text('Total', x, y, { align: 'right' })
}

const drawProductiveTime = (pdf, operative, timesheet) => {
  const {
    hasNonProductivePayElements,
    nonProductivePayElements,
    hasProductivePayElements,
    productivePayElements,
    productiveTotal,
  } = timesheet

  const numberOfNonProductiveLines = hasNonProductivePayElements
    ? nonProductivePayElements.length
    : 1

  let originX = 17.7
  let originY = 102.9 + numberOfNonProductiveLines * 5.8
  const width = 174.6
  const lineHeight = 5.8

  const { scheme } = operative

  let x, y, x1, y1, x2, y2, text, value

  pdf.setFillColor(223)
  pdf.rect(originX, originY, 28.9, 7.0, 'F')

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(14)
  pdf.text('Productive', 18.8, originY + 5.3)

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(9)

  x = originX + 3.6
  y = originY + 13.1

  pdf.text('Reference', x, y)

  x = originX + 24.1
  y = originY + 13.1

  pdf.text('Address', x, y)

  x = originX + 72.2
  y = originY + 13.1

  pdf.text('Description', x, y)

  x = originX + width - 3.6
  y = originY + 13.1

  pdf.text('SMVh', x, y, { align: 'right' })

  pdf.setLineWidth(0.3)

  x1 = originX
  y1 = originY + 14.9
  x2 = originX + width
  y2 = originY + 14.9

  pdf.line(x1, y1, x2, y2, 'S')

  pdf.setFont('OpenSans', 'normal', 400)
  pdf.setLineWidth(0.1)

  let row = 0

  if (hasProductivePayElements) {
    productivePayElements.forEach((payElement) => {
      row = row + 1

      if (row + numberOfNonProductiveLines > 27) {
        pdf.addPage()

        originY = 14.0
        row = 1

        pdf.setFont('OpenSans', 'normal', 600)
        pdf.setFontSize(9)

        x = originX + 3.6
        y = originY + 13.1

        pdf.text('Reference', x, y)

        x = originX + 24.1
        y = originY + 13.1

        pdf.text('Address', x, y)

        x = originX + 72.2
        y = originY + 13.1

        pdf.text('Description', x, y)

        x = originX + width - 3.6
        y = originY + 13.1

        pdf.text('SMVh', x, y, { align: 'right' })

        pdf.setLineWidth(0.3)

        x1 = originX
        y1 = originY + 14.9
        x2 = originX + width
        y2 = originY + 14.9

        pdf.line(x1, y1, x2, y2, 'S')

        pdf.setFont('OpenSans', 'normal', 400)
        pdf.setLineWidth(0.1)
      }

      x = originX + 3.6
      y = originY + 13.1 + lineHeight * row

      pdf.text(payElement.workOrder, x, y)

      if (payElement.address) {
        x = originX + 24.1
        y = originY + 13.1 + lineHeight * row
        text = truncate(payElement.address, 25, { omission: ' …' })

        pdf.text(text, x, y)
      }

      if (payElement.comment) {
        x = originX + 72.2
        y = originY + 13.1 + lineHeight * row
        text = truncate(payElement.comment, 50, { omission: ' …' })

        pdf.text(text, x, y)
      }

      x = originX + width - 3.6
      y = originY + 13.1 + lineHeight * row
      value = smvhOrUnits(scheme, payElement.value)
      text = numberWithPrecision(value, 2)

      pdf.text(text, x, y, { align: 'right' })

      x1 = originX
      y1 = originY + 14.9 + lineHeight * row
      x2 = originX + width
      y2 = originY + 14.9 + lineHeight * row

      pdf.line(x1, y1, x2, y2, 'S')
    })
  } else {
    row = row + 1

    x = originX + 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('There are no productive items for this week.', x, y)

    x1 = originX
    y1 = originY + 14.9 + lineHeight * row
    x2 = originX + width
    y2 = originY + 14.9 + lineHeight * row

    pdf.line(x1, y1, x2, y2, 'S')

    x = originX + width - 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('0.00', x, y, { align: 'right' })
  }

  row = row + 1

  x = originX + width - 3.6
  y = originY + 13.1 + lineHeight * row
  value = smvhOrUnits(scheme, productiveTotal)
  text = numberWithPrecision(value, 2)

  pdf.text(text, x, y, { align: 'right' })

  x = originX + width - 24.0
  y = originY + 13.1 + lineHeight * row

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.text('Total', x, y, { align: 'right' })
}

export const generateWeeklyReport = (operative, timesheet) => {
  const pdf = new jsPDF({ compress: true })

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawSummary(pdf, operative, timesheet)
  })

  withGraphicsState(pdf, () => {
    drawNonProductiveTime(pdf, operative, timesheet)
  })

  withGraphicsState(pdf, () => {
    drawProductiveTime(pdf, operative, timesheet)
  })

  return pdf
}