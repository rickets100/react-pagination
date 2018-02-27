import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './app.scss'
import './table.scss'

class Table extends Component {
  constructor(props) {
    super(props)

    this.onChangeItemsPerPage = this.onChangeItemsPerPage.bind(this)
    this.onChangeSort = this.onChangeSort.bind(this)

    let {data, fields, headers, increments, pageIndex, pageSize, sortOn, sortDir} = this.props;
    let firstItemNum, lastItemNum
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
      firstItemNum = 1;
      lastItemNum = Math.min(pageSize, length)
    } else {
      let onLastPage = ((pageIndex * pageSize) + pageSize) > length
      firstItemNum = (pageSize * pageIndex) + 1
      lastItemNum = (onLastPage) ? (length) : (pageSize + firstItemNum)
    }

    this.state = {
      fields:           fields,
      firstItemNum:   firstItemNum,
      lastItemNum:    lastItemNum,
      headers:          headers,
      increments:       increments,
      pageIndex:        pageIndex,
      pageSize:         pageSize,
      sortOn:           sortOn,
      sortDir:          sortDir
    }
  }//constructor

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
    //TODO: add type support for type?
    let sortIndex = this.state.headers.indexOf(this.state.sortOn);
    let fieldName = this.state.fields[sortIndex]
    let clone = this.props.data.slice(0)
    let sortDir = this.state.sortDir
    console.log("sortDir", sortDir)
    clone.sort(function (a, b) {
      let x, y

      if (sortDir == 'asc') {
        [x, y] = [a, b]
      } else {
        [x, y] = [b, a]
      }

      if (x[fieldName] < y[fieldName]) {
        return -1
      }
      if (x[fieldName] > y[fieldName]) {
        return 1
      }
      return 0
    })

    let currPage = clone.slice(this.state.firstItemNum-1, this.state.lastItemNum)
    return currPage
  }

  boundPageIndex(val) {
    return Math.min(this.numberOfPages, Math.max(0, val))
  }

  findPageByItemIndex(index, itemsPerPage) {
    let page = Math.ceil(index/itemsPerPage)
    return page
  }

  updateState(){
    let onLastPage = ((this.state.pageIndex * this.state.pageSize) + this.state.pageSize) > this.props.data.length
    let firstItemIndex = (this.state.pageSize * this.state.pageIndex)
    let firstItemNum = firstItemIndex + 1
    let lastItemNum = (onLastPage) ? (this.props.data.length) : (firstItemIndex + this.state.pageSize)

    this.setState(() =>{
      return {
        fields:           this.state.fields,
        firstItemNum:     firstItemNum,
        lastItemNum:      lastItemNum,
        headers:          this.state.headers,
        increments:       this.state.increments,
        pageIndex:        this.state.pageIndex,
        pageSize:         this.state.pageSize,
        sortOn:           this.state.sortOn,
        sortDir:          this.state.sortDir
      }
    })
  }


  // ========== PAGINATION CONTROLS ==========
  onChangeSort(event) {
    let index = event.target.value
    this.state.sortOn = index
    this.updateState()
  }//changeSortOn

  onHeaderClick(index){
      console.log("onHeaderClick",index)
      let headerName = this.state.headers[index]
      let fieldName = this.state.fields[index]
      if(this.state.sortOn == headerName) {
        this.state.sortDir = (this.state.sortDir == 'asc')? 'desc' : 'asc'
        console.log(`already sorted on ${fieldName} flip`)
      }else{
        this.state.sortOn = headerName
        this.state.sortDir = 'asc'
        console.log(`${fieldName} is new sort`)
      }
      this.updateState()
  }

  onChangeItemsPerPage(event) {
    this.state.pageSize = parseInt(event.target.value);
    let targetPage = this.findPageByItemIndex(this.state.firstItemNum, this.state.pageSize)
    this.state.pageIndex = targetPage - 1
    this.updateState()
  }//changeItemsPerPage

  pageBack() {
    this.state.pageIndex = this.boundPageIndex(this.state.pageIndex - 1)
    this.updateState()
  }//pageBack

  pageForward() {
    // console.log("pageForward 1 ", this.state.pageIndex)
    this.state.pageIndex = this.boundPageIndex(this.state.pageIndex + 1)
    this.updateState()
  }//pageForward


  render() {
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
      let header = this.state.headers[i]
      headerCells.push(<th
          className="table-header"
          key={"header"+header+i}
          onClick={()=>{this.onHeaderClick(i)}}>{header}</th>)
    }
    let tableHeaderData = <tr key="table-header">{headerCells}</tr>


    // ========== FORMULATE ROWS ==========
    let tableRowData = page.map((obj, i) => {
      let cells = []

      for(let i=0; i<this.state.fields.length; i++) {
        let field = this.state.fields[i]
        cells.push(<td key={field+i}>{obj[field]}</td>)
      }

      return <tr key={i}>{cells}</tr>
    })//map


    return (
      <div>
        pageIndex: {this.state.pageIndex}<br/>
        pageSize: {this.state.pageSize}<br/>
        firstItemNum: {this.state.firstItemNum}<br/>
        lastItemNum: {this.state.lastItemNum}<br/>
        <div className="pagination">
          <div className="container">
            <span className ="list-header">List of Awesome </span>
            <label htmlFor="sort-type" className="sort-type-label">Sort by: </label>
            <select id="sort-type" className="sort-type" value={this.state.sortOn} onChange={this.onChangeSort}>
              {sortOptions}
            </select>
            <i className="fas fa-sort-down fa-fw arrow"></i>
            <label htmlFor="per-page" className="per-page-label">Items per page:</label>
            <select id="per-page" className="per-page" value={this.state.pageSize} onChange={this.onChangeItemsPerPage}>
            {incrementOptions}
            </select>

            <i className="fas fa-sort-down fa-fw arrow"></i>
            <span className="page-range">{this.state.firstItemNum} - {this.state.lastItemNum}</span><span>  of </span><span>{this.numberOfItems}</span>
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

} //class Table

Table.defaultProps = {
  data: [],
  fields: null,
  sortOn: null,
  sortDir: 'asc',
  headers: null,
  pageSize: 10,
  pageIndex: 0
};

export default Table
