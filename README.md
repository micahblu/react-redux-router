# react-redux-router

An incredibly simple and easy to use router for react redux apps.<br />
All that is required is a routes config object to be set, then import the Router component and routerReducer and pass the store and routes to the Router component.

## Setup routes
```js
import React from 'react'
import Home from './components/Home'
import About from './components/About'

const Routes = [
    { path: '/', component: <Home /> },
    { path: '/about', component: <About /> }
  ];

export default Routes
```

## Basic setup (examples/counter)
```js
import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import counter from './reducers'
import { Router, routerReducer } from '../../../'
import Routes from './routes'

const store = createStore(
  combineReducers({
    counter, 
    router: routerReducer
}))
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
  <Provider store={store}>
    <Router store={store} routes={Routes} />
  </Provider>,
  rootEl
)

render()
store.subscribe(render)
```
