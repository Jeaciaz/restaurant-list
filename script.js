const btoi = (isAscending) => (isAscending ? 1 : -1)

const getComparatorByName = (name, isAscending = true) => (a, b) =>
  a[name] > b[name] ? btoi(isAscending) : -btoi(isAscending)

const addWordBreakBySymbol = (str, sym) => str.split(sym).join(sym + '&#8203;')

const addWordBreakBySymbols = (str, syms) =>
  syms.reduce(addWordBreakBySymbol, str)

const render = (comparator = null) => {
  const data = getData()
  if (comparator !== null) {
    data.sort(comparator)
  }

  const rows = data.map(({ name, comment, href, subway }) => {
    const tr = document.createElement('tr')

    const tdName = document.createElement('td')
    const nameLink = document.createElement('a')
    nameLink.setAttribute('href', href)
    nameLink.setAttribute('target', '_blank')
    nameLink.setAttribute('rel', 'noopener noreferrer')
    nameLink.innerText = name
    tdName.appendChild(nameLink)
    tr.appendChild(tdName)

    const tdComment = document.createElement('td')
    tdComment.innerText = comment
    tr.appendChild(tdComment)

    const tdSubway = document.createElement('td')
    tdSubway.innerHTML = addWordBreakBySymbols(subway, ['/', '-'])
    tr.appendChild(tdSubway)

    return tr
  })

  const tbody = document.getElementById('tbody')
  tbody.innerHTML = ''
  rows.map((tr) => tbody.appendChild(tr))
}

const getNextSortOrder = (isAsc) => {
  switch (isAsc) {
    case true:
      return false
    case false:
      return null
    case null:
      return true
  }
}

const getSortOrderClass = (isAsc) => {
  switch (isAsc) {
    case true:
      return 'sort-asc'
    case false:
      return 'sort-desc'
    case null:
      return ''
  }
}

const SortStateCols = {
  COL_NAME: 'name',
  COL_COMMENT: 'comment',
  COL_SUBWAY: 'subway',
}

let sortState = {
  col: SortStateCols.COL_COMMENT,
  isAscending: null,
}

render()

const genEventListener = (name) => ({ currentTarget }) => {
  if (sortState.col !== name) {
    sortState = {
      col: name,
      isAscending: true,
    }
  } else {
    sortState = {
      col: name,
      isAscending: getNextSortOrder(sortState.isAscending),
    }
  }

  render(
    sortState.isAscending !== null
      ? getComparatorByName(sortState.col, sortState.isAscending)
      : null,
  )
  currentTarget.setAttribute(
    'class',
    `sortable ${getSortOrderClass(sortState.isAscending)}`,
  )
}

Object.values(SortStateCols).forEach((key) => {
  document
    .querySelector(`[data-key=${key}]`)
    .addEventListener('click', genEventListener(key))
})
