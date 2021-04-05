import React from 'react';
import './App.scss';
import HomePage from './Pages/HomePage/HomePage'
import {Route} from 'react-router-dom';
import ShopPage from './Pages/ShopPage/ShopPage'
import Header from './Components/Header/Header'
import Sign from './Pages/Sign/Sign';
import {auth,createUserProfileDocument} from './firebase/firebaseUtil';
import {connect} from 'react-redux'
import {setCurrentUser} from './redux/userReducer/userAction'




class App  extends React.Component{

  unsubcribeFromAuth=null
  
  componentDidMount() {
    const {setCurrentUser}=this.props

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      }
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount(){
    this.unsubcribeFromAuth()
  }
  render(){
    return(
      <div className='app'>
        <Header />
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/shop/hats' component={ShopPage}/>
        <Route exact path='/shop/mens' component={ShopPage}/>
        <Route exact path='/shop' component={ShopPage}/>
        <Route exact path='/sign' component={Sign}/>
      </div>
    )
  }
  
} 
const mapDispatchToProps= dispatch=>({
  setCurrentUser: user=> dispatch(setCurrentUser(user))
})

export default connect(null,mapDispatchToProps)(App);
