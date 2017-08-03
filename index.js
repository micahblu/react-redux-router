import React, { Component } from 'react'
import pathToRegexp from 'path-to-regexp'

let routes = []
const loadRoutes = (routeConfig) => {
	if(!routeConfig) return
	for(var i=0, j=routeConfig.length; i<j; i++) {
		let keys = []
		routeConfig[i].regexPath = pathToRegexp(routeConfig[i].path, keys)
		routeConfig[i].params = keys
		routes.push(routeConfig[i])
	}
}

const RouteAction = (payload) => {
	return {
		type: '@@ROUTE_CHANGE',
		payload: {
			hash: window.location.hash,
			search: window.location.search,
			path: window.location.hash.replace(/#/, '') || '/',
		}
	}
}

let lastHash
const syncStore = (store) => {
	window.addEventListener('hashchange', function(e) {
		lastHash = window.location.hash
		store.dispatch(RouteAction())
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
		case '@@ROUTE_CHANGE':
			return action.payload
			break
		default:
			return state
	}
}

export class Router extends React.Component {
	constructor(props) {
		super(props);
    this.props = props
		if(!this.props.store) {
			throw Error('Store must be passed as a property of the Router component')
		} else if(!this.props.routes) {
			throw Error('Routes must be passed as a property of the Router component')
		}
		syncStore(this.props.store)
		loadRoutes(this.props.routes)
	}

	componentWillMount() {
		this.path = window.location 
		let statePath = ''
		let self = this
		this.props.store.subscribe(() => {
			// Re render on state location updates
			if(this.props.store.getState().router && lastHash !== this.props.store.getState().hash) {
				lastHash = window.location.hash
				this.forceUpdate()
			}
		})
	}

	render(props) {

		let currentPath = this.path.hash.replace(/#/, '') || '/'
		let self  = this
		let params = {}
		let component = null

		if(this.path.hash === '' && !/#/.test(window.location.href)) {
			window.location.href = window.location.href + "#/"
		}
		for(var i=0, j=routes.length; i<j; i++) {
			if(routes[i].regexPath.test(currentPath)) {
				component = routes[i].component
				params = routes[i].params
			}
		}
		const location = {
			push: function(path) {
				store.dispatch(RouteAction())
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
