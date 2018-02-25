/* src/components/App.js */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Table from './table';
import './app.scss';
import './table.scss';
import data from '../../bin/sample-data.js';

class App extends Component {
  render() {
    let myStr = "fred"
    return <div>
            <Table
              data = {data}
              headers = {['First Name', 'Last Name', 'Country', 'Address', 'City', 'State', 'Zip', 'Phone']}
              increments={[5, 10, 25, 50, 75, 100]}
              pageIndex={0}
              pageSize={20}
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
