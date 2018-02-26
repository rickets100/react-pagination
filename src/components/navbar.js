import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './navbar.scss'

class Navbar extends Component {

  render() {
    console.log('\n^^^^^^^ IN NAVBAR RENDER ^^^^^^^');

    return (
      <div>
        <nav role="navigation" className="main-nav">
          <ul id="main-nav-list" className="main-nav-list">
            <li>Nav Item 1</li>
            <li>Nav Item 2</li>
            <li>Nav Item 3</li>
          </ul>
        </nav>
      </div>
    )
  }//render
} //class Navbar


export default Navbar;
