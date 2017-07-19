import React, { Component } from 'react'
import pathToRegexp from 'path-to-regexp'

let routes = []
export const loadRoutes = (routeConfig) => {
	if(!routeConfig) return
	for(var i=0, j=routeConfig.length; i<j; i++) {
		let keys = []
		routeConfig[i].regexPath = pathToRegexp(routeConfig[i].path, keys)
		routeConfig[i].params = keys
		routes.push(routeConfig[i])
	}
}

export const syncStore = (store) => {
	window.addEventListener('hashchange', function(e) {
		const ts = new Date().getTime()
		store.dispatch({
			type: '@ROUTE_CHANGE',
			payload: {
				path: window.location.hash.replace(/#/, '') || '/',
				time: ts
			}
		})
  });
}

export class Route extends React.Component {
	constructor(props) {
		super(props);
		this.props = props
	}
	render() {
		return null
	}
}
export const routerReducer = (state = {}, action) => {
	switch(action.type) {
		case '@ROUTE_CHANGE':
			return Object.assign({}, {
				paths: state.paths ? 
				[
					...state.paths, 
				{
					path: action.payload.path,
					time: action.payload.time
				}] : [{
					path: action.payload.path,
					time: action.payload.time
				}]
			})
			break
		default:
			return state
	}
}

export class Router extends React.Component {
	constructor(props) {
		super(props);
    this.props = props
	}

	componentWillMount() {
		this.store = this._reactInternalInstance._context.store
		this.path = window.location 
		let statePath = ''
		let self = this
		this.store.subscribe(() => {
			// ensure path matches
			if(this.store.getState().router && this.store.getState().router.paths && this.store.getState().router.paths.length) {
				statePath = this.store.getState().router.paths.slice(-1)[0].path
				self.path.replace('#' + statePath)
			}
		  this.forceUpdate()
		})
	}

	render() {
		let currentPath = this.path.hash.replace(/#/, '') || '/'
		let self  = this
		let urlSegments = currentPath.split('/').slice(1)
		let ch = this.props.children
		let matchSegments = []
		let params = {}
		let component = null

		console.log('currentPath', currentPath)
		//console.log('UrlSegments: ', urlSegments)
		if(this.path.hash === '' && !/#/.test(window.location.href)) {
			window.location.href = window.location.href + "#/"
		}
		for(var i=0, j=routes.length; i<j; i++) {
			if(routes[i].regexPath.test(currentPath)) {
				console.log('Route matched: ', routes[i])
				component = routes[i].component
				params = routes[i].params
			}
		}
		const location = {
			push: function(path) {
				const ts = new Date().getTime()
				self.store.dispatch({
					type: '@ROUTE_CHANGE',
					payload: {
						path: path,
						time: ts
					}
				})
			}
		}
		params.location = location
		if(component) {
			return React.cloneElement(
				component,
				[params]
			)
		} else {
			return React.createElement(
				"h3",
				null,
				"No route found"
			)
		}
	}
}

export class Link extends React.Component {
	constructor(props) {
		super(props);
		this.props = props
	}

	render() {
		return React.createElement(
			'a',
			{ href: '#' + this.props.to },
			this.props.children
		);
	}
}
