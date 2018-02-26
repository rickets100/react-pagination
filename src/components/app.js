/* src/components/App.js */
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Table from './table'
import Navbar from './navbar'
import './app.scss'
import './table.scss'
import './navbar.scss'
import data from '../../bin/sample-data.js'

class App extends Component {
  render() {
    return <div>
            <Navbar />
            <Table
              data = {data}
              headers = {['First Name', 'Last Name', 'Country', 'Address', 'City', 'State', 'Zip', 'Phone']}
              increments={[5, 10, 25, 50, 75, 100]}
              pageIndex={0}
              pageSize={25}
            />
          </div>;
  }//render
}//App

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
