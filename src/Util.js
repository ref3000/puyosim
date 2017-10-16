import Puyo from './Puyo'

export default {
  subPos: function (axisPos, axisDir) {
    switch (axisDir) {
      case 0:
        return new Puyo.Pos(axisPos.x, axisPos.y + 1)
      case 1:
        return new Puyo.Pos(axisPos.x + 1, axisPos.y)
      case 2:
        return new Puyo.Pos(axisPos.x, axisPos.y - 1)
      case 3:
        return new Puyo.Pos(axisPos.x - 1, axisPos.y)
    }
    return new Puyo.Pos() // error
  }
}
