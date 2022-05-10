// import {Util, generatorTest} from './util/util'

function getPosition(element: HTMLElement, clientX: number, clientY: number): {x: number, y: number} {
  const rect = element.getBoundingClientRect()
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

class App {
  private ctx: CanvasRenderingContext2D
  private cursorPos = {x: -1, y: -1}
  private drawing = false

  constructor(private canvas: HTMLCanvasElement) {
    console.log(this.canvas)

    this.ctx = this.canvas.getContext('2d')!

    this.initialize()
    this.canvas.addEventListener('mousedown', (event) => {
      if (event.button !== 0)
        return false
      this.cursorPos = getPosition(this.canvas, event.clientX, event.clientY);
      this.drawing = true
      return true
    })
    document.addEventListener('mousemove', (event) => {
      if (!this.drawing)
        return
      const curr = getPosition(this.canvas, event.clientX, event.clientY);
      this.ctx.lineWidth = 16
      this.ctx.lineCap = 'round'
      this.ctx.beginPath()
      this.ctx.moveTo(this.cursorPos.x, this.cursorPos.y)
      this.ctx.lineTo(curr.x, curr.y)
      this.ctx.stroke()
      this.ctx.closePath()
      this.cursorPos = curr
    })
    document.addEventListener('mouseup', (_event) => {
      this.drawing = false
    })
  }

  initialize(): void {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.fillRect(0, 0, 449, 449)
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(0, 0, 449, 449)
    this.ctx.lineWidth = 0.05
    for (let i = 0; i < 27; i++) {
      this.ctx.beginPath()
      this.ctx.moveTo((i + 1) * 16,   0)
      this.ctx.lineTo((i + 1) * 16, 449)
      this.ctx.closePath()
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.moveTo(  0, (i + 1) * 16)
      this.ctx.lineTo(449, (i + 1) * 16)
      this.ctx.closePath()
      this.ctx.stroke()
    }
  }

  run(): void {
  }
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('mycanvas') as HTMLCanvasElement
  const app = new App(canvas)
  app.run()
})
