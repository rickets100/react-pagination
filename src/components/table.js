import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './app.scss'
import './table.scss'

class Table extends Component {
  constructor(props) {
    super(props)

    this.changeItemsPerPage = this.changeItemsPerPage.bind(this);
    this.changeSortOn = this.changeSortOn.bind(this);

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

    let lastItemIndex = (this.props.pageSize * this.props.pageIndex)

    this.state = {
      fields:           fields,
      firstItemIndex:   0,
      lastItemIndex:    lastItemIndex,
      headers:          headers,
      increments:       increments,
      pageIndex:        pageIndex,
      pageSize:         pageSize,
      sortOn:           sortOn,
      sortDir:          sortDir
    }

  }//constructor


  get startIndex() {
    console.log('IN STARTINDEX GETTER');
    // console.log("IN STARTINDEX: state.pageSize is", this.state.pageSize)
    // console.log("IN STARTINDEX. state.pageIndex is", this.state.pageIndex)
    // console.log("IN STARTINDEX: this.numberOfPages is", this.numberOfPages)
    // console.log('+++++++++++++++++++++++++++++++++++++++++');
    // console.log('this.numberOfPages*this.state.pageSize:',
    return this.state.pageIndex*this.state.pageSize
  }

  get endIndex() {
    console.log('IN ENDINDEX GETTER');
    // console.log("endIndex", this.state.pageIndex, this.state.pageSize, this.numberOfPages)
    let onLastPage = (this.startIndex + this.state.pageSize) > this.numberOfItems
    return (onLastPage) ?  (this.numberOfItems) : (this.startIndex + this.state.pageSize)
  }

  get numberOfPages() {
    console.log('IN NUMBEROFPAGES GETTER');
    let dataSize = this.props.data.length-1
    let pageSize =  this.state.pageSize
    return Math.ceil(dataSize/pageSize)
  }

  get numberOfItems() {
    console.log('IN NUMBEROFITEMS GETTER');
    return this.props.data.length-1
  }

  get hasNextPage() {
    console.log('IN HASNEXTPAGE GETTER');
    return (this.numberOfPages > this.state.pageIndex+1)
  }

  get hasPreviousPage() {
    console.log('IN HASPREVIOUSPAGE GETTER');
    return (this.state.pageIndex > 0)
  }

  get currentPage() {
    console.log('IN CURRENTPAGE GETTER');
    // console.log("ABOUT TO SLICE: this.startIndex:",this.startIndex)
    // console.log("ABOUT TO SLICE: this.endIndex:",this.endIndex)
    let currPage = this.props.data.slice(this.startIndex, this.endIndex)
    return currPage
  }

  boundPageIndex(val) {
    console.log('IN BOUNDINDEX');
    // console.log("this.state.pageSize IS", this.state.pageSize)
    // console.log("boundPageIndex",val, this.numberOfPages)
    return Math.min(this.numberOfPages, Math.max(0, val))
  }


  // ========== PAGINATION CONTROLS ==========
  changeSortOn(event) {
    console.log('IN CHANGESORTON');
    this.setState((prevState, props) => {
    });
  }//changeSortOn

  changeItemsPerPage(event) {
    let newValue = parseInt(event.target.value);
    console.log('IN changeItemsPerPage');
    console.log('newValue is', newValue);
    // console.log("\nIN changeItemsPerPage. this.stage.pageSize is",this.state.pageSize)
    // console.log("IN changeItemsPerPage. newValue is",newValue)
    this.setState((prevState, props) => {

      return {
        pageSize: newValue,
      }
    });

    // setTimeout(() =>{ //TODO: this can't be done here, race condition with above change
    //   this.setState((prevState, props) => {
    //     return {
    //       pageIndex: this.boundPageIndex(this.state.pageIndex)
    //     }
    //     // console.log('!!!!!!!!!!!!!', event);
    //   });
    // }, 100);
  }//changeItemsPerPage

  pageBack() {
    // console.log('IN PAGEBACK');
    this.setState((prevState, props) => {
      // if pageIndex is the first page, disable the left arrow
      return { pageIndex: this.boundPageIndex(prevState.pageIndex - 1) }
    });
  }//pageBack

  pageForward() {
    // console.log('IN PAGEFORWARD');
    this.setState((prevState, props) => {
      // if pageIndex is the last possible page, disable the right arrow
      return { pageIndex: this.boundPageIndex(prevState.pageIndex + 1)}
    })
  }//pageForward



  render() {
    console.log('\n====== IN RENDER ===========');
    console.log('pageIndex:',this.state.pageIndex);

    console.log('======================');
    let { data } = this.props;
    let dataSize = data.length-1
    let page = this.currentPage
    let headerCells = []

    for (let i=0; i<this.state.headers.length; i++) {
      let header = this.state.headers[i];
      headerCells.push(<th className="table-header" key={"header"+header+i}>{header}</th>)
    }

    let tableHeaderData = <tr key="table-header">{headerCells}</tr>;
    let tableRowData = page.map((obj, i) => {
      let cells = [];
      let sortedData = [];

      for(let i=0; i<this.state.fields.length; i++){
        let field = this.state.fields[i];
        cells.push(<td key={field+i}>{obj[field]}</td>)
      }

      return <tr key={i}>{cells}</tr>;
    })//map

    let sortOptions = this.state.headers.map((header, i) => {
      return <option key={'sortOption'+i} value={header}>{header}</option>
    })

    let incrementOptions = this.state.increments.map((increment, i) => {
      return <option key={'incrementOption'+i} value={increment}>{increment}</option>
    })

    return (
      <div>
        <div className="pagination">
        <div className="container">
          <span className ="list-header">List of Awesome </span>
          <label htmlFor="sort-type" className="sort-type-label">Sort by: </label>
          <select id="sort-type" className="sort-type" onChange={this.changeSortOn}>
            {sortOptions}
          </select>
          <i className="fas fa-sort-down fa-fw arrow"></i>
          <label htmlFor="per-page" className="per-page-label">Items per page:</label>
          <select id="per-page" className="per-page" value={this.state.pageSize} onChange={this.changeItemsPerPage}>
          {incrementOptions}
          </select>

          <i className="fas fa-sort-down fa-fw arrow"></i>
          <span className="page-range">{this.startIndex} - {this.endIndex}</span><span>  of </span><span>{this.numberOfItems}</span>
          <button onClick={() => this.pageBack()} disabled={!this.hasPreviousPage}><i id="prev-arrow" className="fas fa-angle-left arrow page-arrow"></i></button>
          <button onClick={() => this.pageForward()} disabled={!this.hasNextPage}><i id="next-arrow" className="fas fa-angle-right arrow page-arrow"></i></button>
          </div>
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
