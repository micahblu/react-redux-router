import React, { Component } from 'react'
import pathToRegexp from 'path-to-regexp'

let routes = []
const loadRoutes = (routeConfig) => {
	if (!routeConfig) return
	for (var i = 0, j = routeConfig.length; i < j; i++) {
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
			params: payload ? payload.params : null
		}
	}
}

export const routerReducer = (state = {}, action) => {
	switch (action.type) {
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
		this.state = {
			path: window.location.hash.replace(/#/, '') || '/'
		}

		if (!this.props.store) {
			throw Error('Store must be passed as a property of the Router component')
		} else if (!this.props.routes) {
			throw Error('Routes must be passed as a property of the Router component')
		}
		loadRoutes(this.props.routes)
	}

	componentWillMount() {
		this.path = window.location
		let statePath = ''
		let self = this
		let lastHash
		let store = this.props.store

		let [component, params] = this.getComponentFromRoute(routes, this.state.path)
		store.dispatch(RouteAction({ params: params }))

		window.addEventListener('hashchange', (e) => {
			lastHash = window.location.hash
			this.setState({
				path: lastHash
			})
			let currentPath = lastHash.replace(/#/, '') || '/'
			let [component, params] = this.getComponentFromRoute(routes, currentPath)
			
			store.dispatch(RouteAction({params: params}))
		});
	}

	getComponentFromRoute(routes, currentPath) {
		let component=null
		let params=null
		let matches
		for (var i = 0, j = routes.length; i < j; i++) {
			matches = currentPath.match(routes[i].regexPath)
			if(matches) {
				matches.shift()
				params = matches.map((value, index)=>{
					return {
						name: routes[i].params[index].name,
						value: value
					}
				})
			}

			if (routes[i].regexPath.test(currentPath)) {
				component = routes[i].component
				params = params
			}
		}
		return [component, params]
	}

	render(props) {

		let currentPath = this.state.path.replace(/#/, '') || '/'
		let self = this

		if (this.state.path === '' && !/#/.test(window.location.href)) {
			window.location.href = window.location.href + "#/"
		}

		let [component, params] = this.getComponentFromRoute(routes, currentPath)

		if (component) {
			const location = {
				push: (path) => {
					this.props.store.dispatch(RouteAction())
				}
			}
			params.location = location
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