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

		store.dispatch(RouteAction())

		window.addEventListener('hashchange', (e) => {
			lastHash = window.location.hash
			this.setState({
				path: lastHash
			})
			store.dispatch(RouteAction())
		});
	}

	render(props) {

		let currentPath = this.state.path.replace(/#/, '') || '/'
		let self = this
		let params = {}
		let component = null

		if (this.state.path === '' && !/#/.test(window.location.href)) {
			window.location.href = window.location.href + "#/"
		}
		for (var i = 0, j = routes.length; i < j; i++) {
			if (routes[i].regexPath.test(currentPath)) {
				component = routes[i].component
				params = routes[i].params
			}
		}

		const location = {
			push: (path) => {
				this.props.store.dispatch(RouteAction())
			}
		}
		params.location = location
		if (component) {
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