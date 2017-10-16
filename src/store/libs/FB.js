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
  if (result.credential) {
    let t = result.credential.accessToken
    let s = result.credential.secret
    let uid = result.user.uid
    firebase.database().ref('users/' + uid + '/tw_key').set(t)
    firebase.database().ref('users/' + uid + '/tw_skey').set(s)
    console.log(result.credentia)
  }
  // The signed-in user info.
  let user = result.user
  console.log(user)
}).catch(function (error) {
  console.log(error)
  // var errorCode = error.code;
  // var errorMessage = error.message;
  // // The email of the user's account used.
  // var email = error.email;
  // // The firebase.auth.AuthCredential type that was used.
  // var credential = error.credential;
  // // ...
})

let loginFunc = function () {}
let logoutFunc = function () {}
firebase.auth().onAuthStateChanged(function (user) {
  console.log('auth state changed!', user)
  if (user) {
    loginFunc(user)
  } else {
    logoutFunc()
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
  tweet (status) {
    axios.post('https://api.refpuyo.net/tweet', {
      key: '919402543469305857-EK8471oUuP9gme22TKS282RK629kgFS',
      skey: 'n4WBwhiBrU3kiYk57B7PJXIjOcaqiDVpUwacFrMG1t31j',
      status: status
    })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
  }
}

export default FB
