import React, { Component } from 'react'

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

		if(this.path.hash === '' && !/#/.test(window.location.href)) {
			window.location.href = window.location.href + "#/"
		}

		// load component based on path
		let urlSegments = currentPath.split('/').slice(1)
		let ch = this.props.children
		let matchSegments = []
		let params = {}

		for(var i=0, j=ch.length; i<j; i++) {
			matchSegments = ch[i].props.path.split('/').slice(1)
			for(var k=0, l=urlSegments.length; k<l; k++) {
				if(urlSegments[k] === matchSegments[k]) {
					this.component = ch[i].props.component
				}
				if(/:/.test(matchSegments[k])) {
					// dynamic section - store any corresponding url
					params[matchSegments[k].replace(':', '')] = urlSegments[k]
				}
			}
		}
		if(this.component) {
			return React.createElement(this.component, Object.assign({}, this.props, {params: params, location: location}))
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