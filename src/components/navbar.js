import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './navbar.scss'

class Navbar extends Component {

  render() {
    return (
      <div>
        <nav role="navigation" className="main-nav">
          <ul id="main-nav-list" className="main-nav-list">
            <li>
              <a href="#">Nav Item 1</a>
            </li>
            <li>
              <a href="#">Nav Item 2</a>
            </li>
            <li>
              <a href="#">Nav Item 3</a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}


export default Navbar;
