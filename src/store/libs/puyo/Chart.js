class Chart {
  constructor () {
    this.chart = []
    this.editedFields = []
    this.size = 0
    for (let i = 0; i < 1000; i++) { // これ意味ある？
      this.chart.push({})
      // this.editedFields.push({})
    }
  }
  init (hashStr) {
    
  }
  set (turn, x, dir) {
    if (turn > 999) return
    this.chart[turn] = {
      x: x,
      dir: dir
    }
    if (turn + 1 > this.size) this.size = turn + 1
  }
  setEditedField (turn, field) {
    if (turn > 999) return
    this.editedFields[turn] = field.copy()
  }
  get (turn) {
    if (turn >= this.size) return {}
    return this.chart[turn]
  }
  getEditedField (turn) {
    if (turn >= this.size) return {}
    return this.editedFields[turn]
  }
  size () {
    return this.size
  }
  setSize (size) {
    this.size = size
  }
}

export default Chart
