import React from 'react'
import { connect } from 'react-redux'
import { Link } from '../../../../'
import Counter from './Counter'

const Home = (props) => {
  console.log('Home props: ', props)
  return (
    <div>
      <h1>Home</h1>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
      <Counter
        value={props.value}
        onIncrement={() => props.increment()}
        onDecrement={() => props.decrement()}
      />,
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    value: state.counter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increment() {
      dispatch({ type: 'INCREMENT' })
    },
    decrement() {
      dispatch({ type: 'DECREMENT' })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)