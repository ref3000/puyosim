let axios = require('axios')
let firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
let config = {
  apiKey: 'AIzaSyDabZ3U6CSSsdMnjoFqPC-k8Fu4qV4LTrk',
  authDomain: 'puyosim-95050.firebaseapp.com',
  databaseURL: 'https://puyosim-95050.firebaseio.com',
  projectId: 'puyosim-95050',
  storageBucket: 'puyosim-95050.appspot.com',
  messagingSenderId: '234335971'
}
firebase.initializeApp(config)
let provider = new firebase.auth.TwitterAuthProvider()

// firebase.auth().useDeviceLanguage()

firebase.auth().getRedirectResult().then(function (result) {
  console.log('redirectResult()', result)
  if (result.credential) {
    let t = result.credential.accessToken
    let s = result.credential.secret
    let uid = result.user.uid
    firebase.database().ref('users/' + uid + '/tw_key').set(t)
    firebase.database().ref('users/' + uid + '/tw_skey').set(s)
    // console.log(result.credentia)
  }
  // The signed-in user info.
  // console.log(result.user)
}).catch(function (error) {
  console.log(error)
})

let loginFunc = function () {}
let logoutFunc = function () {}
let isLogin = false
let key = null
let skey = null
firebase.auth().onAuthStateChanged(function (user) {
  console.log('auth state changed!', user)
  if (user) {
    loginFunc(user)
    isLogin = true
    firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
      let val = snapshot.val()
      key = val.tw_key
      skey = val.tw_skey
    })
  } else {
    logoutFunc()
    isLogin = false
  }
})

class FB {
  login () {
    firebase.auth().signInWithRedirect(provider)
  }
  logout () {
    firebase.auth().signOut()
  }
  onLogin (f) {
    loginFunc = f
  }
  onLogout (f) {
    logoutFunc = f
  }
  tweet (status, base64str, callback) {
    if (base64str == null) base64str = null
    console.log('key', key)
    if (!isLogin) {
      callback(false)
      return
    }
    axios.post('https://api.refpuyo.net/tweet', {
      key: key,
      skey: skey,
      status: status,
      data: base64str
    })
    .then(function (response) {
      console.log(response)
      if (callback != null) callback(true)
    })
    .catch(function (error) {
      console.log(error)
      if (callback != null) callback(false)
    })
  }
}

export default FB
