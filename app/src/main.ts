import * as tf from '@tensorflow/tfjs'

const BG_COLOR = '#F0F0F0'

const CLASS = 'あいうえおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろわをん愛悪圧安暗案以位依囲委意易異移胃遺医育一壱印員因引飲院右雨運雲営栄永泳英衛液益駅円園延演遠塩央往応横王黄億屋恩温音下化仮何価加可夏家科果歌河火花荷課貨過我画芽賀会解回快改械海界絵開階貝外害各拡格確覚角革学楽額活株寒刊勧完官幹感慣歓漢管観間関館岸眼岩顔願喜器基寄希旗期機帰気汽季紀規記貴起技疑義議客逆久休宮急救求球究級給旧牛去居挙許漁魚京供競共協境強教橋興鏡業局曲極玉勤均禁近金銀九句区苦具空君訓群軍郡係兄型形敬景系経計軽芸欠決潔結血月件健兼券建憲検権犬研絹県見険験元原厳減現言限個古固己庫戸故湖五午後語誤護交候光公功効厚口向后孝工幸広康校構港皇耕考航行講鉱高号合告国穀黒今根混左差査再最妻才採済災祭細菜際在材罪財坂作昨策刷察殺雑三参山散産算蚕賛酸残仕使司史四士始姉子市師志思指支止死氏私糸紙至視詞詩試資歯事似児字寺持時次治示耳自辞式識七失室質実舎写社者謝車借釈弱主取守手種酒首受授需収周宗就州修拾秋終習衆週集住十従重宿祝出術述春準純順処初所暑書諸助女序除勝商唱小少承招昭消焼照省称章証象賞上乗場常情条状植織職色食信心新森深申真神臣親身進人仁図推水数世是制勢性成政整星晴正清生精聖声製西誠青静税席石積績責赤切接折設節説雪絶舌先千宣専川戦浅線船選銭前善然全祖素組創倉想早争相総草走送像増蔵造側則息測足速俗属族続卒存孫尊損村他多太打体対帯待態貸退隊代台大第題達谷単炭短団断男談知地池置築竹茶着中忠昼柱注虫著貯丁帳張朝町腸調長鳥直賃追通低停定底庭弟提程敵的適鉄典天展店転点伝田電徒登都努度土党冬刀島投東湯燈当等答統討頭働動同堂導童道銅得徳特毒独読届内南難二弐肉日入任認熱年念燃納能農波派破馬拝敗配倍買売博白麦畑八発判半反板版犯飯番否悲比皮肥費非飛備美鼻必筆百俵標氷票表評病秒品貧不付夫婦富布府父負武部風復幅服福複仏物分奮粉文聞兵平陛米別変編辺返便勉弁保歩補墓母包報放方法豊暴望貿防北牧本妹毎末万満味未脈民務無名命明盟迷鳴綿面毛木目問門夜野役約薬訳油輸勇友有由遊夕予余預容曜様洋用葉要陽養欲浴来落利理里陸律率立略流留旅両料良量領力緑林臨輪類令例冷礼歴列練連路労老六録論和話'

class Vector2 {
  constructor(public x: number, public y: number) {}
}

function setMouseDragListener(mouseMove: any, mouseUp?: (e)=>void, useCapture?: any) {
  let mouseLeave: ((e)=>boolean) | undefined

  if (typeof mouseMove === 'object') {
    const option = mouseMove
    mouseMove = option.move
    mouseUp = option.up
    mouseLeave = option.leave
    useCapture = option.useCapture
  }

  const mouseUpDelegate = ($event) => {
    if (mouseUp)
      mouseUp($event)
    unlisten()
  }

  const mouseLeaveDelegate = (mouseLeave == null ? null : ($event) => {
console.log('mouseLeave!')
    if (mouseLeave!($event))
      unlisten()
  })

  const unlisten = () => {
    document.removeEventListener('mousemove', mouseMove, useCapture)
    document.removeEventListener('touchmove', mouseMove, useCapture)
    document.removeEventListener('mouseup', mouseUpDelegate, useCapture)
    document.removeEventListener('touchend', mouseUpDelegate, useCapture)
    if (mouseLeaveDelegate) {
      document.removeEventListener('mouseleave', mouseLeaveDelegate, useCapture)
      document.removeEventListener('touchcancel', mouseLeaveDelegate, useCapture)
    }
  }

  document.addEventListener('mousemove', mouseMove, useCapture)
  document.addEventListener('touchmove', mouseMove, useCapture)
  document.addEventListener('mouseup', mouseUpDelegate, useCapture)
  document.addEventListener('touchend', mouseUpDelegate, useCapture)
  if (mouseLeaveDelegate) {
    document.addEventListener('mouseleave', mouseLeaveDelegate, useCapture)
    document.addEventListener('touchcancel', mouseLeaveDelegate, useCapture)
  }
}

function getMousePosition(event, canvas: HTMLCanvasElement): Vector2 {
  let clientX: number, clientY: number
  if (event.changedTouches) {
    const touch = event.changedTouches[0]
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }
  const rect = canvas.getBoundingClientRect()
  return new Vector2(
    (clientX - rect.left) * canvas.width / rect.width,
    (clientY - rect.top) * canvas.height / rect.height)
}

function percent(value: number): string {
  const v = Math.round(value * 10000)
  return `${Math.floor(v / 100)}.${(v % 100).toString().padStart(2, '0')}%`
}

