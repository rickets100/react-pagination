import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './app.scss'
import './table.scss'

/**
 *
 */
class Table extends Component {
  constructor(props) {
    super(props)

    this.onChangeItemsPerPage = this.onChangeItemsPerPage.bind(this)
    this.onChangeSort = this.onChangeSort.bind(this)
    this.pageBack = this.pageBack.bind(this)
    this.pageForward = this.pageForward.bind(this)

    let {data, fields, headers, increments, pageIndex, pageSize, sortOn, sortDir} = this.props
    let firstItemNum, lastItemNum
    let length = data.length

    if (!fields && (length > 0)) {
      fields = Object.keys(data[0])
    }

    if (!sortOn) {
      sortOn = fields[0]
    }

    if (!headers) {
      headers = fields.slice(0)
    }

    if (!pageIndex) {
      firstItemNum = 1
      lastItemNum = Math.min(pageSize, length)
    } else {
      let onLastPage = ((pageIndex * pageSize) + pageSize) > length
      firstItemNum = (pageSize * pageIndex) + 1
      lastItemNum = (onLastPage) ? (length) : (pageSize + firstItemNum)
    }

    this.state = {
      fields:         fields,
      firstItemNum:   firstItemNum,
      lastItemNum:    lastItemNum,
      headers:        headers,
      increments:     increments,
      pageIndex:      pageIndex,
      pageSize:       pageSize,
      sortOn:         sortOn,
      sortDir:         sortDir
    }
  }//constructor


  /**
   * get numberOfPages - determines how many pages there are when a given number of items are displayed on each page
   *
   * @return {Number}  the total number of pages at a given page size
   */
  get numberOfPages() {
    let dataSize = this.props.data.length-1
    let pageSize =  this.state.pageSize
    return Math.ceil(dataSize/pageSize)
  }

  /**
   * get numberOfItems - Gets the number of items in a dataset
   *
   * @return {Number}  The number of items
   */
  get numberOfItems() {
    return this.props.data.length
  }

  /**
   * get hasNextPage - checks to see whether there are more pages after the one currently in view. For use in disabling/enabling the forward chevron.
   *
   * @return {Boolean}  Is the total number of pages greater than the index of the
   * current page?
   */
  get hasNextPage() {
    return (this.numberOfPages > this.state.pageIndex + 1)
  }

  /**
   * get hasPreviousPage - checks to see whether there are more pages before the one currently in view. For use in disabling/enabling the backward chevron.
   *
   * @return {Boolean}  Are you currently viewing a page other than the very first one?
   */
  get hasPreviousPage() {
    return (this.state.pageIndex > 0)
  }

  /**
   * get currentPage -forms a selection of the dataset, based on the current page size and sort criteria
   *
   * @return {Array}  the items from the dataset that are currently in view
   */
  get currentPage() {
    let clone = this.props.data.slice(0)
    let fieldName = this.state.sortOn
    let sortDir = this.state.sortDir

    clone.sort(function (a, b) {
      let x, y

      (sortDir == 'asc') ? [x, y] = [a, b] : [x, y] = [b, a]
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
  //currentPage


  /**
   * boundPageIndex - this limits the page index to no more than the total number of pages, and no less than the first page
   *
   * @param  {Number}   val a page index
   * @return {Number}     a page index
   */
  boundPageIndex(val) {
    return Math.min(this.numberOfPages, Math.max(0, val))
  }

  /**
   * findPageByItemIndex - Given the index of an item from the dataset, this returns
   * the index of the page that would contain it were the number of items per-page
   * to be changed
   *
   * @param  {Number} index         the index of the item
   * @param  {Number} itemsPerPage  the number of items per page
   * @return {Number}               the index of the page that the item would be on
   */
  findPageByItemIndex(index, itemsPerPage) {
    let page = Math.ceil(index/itemsPerPage)
    return page
  }

  /**
   * updateState - description
   *
   * @return {type}  description
   */
  updateState() {
    let onLastPage = ((this.state.pageIndex * this.state.pageSize) + this.state.pageSize) > this.props.data.length
    let firstItemIndex = (this.state.pageSize * this.state.pageIndex)
    let firstItemNum = firstItemIndex + 1
    let lastItemNum = (onLastPage) ? (this.props.data.length) : (firstItemIndex + this.state.pageSize)

    this.setState(() => {
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
    let fieldName = this.state.fields[index]
    this.state.sortOn = fieldName
    this.state.sortDir = 'asc'
    this.updateState()
  }//changeSortOn

  onHeaderClick(index) {
    let headerName = this.state.headers[index]
    let fieldName = this.state.fields[index]
    if (this.state.sortOn == fieldName) {
      this.state.sortDir = (this.state.sortDir == 'asc')? 'desc' : 'asc'
    } else {
      this.state.sortOn = fieldName
      this.state.sortDir = 'asc'
    }
    this.updateState()
  }

  onChangeItemsPerPage(event) {
    this.state.pageSize = parseInt(event.target.value)
    let targetPage = this.findPageByItemIndex(this.state.firstItemNum, this.state.pageSize)
    this.state.pageIndex = targetPage - 1
    this.updateState()
  }//onChangeItemsPerPage

  pageBack() {
    this.state.pageIndex = this.boundPageIndex(this.state.pageIndex - 1)
    this.updateState()
  }//pageBack

  pageForward() {
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
      return <option key={'sortOption'+i} value={i} className="sort-option">{header}</option>
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
        this.state.sortDir: {this.state.sortDir}<br/>
        <div className="pagination">
          <div className="container">
            <span className ="list-header">List of Awesome </span>
            <label htmlFor="sort-type" className="sort-type-label">Sort by: </label>
            <select id="sort-type" className="sort-type" value={this.state.fields.indexOf(this.state.sortOn)} onChange={this.onChangeSort}>
              {sortOptions}
            </select>
            <i className="fas fa-sort-down fa-fw arrow"></i>
            <label htmlFor="per-page" className="per-page-label">Items per page:</label>
            <select id="per-page" className="per-page" value={this.state.pageSize} onChange={this.onChangeItemsPerPage}>
            {incrementOptions}
            </select>

            <i className="fas fa-sort-down fa-fw arrow"></i>
            <span className="page-range">{this.state.firstItemNum} - {this.state.lastItemNum}</span><span>  of </span><span>{this.numberOfItems}</span>
            <button onClick={this.pageBack} disabled={!this.hasPreviousPage}><i id="prev-arrow" className="fas fa-angle-left arrow page-arrow"></i></button>
            <button onClick={this.pageForward} disabled={!this.hasNextPage}><i id="next-arrow" className="fas fa-angle-right arrow page-arrow"></i></button>

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
