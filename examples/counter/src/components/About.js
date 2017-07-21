import React from 'react'
import { Link } from '../../../../'

const About = () => {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
      <p>Yet Another Router!</p>
    </div>
  )
}

export default About