function line(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
}

class App {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasWidth: number
  private strokes: Array<Array<Vector2>> = []

  private statusElement: HTMLElement

  private miniCanvas: HTMLCanvasElement
  private miniCanvasContext: CanvasRenderingContext2D

  private resultRows: HTMLCollectionOf<HTMLElement>
  private resultChrs: HTMLCollectionOf<HTMLElement>
  private resultPercents: HTMLCollectionOf<HTMLElement>

  private inputShape: number[]

  constructor(private model: tf.GraphModel) {
    this.statusElement = document.getElementById('status')!

    this.inputShape = model.inputs[0].shape!
    this.miniCanvas = document.getElementById('mini') as HTMLCanvasElement
    this.miniCanvas.width = this.inputShape[this.inputShape.length - 2]
    this.miniCanvas.height = this.inputShape[this.inputShape.length - 3]
    this.miniCanvasContext = this.miniCanvas.getContext('2d')!

    this.resultRows = document.getElementsByClassName('result-row') as HTMLCollectionOf<HTMLElement>
    this.resultChrs = document.getElementsByClassName('result-chr') as HTMLCollectionOf<HTMLElement>
    this.resultPercents = document.getElementsByClassName('result-percent') as HTMLCollectionOf<HTMLElement>

    const canvas = document.getElementById('mycanvas') as HTMLCanvasElement
    const parentRect = canvas.parentElement!.getBoundingClientRect()
    const width = parentRect.width
    this.canvasWidth = width * window.devicePixelRatio
    canvas.width = canvas.height = this.canvasWidth
    this.canvas = canvas

    this.context = canvas.getContext('2d')!
    this.context.lineWidth = window.devicePixelRatio

    const mouseDown = (event) => this.mouseDown(event)
    const passive = {passive: false}
    canvas.addEventListener('mousedown', mouseDown, passive)
    canvas.addEventListener('touchstart', mouseDown, passive)

    document.getElementById('clear')!.addEventListener('click', (_event) => {
      this.clear()
    })

    this.clear()
  }

  clear(): void {
    this.strokes.length = 0
    this.drawMini()

    this.context.fillStyle = BG_COLOR
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.lineWidth = window.devicePixelRatio
    this.context.strokeStyle = 'rgba(128, 128, 255, 0.5)'
    this.context.setLineDash([8, 8])
    line(this.context, 0, this.canvasWidth / 2, this.canvasWidth, this.canvasWidth / 2)
    line(this.context, this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasWidth)
    this.context.setLineDash([])

    this.statusElement.style.display = 'none'
  }

  mouseDown(event): void {
    if (event.type === 'mousedown' && event.button !== 0)
      return
    event.preventDefault()

    const canvas = this.canvas
    const points: Array<Vector2> = []
    let lastPos = getMousePosition(event, canvas)
    points.push(lastPos)

    const upFunc = (_event) => {
      if (points.length >= 2)
        this.strokes.push(points)
      this.drawMini()
      this.recognize()
      return true
    }

    setMouseDragListener({
      move: (event) => {
        const pos = getMousePosition(event, canvas)
        const context = this.context

        context.strokeStyle = '#000'
        context.lineWidth = this.canvasWidth / this.inputShape[this.inputShape.length - 2]
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(lastPos.x, lastPos.y)
        context.lineTo(pos.x, pos.y)
        context.stroke()
        lastPos = pos

        points.push(pos)
      },
      up: upFunc,
      leave: upFunc,
    })
  }

  drawMini(): void {
    const context = this.miniCanvasContext
    const w = this.miniCanvas.width
    const S = 2
    context.fillStyle = '#000'
    context.fillRect(0, 0, w, w)
    context.lineWidth = S

    const invW = w / this.canvasWidth
    for (const points of this.strokes) {
      context.strokeStyle = '#fff'
      context.beginPath()
      points.forEach((pos, i) => {
        if (i === 0)
          context.moveTo(pos.x * invW, pos.y * invW)
        else
          context.lineTo(pos.x * invW, pos.y * invW)
      })
      context.stroke()
    }
  }

  recognize(): void {
    tf.tidy(() => {
      const x = tf.browser.fromPixels(this.miniCanvas, 1).expandDims().toFloat()
      const y = this.model.predict(x, {batchSize: 1}) as tf.Tensor
      const yArray = y.arraySync()
      const probabilities = yArray[0]

      const order = [...Array(probabilities.length)].map((_, i) => i).filter(i => probabilities[i] >= 0.005)
      order.sort((a, b) => probabilities[b] - probabilities[a])
      for (let i = 0; i < this.resultRows.length; ++i) {
        const row = this.resultRows[i]
        if (i >= order.length) {
          row.className = `result-row prob-zero`
          continue
        }
        const idx = order[i]
        const prob = probabilities[idx]
        const per = percent(prob)
        row.style.background = `linear-gradient(90deg, #8f8 ${per}, rgba(255,255,255,0) ${per})`
        row.className = `result-row prob-${Math.floor((prob + 0.01) * 10) * 10}`
        this.resultChrs[i].innerText = CLASS[idx]
        this.resultPercents[i].innerText = per
      }
      this.statusElement.style.display = ''
    })
  }
}

window.addEventListener('load', async () => {
  const path = 'assets/tfjsmodel/model.json'
  const model = await tf.loadGraphModel(path)

  new App(model)
})
