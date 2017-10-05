import GameManager from '../libs/GameManager'
let gm = new GameManager()

export default {
  state: {
    title: 'Hello!',
    opsPos: gm.opsPos
  },
  setTitle (title) {
    this.state.title = title
  }
}
