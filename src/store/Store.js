export default {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessage (newValue) {
    if (this.debug) console.log('setMessage triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
