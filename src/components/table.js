import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './app.scss'
import './table.scss'

/**
 * a React component that provides a reusable, pageable table
 */
class Table extends Component {
  constructor(props) {
    super(props)

    this.onChangeItemsPerPage = this.onChangeItemsPerPage.bind(this)
    this.onChangeSort = this.onChangeSort.bind(this)
    this.onPageBack = this.onPageBack.bind(this)
    this.onPageForward = this.onPageForward.bind(this)

    let {data, fields, headers, headerWeights, increments, pageIndex, pageSize, sortOn, sortDir} = this.props
    let firstItemNum, lastItemNum
    let length = data.length
    let headerWidths
    let totalWeight = 0
    let columnSizes = []

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

    // ===== CALCULATE COLUMN WIDTHS =====
    if (headerWeights) {
      let items = headerWeights.length

      for (let i in headerWeights) {
        totalWeight = totalWeight + headerWeights[i]
      }
    } else {
      totalWeight=headers.length
      headerWeights = []
      for (let i=0; i<headers.length; i++) {
        headerWeights.push(1)
      }
    }

    headerWeights.forEach((weight) =>{
      let percentage = (weight/totalWeight)*100
      columnSizes.push(percentage.toString()+"%")
    })

     this.state = {
      columnSizes:    columnSizes,
      fields:         fields,
      firstItemNum:   firstItemNum,
      lastItemNum:    lastItemNum,
      headers:        headers,
      headerWeights:  headerWeights,
      increments:     increments,
      pageIndex:      pageIndex,
      pageSize:       pageSize,
      sortOn:         sortOn,
      sortDir:        sortDir
    }
  }


  /**
   * get numberOfPages - determines how many pages there are when a given number
   * of items are displayed on each page
   *
   * @return {Number}  the total number of pages at a given page size
   */
  get numberOfPages() {
    let dataSize = this.props.data.length-1
    let pageSize =  this.state.pageSize
    return Math.ceil(dataSize / pageSize)
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
   * get hasNextPage - checks to see whether there are more pages after the one
   * currently in view. For use in disabling/enabling the forward chevron.
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
   * get currentPage -forms a selection of the dataset, based on the current page
   * size and sort criteria
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

    let currentPage = clone.slice(this.state.firstItemNum-1, this.state.lastItemNum)
    return currentPage
  }


  /**
   * boundPageIndex - this limits the page index to no more than the total number of
   * pages, and no less than the first page
   *
   * @param  {Number}   val a page index
   * @return {Number}       a page index
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
    let page = Math.ceil(index / itemsPerPage)
    return page
  }

  /**
   * updateState - updates state when a value changes
   */
  updateState() {
    let onLastPage = ((this.state.pageIndex * this.state.pageSize) + this.state.pageSize) > this.props.data.length
    let firstItemIndex = (this.state.pageSize * this.state.pageIndex)
    let firstItemNum = firstItemIndex + 1
    let lastItemNum = (onLastPage) ? (this.props.data.length) : (firstItemIndex + this.state.pageSize)

    this.setState(() => {
      return {
        columnSizes:      this.state.columnSizes,
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
  /**
   * onChangeSort - updates the items in view when the user changes the
   * sort order
   *
   * @param  {ReactEvent}  event  event triggered by a change to the "sort by" listbox
   */
  onChangeSort(event) {
    let index = event.target.value
    let fieldName = this.state.fields[index]
    this.state.sortOn = fieldName
    this.state.sortDir = 'asc'
    this.updateState()
  }

  /**
   * onHeaderClick - updates state to reflect a change in sort order. If the
   * currently-chosen header is clicked, it reverses (from ascending to descending
   * or vice-versa)
   *
   * @param  {Number}   index  the index of the column header that has been clicked
   */
  onHeaderClick(index) {
    let headerName = this.state.headers[index]
    let fieldName = this.state.fields[index]
    if (this.state.sortOn == fieldName) {
      this.state.sortDir = (this.state.sortDir == 'asc') ? 'desc' : 'asc'
    } else {
      this.state.sortOn = fieldName
      this.state.sortDir = 'asc'
    }
    this.updateState()
  }

  /**
   * onChangeItemsPerPage - updates the view when the user changes the
   * "items per page" option
   *
   * @param  {ReactEvent} event event triggered by a change to the "items per page"
   */
  onChangeItemsPerPage(event) {
    this.state.pageSize = parseInt(event.target.value)
    let targetPage = this.findPageByItemIndex(this.state.firstItemNum, this.state.pageSize)
    this.state.pageIndex = targetPage - 1
    this.updateState()
  }

  /**
   * onPageBack - updates the view when the user clicks the back arrow
   * disallows that action if already on the first page
   *
   */
  onPageBack() {
    this.state.pageIndex = this.boundPageIndex(this.state.pageIndex - 1)
    this.updateState()
  }


  /**
   * onPageForward - updates the view when the user clicks the forward arrow
   * disallows that action if already on the last page
   *
   */
  onPageForward() {
    this.state.pageIndex = this.boundPageIndex(this.state.pageIndex + 1)
    this.updateState()
  }

  render() {
    let { data } = this.props
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

      let tempHeader = "table-header" + " foo"
      headerCells.push(<th
          className={tempHeader}
          key={"header"+header+i}
          onClick={()=>{this.onHeaderClick(i)}}>{header}</th>)
    }
    let tableHeaderData = <tr key="table-header">{headerCells}</tr>

    // ========== FORMULATE ROWS ==========
    let tableRowData = page.map((obj, i) => {
      let cells = []

      for(let i=0; i<this.state.fields.length; i++) {
        let field = this.state.fields[i]
        let cellWidth = {
          width: this.state.columnSizes[i]
        }
        cells.push(<td key={field+i} style={cellWidth}>{obj[field]}</td>)
      }

      return <tr key={i}>{cells}</tr>
    })

    return (
      <div>
        <div className="pagination">
          <div className="container">
            <div className="left-controls">
              <h2 className ="table-name">List of Awesome</h2>
              <div className="sort-type">
                  <label htmlFor="sort-type-select" className="sort-type-label">Sort by: </label>
                  <div className="select-wrapper">
                    <select id="sort-type-select" className="sort-type-select" value={this.state.fields.indexOf(this.state.sortOn)} onChange={this.onChangeSort}>
                      {sortOptions}
                    </select>
                </div>
              </div>
            </div>
            <div className="right-controls">
              <div className="per-page">
                <label htmlFor="per-page-select" className="per-page-label">Items per page:</label>
                <div className="select-wrapper">
                  <select id="per-page-select" className="per-page-select" value={this.state.pageSize} onChange={this.onChangeItemsPerPage}>
                    {incrementOptions}
                  </select>
                </div>
              </div>
              <div className="page-range-status">
                <span className="page-range">{this.state.firstItemNum} - {this.state.lastItemNum}</span><span> of </span><span className="page-range">{this.numberOfItems}</span>
              </div>
              <div className="page-navigation">
                <button onClick={this.onPageBack} disabled={!this.hasPreviousPage} className="page-arrow"><i id="prev-arrow" className="fas fa-angle-left"></i></button>
                <button onClick={this.onPageForward} disabled={!this.hasNextPage} className="page-arrow"><i id="next-arrow" className="fas fa-angle-right"></i></button>
              </div>
            </div>
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
  }
}

Table.defaultProps = {
  data: [],
  fields: null,
  sortOn: null,
  sortDir: 'asc',
  headers: null,
  pageSize: 10,
  pageIndex: 0
}

export default Table
