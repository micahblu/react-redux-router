import React, { Component } from 'react'

export const syncStore = (store) => {
	window.addEventListener('hashchange', function(e) {
		store.dispatch({
			type: '@ROUTE_CHANGE',
			payload: {
				path: window.location.hash.replace(/#/, '') || '/'
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
			const ts = new Date().getTime()
			return Object.assign({}, {
				paths: state.paths ? 
				[
					...state.paths, 
				{
					path: action.payload.path,
					time: ts
				}] : [{
					path: action.payload.path,
					time: ts
				}]
			})

			break
		default:
			return state
	}
}

export default history

export class Router extends React.Component {
	constructor(props) {
		super(props);
    this.props = props
	}

	componentWillMount() {
		this.store = this._reactInternalInstance._context.store
		this.path = window.location 

		this.store.subscribe(() => {
		  this.forceUpdate()
		})
	}

	render() {
		let currentPath = this.path.hash.replace(/#/, '') || '/'

		if(this.path.hash === '' && !/#/.test(window.location.href)) {
			window.location.href = window.location.href + "#/"
		}

		// load component based on path
		let ch = this.props.children.props.children
		for(var i=0, j=ch.length; i<j; i++) {
			if(ch[i].props.path === currentPath) {
				this.component = ch[i].props.component
			}
		}

		return React.createElement(this.component, this.props)
	}
}

export class Link extends React.Component {
	constructor(props) {
		super(props);
		this.props = props
	}

	render() {
		return <a href={'#' + this.props.to}>{this.props.children}</a>
	}
}