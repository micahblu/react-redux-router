# react-redux-router

An incredibly simple and easy to use router for react redux apps

This repo is experimental! Collaborators are welcome.

## Basic setup
```js
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import reducers from './reducers'
import { Route, Router, syncStore } from 'react-redux-router'
import IndexPage from './containers/IndexPage'
import AboutPage from './containers/AboutPage'

const store = createStore(reducers)
syncStore(store)

const render = () => (
  ReactDOM.render(
    <AppContainer>
      <Provider store={ store }>
        <Router>
          <Route path="/" component={IndexPage}/>
          <Route path="/about" component={AboutPage}/>
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('mount')
  )
)

render()
```
