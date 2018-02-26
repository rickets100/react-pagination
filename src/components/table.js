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
    let firstItemIndex, lastItemIndex
    let length = data.length

    if (!fields && (length > 0)){
      fields = Object.keys(data[0])
    }

    if (!sortOn) {
      sortOn = fields[0]
    }

    if (!headers) {
      headers = fields.slice(0)
    }

    if (!pageIndex) {
      firstItemIndex = 0;
      lastItemIndex = Math.min(pageSize, length)
    } else {
      let onLastPage = ((pageIndex * pageSize) + pageSize) > length
      firstItemIndex = pageSize * pageIndex
      lastItemIndex = (onLastPage) ? (length) : (pageSize + firstItemIndex)
    }

    this.state = {
      fields:           fields,
      firstItemIndex:   firstItemIndex,
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
    this.state.firstItemIndex = this.state.pageIndex*this.state.pageSize
    return this.state.pageIndex*this.state.pageSize
  }

  get endIndex() {
    let onLastPage = (this.startIndex + this.state.pageSize) > this.numberOfItems
    if (onLastPage) {
      this.state.lastItemIndex = this.numberOfItems
    } else {
      this.state.lastItemIndex = this.state.firstItemIndex + this.state.pageSize
    }
    return (onLastPage) ?  (this.numberOfItems) : (this.startIndex + this.state.pageSize)
  }

  get numberOfPages() {
    let dataSize = this.props.data.length-1
    let pageSize =  this.state.pageSize
    return Math.ceil(dataSize/pageSize)
  }

  get numberOfItems() {
    return this.props.data.length
  }

  get hasNextPage() {
    return (this.numberOfPages > this.state.pageIndex+1)
  }

  get hasPreviousPage() {
    return (this.state.pageIndex > 0)
  }

  get currentPage() {
    let foocurrPage = this.props.data.slice(this.firstItemIndex, this.lastItemIndex)
    let currPage = this.props.data.slice(this.startIndex, this.endIndex)
    return currPage
  }

  boundPageIndex(val) {
    return Math.min(this.numberOfPages, Math.max(0, val))
  }

  findPageByItemIndex(index, itemsPerPage) {
    let page = Math.ceil(index/itemsPerPage)
    console.log('in findPageByItemIndex, target page will be', page);
    return page
  }


  // ========== PAGINATION CONTROLS ==========
  changeSortOn(event) {
    console.log('IN CHANGESORTON', event.target.value);
    this.setState((prevState, props) => {
    });
  }//changeSortOn

  changeItemsPerPage(event) {
    let newValue = parseInt(event.target.value);
    let targetPage = this.findPageByItemIndex(this.state.firstItemIndex, newValue)
    console.log('targetpage', targetPage);
    this.setState((prevState, props) => {
      let foo = {
        pageSize: newValue,
        pageIndex: targetPage,
        firstItemIndex: prevState.firstItemIndex,
        lastItemIndex: Math.min(prevState.firstItemIndex + newValue, this.numberOfItems)
      }
      console.log('foo:',foo)
      return foo
    });
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


    // ========== FORMULATE LISTBOX OPTIONS ==========
    let incrementOptions = this.state.increments.map((increment, i) => {
      return <option key={'incrementOption'+i} value={increment} className="per-page-option">{increment}</option>
    })

    let sortOptions = this.state.headers.map((header, i) => {
      return <option key={'sortOption'+i} value={header} className="sort-option">{header}</option>
    })


    // ========== FORMULATE HEADERS ==========
    for (let i=0; i<this.state.headers.length; i++) {
      let header = this.state.headers[i];
      headerCells.push(<th className="table-header" key={"header"+header+i}>{header}</th>)
    }
    let tableHeaderData = <tr key="table-header">{headerCells}</tr>;


    // ========== FORMULATE ROWS ==========
    let tableRowData = page.map((obj, i) => {
      let cells = [];
      let sortedData = [];

      for(let i=0; i<this.state.fields.length; i++) {
        let field = this.state.fields[i];
        cells.push(<td key={field+i}>{obj[field]}</td>)
      }
      return <tr key={i}>{cells}</tr>;
    })//map


    return (
      <div>
        <div className="pagination">
          <div className="container">
            <span className ="list-header">List of Awesome </span>
            <label htmlFor="sort-type" className="sort-type-label">Sort by: </label>
            <select id="sort-type" className="sort-type" value={this.state.sortOn} onChange={this.changeSortOn}>
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
            <span className="page-range">{this.state.firstItemIndex} - {this.state.lastItemIndex}</span><span>  of </span><span>{this.numberOfItems}</span>

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
