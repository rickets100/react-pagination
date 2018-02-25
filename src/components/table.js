import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './app.scss'
import './table.scss'

class Table extends Component {
  constructor(props) {
    super(props)

    let {data, fields, headers, increments, pageIndex, pageSize, sortOn, sortDir} = this.props;

    if (!fields && data.length > 0){
      fields = Object.keys(data[0])
      // TODO: need to choose appropriate "sort on" field here
    }

    if (!sortOn) {
      sortOn = fields[0]
    }

    if (!headers) {
      headers = fields.slice(0)
    }


    this.state = {
      fields:     fields,
      headers:    headers,
      increments: increments,
      pageIndex:  pageIndex,
      pageSize:   pageSize,
      sortOn:     sortOn,
      sortDir:    sortDir
    }
  }//constructor

  get startIndex(){
    return this.state.pageIndex*this.state.pageSize
  }

  get endIndex(){
    return this.startIndex + this.state.pageSize
  }

  get numberOfPages() {
    let dataSize = this.props.data.length-1
    let pageSize =  this.state.pageSize
    return Math.ceil(dataSize/pageSize)
  }

  get getNumberOfItems() {
    return this.props.data.length-1
  }

  get hasNextPage(){
    return (this.numberOfPages > this.state.pageIndex+1)
  }

  get hasPreviousPage(){
    return (this.state.pageIndex > 0)
  }

  get currentPage(){
    // console.log("this.pageIndex",this.state.pageIndex)
    // console.log("this.pageSize",this.state.pageSize)
    // console.log("this.startIndex",this.startIndex)
    return this.props.data.slice(this.startIndex, this.endIndex)
  }

  render() {
    let { data } = this.props;
    let dataSize = data.length-1
    let page = this.currentPage

    let headerCells = []

    for (let i=0; i<this.state.headers.length; i++) {
      let header = this.state.headers[i];
      headerCells.push(<th className="table-header" key={"header"+header+i}>{header}</th>)
    }

    let tableHeaderData = <tr key="table-header">{headerCells}</tr>;
    console.log("tableHeaderData",tableHeaderData)

    let tableRowData = page.map((obj, i) => {
      let cells = [];
      let sortedData = [];

      for(let i=0; i<this.state.fields.length; i++){
        let field = this.state.fields[i];
        cells.push(<td key={field+i}>{obj[field]}</td>)
      }
      return <tr key={i}>{cells}</tr>;
    })

    let sortOptions = this.state.headers.map((header, i) => {
      return <option key={'sortOption'+i} value={header}>{header}</option>
    })

    let incrementOptions = this.state.increments.map((increment, i) => {
      return <option key={'incrementOption'+i} value={increment}>{increment}</option>
    })

    return (
      <div>
        <div className="pagination">
          <span className ="list-header">List of Awesome </span>
          <label htmlFor="sort-type" className="sort-type-label">Sort by: </label>
          <select id="sort-type" className="sort-type" onChange={() => this.changeSortOn()}>
            {sortOptions}
          </select>
          <i className="fas fa-sort-down fa-fw arrow"></i>
          <label htmlFor="per-page" className="per-page-label">Items per page: </label>
          <select id="per-page" className="per-page" onChange={() => this.changeItemsToShow()}>
            {incrementOptions}
          </select>
          <i className="fas fa-sort-down fa-fw arrow"></i>
          <span className="page-range">1-10</span><span> of </span><span>{this.getNumberOfItems}</span>
          <button onClick={() => this.pageBack()} disabled={!this.hasPreviousPage}><i id="prev-arrow" className="fas fa-angle-left arrow page-arrow"></i></button>
          <button onClick={() => this.pageForward()} disabled={!this.hasNextPage}><i id="next-arrow" className="fas fa-angle-right arrow page-arrow"></i></button>
        </div>
        <table>
          <thead>
            {tableHeaderData}
          </thead>
          <tbody>
            {tableRowData}
          </tbody>
        </table>
      </div>
    )
  }//render

  pageBack() {
    this.setState((prevState, props) => {
      // if pageIndex is the first page, disable the left arrow
      return { pageIndex: prevState.pageIndex - 1 }
    });
  }//pageBack

  pageForward() {
    this.setState((prevState, props) => {
      // if pageIndex is the last possible page, disable the right arrow
      return { pageIndex: prevState.pageIndex + 1}
    })
  }//pageForward

  changeSortOn() {
    this.setState((prevState, props) => {
      console.log('*****************', event);
    });
  }//changeSortOn

  changeItemsToShow() {
    this.setState((prevState, props) => {
      console.log('!!!!!!!!!!!!!', event);
    });
  }//changeSortOn

} //class test

Table.defaultProps = {
  data: [],
  fields: null,
  sortOn: null,
  headers: null,
  pageSize: 10,
  pageIndex: 0
};


export default Table;
