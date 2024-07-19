const CAMERA_LERP = 0.01
const CAMERA_STRIDE = 30
const prevMouse = { x: 0, y: 0 }
const mouse = { x: 0, y: 0 }

const prevPos = { x: 0, y: 0, z: 0 }
const pos = { x: 0, y: 0, z: 0 }

const cam = { x: 500, y: 500, z: -500 }
const camRotation = { x: -20, y: 20 }

let prevTime = 0
let keyCode: string | null = null

const scene = document.querySelector('.scene') as HTMLDivElement
if (scene === null) throw Error('no stage')
const world = document.querySelector('.world') as HTMLDivElement
if (world === null) throw Error('no world')

const onPointerMove = (e: PointerEvent) => {
  mouse.x -= e.movementX
  mouse.y -= e.movementY
}
const onKeyUp = () => (keyCode = null)
const onKeyDown = (e: KeyboardEvent) => (keyCode = e.code)
const lockPointer = () => world.requestPointerLock()

const attachUserInputHandler = () => {
  prevMouse.x = 0
  prevMouse.y = 0
  mouse.x = 0
  mouse.y = 0
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('keydown', onKeyDown)
}

const detachUserInputHandler = () => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('keydown', onKeyDown)
}

const onPointerLockChange = () => {
  if (document.pointerLockElement === world) attachUserInputHandler()
  else detachUserInputHandler()
}

const handleKeyInput = () => {
  const rX = (camRotation.x * Math.PI) / 180
  const rY = (-camRotation.y * Math.PI) / 180
  if (keyCode === 'ShiftLeft') {
    pos.y -= CAMERA_STRIDE
  } else if (keyCode === 'Space') {
    pos.y += CAMERA_STRIDE
  } else if (keyCode === 'KeyW') {
    pos.x += CAMERA_STRIDE * Math.sin(rY)
    pos.z += CAMERA_STRIDE * Math.cos(rY)
  } else if (keyCode === 'KeyA') {
    pos.x += CAMERA_STRIDE * Math.cos(rY)
    pos.z -= CAMERA_STRIDE * Math.sin(rY)
  } else if (keyCode === 'KeyS') {
    pos.x -= CAMERA_STRIDE * Math.sin(rY)
    pos.z -= CAMERA_STRIDE * Math.cos(rY)
  } else if (keyCode === 'KeyD') {
    pos.x -= CAMERA_STRIDE * Math.cos(rY)
    pos.z += CAMERA_STRIDE * Math.sin(rY)
  }
}

const onTick = (time: number) => {
  const timeDelta = time - prevTime

  const mouseDelta = {
    x: timeDelta * (mouse.x - prevMouse.x) * CAMERA_LERP,
    y: timeDelta * (mouse.y - prevMouse.y) * CAMERA_LERP,
  }

  prevMouse.x += mouseDelta.x
  prevMouse.y += mouseDelta.y

  camRotation.x += mouseDelta.y * 0.1
  camRotation.y -= mouseDelta.x * 0.1

  const posDelta = {
    x: timeDelta * (pos.x - prevPos.x) * CAMERA_LERP,
    y: timeDelta * (pos.y - prevPos.y) * CAMERA_LERP,
    z: timeDelta * (pos.z - prevPos.z) * CAMERA_LERP,
  }

  handleKeyInput()

  prevPos.x += posDelta.x
  prevPos.y += posDelta.y
  prevPos.z += posDelta.z

  cam.x += posDelta.x
  cam.y += posDelta.y
  cam.z += posDelta.z

  scene.style.transform = `rotateX(${camRotation.x}deg) rotateY(${camRotation.y}deg) translateX(${cam.x}px) translateY(${cam.y}px) translateZ(${cam.z}px)`

  prevTime = time
  requestAnimationFrame(onTick)
}
requestAnimationFrame(onTick)

window.addEventListener('keyup', onKeyUp)
window.addEventListener('click', lockPointer)
document.addEventListener('pointerlockchange', onPointerLockChange)
