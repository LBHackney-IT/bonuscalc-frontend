import { numberWithPrecision, wrap } from '@/utils/number'
import { smvhOrUnits, bandForValue } from '@/utils/scheme'
import { truncate } from '@/utils/string'
import { SVGPathData } from 'svg-pathdata'
import { jsPDF } from 'jspdf'
import OpenSans_Regular from './fonts/OpenSans-Regular'
import OpenSans_SemiBold from './fonts/OpenSans-SemiBold'
import OpenSans_Bold from './fonts/OpenSans-Bold'

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

const createPDF = () => {
  const pdf = new jsPDF({ compress: true })

  pdf.addFileToVFS('OpenSans-Regular.ttf', OpenSans_Regular)
  pdf.addFont('OpenSans-Regular.ttf', 'OpenSans', 'normal', 400)

  pdf.addFileToVFS('OpenSans-SemiBold.ttf', OpenSans_SemiBold)
  pdf.addFont('OpenSans-SemiBold.ttf', 'OpenSans', 'normal', 600)

  pdf.addFileToVFS('OpenSans-Bold.ttf', OpenSans_Bold)
  pdf.addFont('OpenSans-Bold.ttf', 'OpenSans', 'normal', 700)

  return pdf
}

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

const drawWeeklyOperativeSummary = (pdf, operative, timesheet, title) => {
  const { week } = timesheet
  const { bonusPeriod } = week

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(24)
  pdf.text(title, 15.7, 22.2)

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

const drawWeeklyNonProductiveTime = (pdf, operative, timesheet) => {
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

  pdf.text('Hours', x, y, { align: 'right' })

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

const drawWeeklyProductiveTime = (pdf, operative, timesheet) => {
  const {
    hasNonProductivePayElements,
    nonProductivePayElements,
    hasProductivePayElements,
    productivePayElements,
    productiveTotal,
    hasAdjustmentPayElements,
    adjustmentPayElements,
    adjustmentTotal,
  } = timesheet

  const numberOfNonProductiveLines = hasNonProductivePayElements
    ? nonProductivePayElements.length
    : 1

  let originX = 17.7
  let originY = 102.9 + numberOfNonProductiveLines * 5.8
  let pageBreak = 27
  let rowOffset = numberOfNonProductiveLines
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

  let row = 0

  if (hasProductivePayElements || !hasAdjustmentPayElements) {
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

    if (hasProductivePayElements) {
      productivePayElements.forEach((payElement) => {
        row = row + 1

        if (row + rowOffset > pageBreak) {
          pdf.addPage()

          originY = 14.0
          row = 1
          rowOffset = 0
          pageBreak = 42

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
  }

  if (hasAdjustmentPayElements) {
    if (hasProductivePayElements) {
      row = row + 2
    }

    if (row + rowOffset + 2 > pageBreak) {
      pdf.addPage()

      originY = 14.0
      row = 1
      rowOffset = 0
      pageBreak = 42
    }

    pdf.setFont('OpenSans', 'normal', 600)
    pdf.setFontSize(9)

    x = originX + 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('Type', x, y)

    x = originX + 48.1
    y = originY + 13.1 + lineHeight * row

    pdf.text('Note', x, y)

    x = originX + width - 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('SMVh', x, y, { align: 'right' })

    pdf.setLineWidth(0.3)

    x1 = originX
    y1 = originY + 14.9 + lineHeight * row
    x2 = originX + width
    y2 = originY + 14.9 + lineHeight * row

    pdf.line(x1, y1, x2, y2, 'S')

    pdf.setFont('OpenSans', 'normal', 400)
    pdf.setLineWidth(0.1)

    adjustmentPayElements.forEach((payElement) => {
      row = row + 1

      if (row + rowOffset > pageBreak) {
        pdf.addPage()

        originY = 14.0
        row = 1
        rowOffset = 0
        pageBreak = 42

        pdf.setFont('OpenSans', 'normal', 600)
        pdf.setFontSize(9)

        x = originX + 3.6
        y = originY + 13.1 + lineHeight * row

        pdf.text('Type', x, y)

        x = originX + 48.1
        y = originY + 13.1 + lineHeight * row

        pdf.text('Note', x, y)

        x = originX + width - 3.6
        y = originY + 13.1 + lineHeight * row

        pdf.text('SMVh', x, y, { align: 'right' })

        pdf.setLineWidth(0.3)

        x1 = originX
        y1 = originY + 14.9 + lineHeight * row
        x2 = originX + width
        y2 = originY + 14.9 + lineHeight * row

        pdf.line(x1, y1, x2, y2, 'S')

        pdf.setFont('OpenSans', 'normal', 400)
        pdf.setLineWidth(0.1)

        row = row + 1
      }

      x = originX + 3.6
      y = originY + 13.1 + lineHeight * row

      pdf.text(payElement.description, x, y)

      if (payElement.comment) {
        x = originX + 48.1
        y = originY + 13.1 + lineHeight * row
        text = truncate(payElement.comment, 75, { omission: ' …' })

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
  }

  row = row + 1

  x = originX + width - 3.6
  y = originY + 13.1 + lineHeight * row
  value = smvhOrUnits(scheme, productiveTotal + adjustmentTotal)
  text = numberWithPrecision(value, 2)

  pdf.text(text, x, y, { align: 'right' })

  x = originX + width - 24.0
  y = originY + 13.1 + lineHeight * row

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.text('Total', x, y, { align: 'right' })
}

const drawOperativeSummary = (pdf, operative) => {
  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(24)
  pdf.text('Bonus – Summary Report', 15.7, 22.2)

  pdf.setFontSize(18)
  pdf.text(operative.name, 17.7, 32.2)

  pdf.setFillColor(223)
  pdf.setLineWidth(0.3)
  pdf.rect(14.3, 35.5, 181.4, 23.9, 'FD')

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(10)

  pdf.text('Employee No:', 17.7, 42.6)
  pdf.text('Trade:', 17.7, 48.5)
  pdf.text('Salary Band:', 17.7, 54.4)

  pdf.text('Section / Team:', 107.6, 42.6)
  pdf.text('Scheme:', 107.6, 48.5)
  pdf.text('Fixed Band:', 107.6, 54.4)

  pdf.setFont('OpenSans', 'normal', 400)

  pdf.text(`${operative.id}`, 45.0, 42.6)
  pdf.text(`${operative.tradeDescription}`, 45.0, 48.5)
  pdf.text(`${operative.salaryBand}`, 45.0, 54.4)

  pdf.text(`${operative.section}`, 136.0, 42.6)
  pdf.text(`${operative.schemeDescription}`, 136.0, 48.5)
  pdf.text(`${operative.fixedBand ? 'Yes' : 'No'}`, 136.0, 54.4)
}

const drawBonusSummary = (pdf, operative, summary) => {
  const originX = 17.7
  const originY = 64.4
  const width = 174.6
  const lineHeight = 5.8

  const {
    bonusPeriod,
    closedWeeklySummaries,
    totalClosedNonProductiveValue,
    totalClosedNonProductiveDuration,
    totalClosedProductiveValue,
    totalClosedValueForBonusPeriod,
    projectedClosedValue,
    averageClosedUtilisation,
  } = summary

  const { scheme } = operative
  const { payBands } = scheme

  let x, y, x1, y1, x2, y2, text, value

  pdf.setFillColor(223)
  pdf.rect(originX, originY, 36.2, 7.0, 'F')

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(14)

  text = `Period ${bonusPeriod.number}, ${bonusPeriod.year}`
  pdf.text(text, 18.8, 69.7)

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(9)

  x = originX + 7.9
  y = originY + 14.2

  pdf.text('Week', x, y, { align: 'center' })

  x = originX + 27.5
  y = originY + 14.2

  pdf.text('Starting on', x, y, { align: 'center' })

  x = originX + 50.8
  y = originY + 14.2

  pdf.text('SMVh (P)', x, y, { align: 'center' })

  x = originX + 73.6
  y = originY + 14.2

  pdf.text('Hours (NP)', x, y, { align: 'center' })

  x = originX + 97.9
  y = originY + 14.2

  pdf.text('SMVh (NP)', x, y, { align: 'center' })

  x = originX + 121.1
  y = originY + 14.2

  pdf.text('Total SMVh', x, y, { align: 'center' })

  x = originX + 144.1
  y = originY + 14.2

  pdf.text('Band', x, y, { align: 'center' })

  x = originX + 162.2
  y = originY + 14.2

  pdf.text('Projected', x, y, { align: 'center' })

  pdf.setLineWidth(0.3)

  x1 = originX
  y1 = originY + 16.5
  x2 = originX + width
  y2 = originY + 16.5

  pdf.line(x1, y1, x2, y2, 'S')

  pdf.setFont('OpenSans', 'normal', 400)
  pdf.setLineWidth(0.1)

  let row = 0

  closedWeeklySummaries.forEach((weeklySummary) => {
    row = row + 1

    x = originX + 7.9
    y = originY + 14.5 + lineHeight * row
    text = `${weeklySummary.number}`

    pdf.text(text, x, y, { align: 'center' })

    x = originX + 27.5
    y = originY + 14.5 + lineHeight * row

    pdf.text(weeklySummary.description, x, y, { align: 'center' })

    x = originX + 55.9
    y = originY + 14.5 + lineHeight * row

    value = smvhOrUnits(scheme, weeklySummary.productiveValue)
    text = numberWithPrecision(value, 2)
    pdf.text(text, x, y, { align: 'right' })

    x = originX + 78.8
    y = originY + 14.5 + lineHeight * row

    text = numberWithPrecision(weeklySummary.nonProductiveDuration, 2)
    pdf.text(text, x, y, { align: 'right' })

    x = originX + 103.0
    y = originY + 14.5 + lineHeight * row

    value = smvhOrUnits(scheme, weeklySummary.nonProductiveValue)
    text = numberWithPrecision(value, 2)
    pdf.text(text, x, y, { align: 'right' })

    x = originX + 126.2
    y = originY + 14.5 + lineHeight * row

    value = smvhOrUnits(scheme, weeklySummary.totalValue)
    text = numberWithPrecision(value, 2)
    pdf.text(text, x, y, { align: 'right' })

    x = originX + 144.1
    y = originY + 14.5 + lineHeight * row

    text = `${bandForValue(
      payBands,
      weeklySummary.totalValue,
      weeklySummary.utilisation
    )}`
    pdf.text(text, x, y, { align: 'center' })

    x = originX + 162.2
    y = originY + 14.5 + lineHeight * row

    text = `${bandForValue(
      payBands,
      weeklySummary.projectedValue,
      weeklySummary.averageUtilisation
    )}`
    pdf.text(text, x, y, { align: 'center' })

    x1 = originX
    y1 = originY + 16.5 + lineHeight * row
    x2 = originX + width
    y2 = originY + 16.5 + lineHeight * row

    pdf.line(x1, y1, x2, y2, 'S')
  })

  row = row + 1

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(9)

  x = originX + 35.9
  y = originY + 15.5 + lineHeight * row

  pdf.text('Totals', x, y, { align: 'right' })

  x = originX + 55.9
  y = originY + 15.5 + lineHeight * row

  value = smvhOrUnits(scheme, totalClosedProductiveValue)
  text = numberWithPrecision(value, 2)
  pdf.text(text, x, y, { align: 'right' })

  x = originX + 78.8
  y = originY + 15.5 + lineHeight * row

  text = numberWithPrecision(totalClosedNonProductiveDuration, 2)
  pdf.text(text, x, y, { align: 'right' })

  x = originX + 103.0
  y = originY + 15.5 + lineHeight * row

  value = smvhOrUnits(scheme, totalClosedNonProductiveValue)
  text = numberWithPrecision(value, 2)
  pdf.text(text, x, y, { align: 'right' })

  x = originX + 126.2
  y = originY + 15.5 + lineHeight * row

  value = smvhOrUnits(scheme, totalClosedValueForBonusPeriod)
  text = numberWithPrecision(value, 2)
  pdf.text(text, x, y, { align: 'right' })

  x = originX + 144.1
  y = originY + 15.5 + lineHeight * row

  text = `${operative.salaryBand}`
  pdf.text(text, x, y, { align: 'center' })

  x = originX + 162.2
  y = originY + 15.5 + lineHeight * row

  text = `${bandForValue(
    payBands,
    projectedClosedValue,
    averageClosedUtilisation
  )}`
  pdf.text(text, x, y, { align: 'center' })

  x = originX + 153.4
  y = originY + 15.5 + lineHeight * row

  x1 = originX + 19.2
  y1 = originY + 18.6 + lineHeight * row
  x2 = originX + 135.2
  y2 = originY + 18.6 + lineHeight * row

  pdf.line(x1, y1, x2, y2, 'S')

  pdf.setLineWidth(0.3)

  x1 = originX + 150.4
  y1 = originY + 14.4 + lineHeight * row
  x2 = originX + 155.6
  y2 = originY + 14.4 + lineHeight * row

  pdf.line(x1, y1, x2, y2, 'S')

  x = originX + 155.6
  y = originY + 14.4 + lineHeight * row

  pdf.lines(
    [
      [-1, -1],
      [1, 1],
      [-1, 1],
    ],
    x,
    y,
    [1, 1],
    'S',
    false
  )

  pdf.setFont('OpenSans', 'normal', 400)

  pdf.text('P: Productive time', originX, originY + 117.1)
  pdf.text('NP: Non-Productive time', originX, originY + 121.3)
}

const drawWeeklyManualOvertime = (pdf, operative, timesheet) => {
  let originX = 17.7
  let originY = 76.6

  const width = 174.6
  const lineHeight = 5.8

  const { hasOvertimeJobs, overtimeJobs, overtimeTotal } = timesheet
  const { hasOvertimeHours, sortedOvertimeHours, week } = timesheet

  if (hasOvertimeHours) {
    let pageBreak = 42
    let rowOffset = 14
    let row = 0

    if (hasOvertimeJobs) {
      if (overtimeJobs.length > 32) {
        originY = 0.5
        rowOffset = 0
        row = wrap(overtimeJobs.length - 32, 42)
      } else {
        row = overtimeJobs.length
      }
    }

    row = row + 3

    if (row + rowOffset > pageBreak) {
      pdf.addPage()

      originY = 0.5
      row = 1
      rowOffset = 0
    }

    let x, y, x1, y1, x2, y2, text

    x = originX
    y = originY + 13.1 + lineHeight * row

    pdf.setFillColor(223)
    pdf.rect(x, y, 21.3, 7.0, 'F')

    x = originX + 1.1
    y = originY + 18.4 + lineHeight * row

    pdf.setFont('OpenSans', 'normal', 700)
    pdf.setFontSize(14)
    pdf.text('Manual', x, y)

    pdf.setFont('OpenSans', 'normal', 600)
    pdf.setFontSize(9)

    x = originX + 3.6
    y = originY + 26.6 + lineHeight * row

    pdf.text('Day', x, y)

    x = originX + 33.6
    y = originY + 26.6 + lineHeight * row

    pdf.text('Address', x, y)

    x = originX + width - 28.6
    y = originY + 26.6 + lineHeight * row

    pdf.text('Hours', x, y, { align: 'center' })

    x = originX + width - 3.6
    y = originY + 26.6 + lineHeight * row

    pdf.text('Value', x, y, { align: 'right' })

    pdf.setLineWidth(0.3)

    x1 = originX
    y1 = originY + 28.4 + lineHeight * row
    x2 = originX + width
    y2 = originY + 28.4 + lineHeight * row

    pdf.line(x1, y1, x2, y2, 'S')

    pdf.setFont('OpenSans', 'normal', 400)
    pdf.setLineWidth(0.1)

    sortedOvertimeHours.forEach((payElement) => {
      row = row + 1

      if (row + rowOffset > pageBreak) {
        pdf.addPage()

        originY = 0.5
        row = 0
        rowOffset = 0

        pdf.setFont('OpenSans', 'normal', 600)
        pdf.setFontSize(9)

        x = originX + 3.6
        y = originY + 26.6 + lineHeight * row

        pdf.text('Day', x, y)

        x = originX + 33.6
        y = originY + 26.6 + lineHeight * row

        pdf.text('Address', x, y)

        x = originX + width - 28.6
        y = originY + 26.6 + lineHeight * row

        pdf.text('Hours', x, y, { align: 'center' })

        x = originX + width - 3.6
        y = originY + 26.6 + lineHeight * row

        pdf.text('Value', x, y, { align: 'right' })

        pdf.setLineWidth(0.3)

        x1 = originX
        y1 = originY + 28.4 + lineHeight * row
        x2 = originX + width
        y2 = originY + 28.4 + lineHeight * row

        pdf.line(x1, y1, x2, y2, 'S')

        pdf.setFont('OpenSans', 'normal', 400)
        pdf.setLineWidth(0.1)

        row = row + 1
      }

      x = originX + 3.6
      y = originY + 26.6 + lineHeight * row
      text = payElement.weekday(week.startAt)

      pdf.text(text, x, y)

      x = originX + 33.6
      y = originY + 26.6 + lineHeight * row
      text = truncate(payElement.comment, 72, { omission: ' …' })

      pdf.text(text, x, y)

      x = originX + width - 25.2
      y = originY + 26.6 + lineHeight * row
      text = numberWithPrecision(payElement.duration, 2)

      pdf.text(text, x, y, { align: 'right' })

      x = originX + width - 3.6
      y = originY + 26.6 + lineHeight * row
      text = numberWithPrecision(payElement.value, 2)

      pdf.text(`£${text}`, x, y, { align: 'right' })

      x1 = originX
      y1 = originY + 28.4 + lineHeight * row
      x2 = originX + width
      y2 = originY + 28.4 + lineHeight * row

      pdf.line(x1, y1, x2, y2, 'S')
    })

    row = row + 1

    x = originX + width - 3.6
    y = originY + 26.6 + lineHeight * row
    text = numberWithPrecision(overtimeTotal, 2)

    pdf.text(`£${text}`, x, y, { align: 'right' })

    x = originX + width - 24.0
    y = originY + 26.6 + lineHeight * row

    pdf.setFont('OpenSans', 'normal', 600)
    pdf.text('Total', x, y, { align: 'right' })
  }
}

const drawWeeklyManualOutOfHours = (pdf, operative, timesheet) => {
  const originX = 17.7
  const originY = 76.6
  const width = 174.6
  const lineHeight = 5.8

  const { hasOutOfHoursRota, outOfHoursRota, week } = timesheet

  let x, y, x1, y1, x2, y2, text

  pdf.setFillColor(223)
  pdf.rect(originX, originY, 21.3, 7.0, 'F')

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(14)
  pdf.text('Manual', 18.8, 81.9)

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(9)

  x = originX + 3.6
  y = originY + 13.1

  pdf.text('Week starting', x, y)

  for (var day = 1; day <= 7; day++) {
    x = originX + 32.7 + day * 13
    y = originY + 13.1
    pdf.text(week.dayOfWeek(day).format('ddd'), x, y, { align: 'center' })
  }

  x = originX + width - 30.0
  y = originY + 13.1

  pdf.text('Days', x, y, { align: 'center' })

  x = originX + width - 3.6
  y = originY + 13.1

  pdf.text('Value', x, y, { align: 'right' })

  pdf.setLineWidth(0.3)

  x1 = originX
  y1 = originY + 14.9
  x2 = originX + width
  y2 = originY + 14.9

  pdf.line(x1, y1, x2, y2, 'S')

  pdf.setFont('OpenSans', 'normal', 400)
  pdf.setLineWidth(0.1)

  let row = 0
  let commentOffset = 0

  if (hasOutOfHoursRota) {
    outOfHoursRota.forEach((payElement) => {
      row = row + 1

      x = originX + 3.6
      y = originY + 13.1 + lineHeight * row

      pdf.text(week.startDate, x, y)

      for (var day = 1; day <= 7; day++) {
        x = originX + 32.7 + day * 13
        y = originY + 13.1 + lineHeight * row
        text = numberWithPrecision(payElement.valueFor(day), 0)

        if (text !== '0') {
          pdf.text(text, x, y, { align: 'center' })
        }
      }

      x = originX + width - 30.0
      y = originY + 13.1 + lineHeight * row
      text = numberWithPrecision(payElement.duration, 0)

      pdf.text(text, x, y, { align: 'center' })

      x = originX + width - 3.6
      y = originY + 13.1 + lineHeight * row
      text = numberWithPrecision(payElement.value, 2)

      pdf.text(`£${text}`, x, y, { align: 'right' })

      if (payElement.comment) {
        commentOffset = -1.5
        row = row + 1

        x = originX + 3.6
        y = originY + 13.1 + commentOffset + lineHeight * row
        text = truncate(payElement.comment, 100, { omission: ' …' })

        pdf.text(text, x, y)
      }
    })
  } else {
    row = row + 1

    x = originX + 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('There are no out of hours entries for this week.', x, y)
  }

  x1 = originX
  y1 = originY + 14.9 + commentOffset + lineHeight * row
  x2 = originX + width
  y2 = originY + 14.9 + commentOffset + lineHeight * row

  pdf.line(x1, y1, x2, y2, 'S')
}

const drawWeeklyPaidWorkOrders = (
  pdf,
  operative,
  timesheet,
  workOrders,
  total,
  message,
  offset,
  hasManual
) => {
  let originX = 17.7
  let originY = 76.6
  let pageBreak = 42
  let rowOffset = 10
  const width = 174.6
  const lineHeight = 5.8

  if (offset) {
    originY = 116.6
    pageBreak = 42
    rowOffset = 18
  }

  let x, y, x1, y1, x2, y2, text

  pdf.setFillColor(223)
  pdf.rect(originX, originY, 33.0, 7.0, 'F')

  pdf.setFont('OpenSans', 'normal', 700)
  pdf.setFontSize(14)
  pdf.text('Work orders', originX + 1.1, originY + 5.3)

  x = originX + 3.6
  y = originY + 13.1

  pdf.setFont('OpenSans', 'normal', 600)
  pdf.setFontSize(9)

  pdf.text('Reference', x, y)

  x = originX + 24.1
  y = originY + 13.1

  pdf.text('Address', x, y)

  x = originX + 72.2
  y = originY + 13.1

  pdf.text('Description', x, y)

  x = originX + width - 3.6
  y = originY + 13.1

  pdf.text('Value', x, y, { align: 'right' })

  pdf.setLineWidth(0.3)

  x1 = originX
  y1 = originY + 14.9
  x2 = originX + width
  y2 = originY + 14.9

  pdf.line(x1, y1, x2, y2, 'S')

  pdf.setFont('OpenSans', 'normal', 400)
  pdf.setLineWidth(0.1)

  let row = 0

  if (workOrders.length > 0) {
    workOrders.forEach((payElement) => {
      row = row + 1

      if (row + rowOffset > pageBreak) {
        pdf.addPage()

        originY = 14.0
        row = 1
        rowOffset = 0

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

        pdf.text('Value', x, y, { align: 'right' })

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
      text = numberWithPrecision(payElement.value, 2)

      pdf.text(`£${text}`, x, y, { align: 'right' })

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

    pdf.text(message, x, y)

    x1 = originX
    y1 = originY + 14.9 + lineHeight * row
    x2 = originX + width
    y2 = originY + 14.9 + lineHeight * row

    pdf.line(x1, y1, x2, y2, 'S')

    x = originX + width - 3.6
    y = originY + 13.1 + lineHeight * row

    pdf.text('£0.00', x, y, { align: 'right' })
  }

  if (!hasManual) {
    row = row + 1

    x = originX + width - 3.6
    y = originY + 13.1 + lineHeight * row
    text = numberWithPrecision(total, 2)

    pdf.text(`£${text}`, x, y, { align: 'right' })

    x = originX + width - 24.0
    y = originY + 13.1 + lineHeight * row

    pdf.setFont('OpenSans', 'normal', 600)
    pdf.text('Total', x, y, { align: 'right' })
  }
}

const drawBandChangeDecision = (pdf, bandChange) => {
  const originX = 17.7
  const originY = 200.0

  pdf.setFontSize(9)
  pdf.setFont('OpenSans', 'normal', 600)

  pdf.text('Changed to:', originX, originY)
  pdf.text(`${bandChange.decision} on:`, originX, originY + 5.8)
  pdf.text(`${bandChange.decision} by:`, originX, originY + 11.6)

  if (bandChange.isSupervisorRejected) {
    pdf.text('Reason:', originX, originY + 21.3)
  }

  pdf.setFont('OpenSans', 'normal', 400)
  pdf.text(bandChange.changedTo, originX + 24.0, originY)
  pdf.text(bandChange.decisionOn, originX + 24.0, originY + 5.8)
  pdf.text(bandChange.decisionBy, originX + 24.0, originY + 11.6)

  if (bandChange.isSupervisorRejected) {
    pdf.text(bandChange.reason, originX, originY + 27.1, {
      maxWidth: 100,
      lineHeightFactor: 1.4,
    })
  }
}

export const generateWeeklyReport = (operative, timesheet) => {
  const pdf = createPDF()

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawWeeklyOperativeSummary(
      pdf,
      operative,
      timesheet,
      'Bonus – Weekly Report'
    )
  })

  withGraphicsState(pdf, () => {
    drawWeeklyNonProductiveTime(pdf, operative, timesheet)
  })

  withGraphicsState(pdf, () => {
    drawWeeklyProductiveTime(pdf, operative, timesheet)
  })

  return pdf
}

export const generateSummaryReport = (operative, summary) => {
  const pdf = createPDF()

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawOperativeSummary(pdf, operative)
  })

  withGraphicsState(pdf, () => {
    drawBonusSummary(pdf, operative, summary)
  })

  return pdf
}

export const generateCombinedReport = (operative, summary, timesheets) => {
  const pdf = createPDF()

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawOperativeSummary(pdf, operative)
  })

  withGraphicsState(pdf, () => {
    drawBonusSummary(pdf, operative, summary)
  })

  timesheets.forEach((timesheet) => {
    pdf.addPage()

    withGraphicsState(pdf, () => {
      drawLogo(pdf)
    })

    withGraphicsState(pdf, () => {
      drawWeeklyOperativeSummary(
        pdf,
        operative,
        timesheet,
        'Bonus – Weekly Report'
      )
    })

    withGraphicsState(pdf, () => {
      drawWeeklyNonProductiveTime(pdf, operative, timesheet)
    })

    withGraphicsState(pdf, () => {
      drawWeeklyProductiveTime(pdf, operative, timesheet)
    })

    if (timesheet.hasOutOfHoursRota || timesheet.hasOutOfHoursJobs) {
      pdf.addPage()

      withGraphicsState(pdf, () => {
        drawLogo(pdf)
      })

      withGraphicsState(pdf, () => {
        drawWeeklyOperativeSummary(
          pdf,
          operative,
          timesheet,
          'Bonus – Out of hours Report'
        )
      })

      withGraphicsState(pdf, () => {
        drawWeeklyManualOutOfHours(pdf, operative, timesheet)
      })

      withGraphicsState(pdf, () => {
        drawWeeklyPaidWorkOrders(
          pdf,
          operative,
          timesheet,
          timesheet.outOfHoursJobs,
          timesheet.outOfHoursTotal,
          'There are no out of hours work orders for this week.',
          true,
          false
        )
      })
    }

    if (timesheet.hasOvertimeHours || timesheet.hasOvertimeJobs) {
      pdf.addPage()

      withGraphicsState(pdf, () => {
        drawLogo(pdf)
      })

      withGraphicsState(pdf, () => {
        drawWeeklyOperativeSummary(
          pdf,
          operative,
          timesheet,
          'Bonus – Overtime Report'
        )
      })

      withGraphicsState(pdf, () => {
        drawWeeklyPaidWorkOrders(
          pdf,
          operative,
          timesheet,
          timesheet.overtimeJobs,
          timesheet.overtimeTotal,
          'There are no overtime work orders for this week.',
          timesheet.hasOvertimeHours
        )
      })

      withGraphicsState(pdf, () => {
        drawWeeklyManualOvertime(pdf, operative, timesheet)
      })
    }
  })

  return pdf
}

export const generateOvertimeReport = (operative, timesheet) => {
  const pdf = createPDF()

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawWeeklyOperativeSummary(
      pdf,
      operative,
      timesheet,
      'Bonus – Overtime Report'
    )
  })

  withGraphicsState(pdf, () => {
    drawWeeklyPaidWorkOrders(
      pdf,
      operative,
      timesheet,
      timesheet.overtimeJobs,
      timesheet.overtimeTotal,
      'There are no overtime work orders for this week.',
      false,
      timesheet.hasOvertimeHours
    )
  })

  withGraphicsState(pdf, () => {
    drawWeeklyManualOvertime(pdf, operative, timesheet)
  })

  return pdf
}

export const generateOutOfHoursReport = (operative, timesheet) => {
  const pdf = createPDF()

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawWeeklyOperativeSummary(
      pdf,
      operative,
      timesheet,
      'Bonus – Out of hours Report'
    )
  })

  withGraphicsState(pdf, () => {
    drawWeeklyManualOutOfHours(pdf, operative, timesheet)
  })

  withGraphicsState(pdf, () => {
    drawWeeklyPaidWorkOrders(
      pdf,
      operative,
      timesheet,
      timesheet.outOfHoursJobs,
      timesheet.outOfHoursTotal,
      'There are no out of hours work orders for this week.',
      true,
      false
    )
  })

  return pdf
}

export const generateBandChangeReport = (operative, bandChange) => {
  const pdf = createPDF()

  withGraphicsState(pdf, () => {
    drawLogo(pdf)
  })

  withGraphicsState(pdf, () => {
    drawOperativeSummary(pdf, operative)
  })

  withGraphicsState(pdf, () => {
    drawBonusSummary(pdf, operative, bandChange)
  })

  withGraphicsState(pdf, () => {
    drawBandChangeDecision(pdf, bandChange)
  })

  return pdf
}
