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

store.subscribe(() => {
  console.log('state: ', store.getState())
})

const render = () => ReactDOM.render(
  <Provider store={store}>
    <Router store={store} routes={Routes} />
  </Provider>,
  rootEl
)

render()
store.subscribe(render)
