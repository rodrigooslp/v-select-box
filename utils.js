import { NO_OPTIONS, WRONG_OPTIONS_TYPE } from './errors'

function createOptions (options) {
  const defaultOptions = {
    items: [],
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    params: {
      search: 'q',
      pageSize: 'pageSize'
    }
  }

  if (!options) throw NO_OPTIONS
  if (typeof (options) !== 'object') throw WRONG_OPTIONS_TYPE

  return {
    items: options.items || defaultOptions.items,
    page: options.page || defaultOptions.page,
    pageCount: options.pageCount || defaultOptions.pageCount,
    itemsPerPage: options.itemsPerPage || defaultOptions.itemsPerPage,
    params: options.params || defaultOptions.params
    // onSelect: this.onSelect,
    // onSearch: this.onSearch,
    // loadMore: this.loadMore,
    // clearItems: this.clearItems,
  }
}

export { createOptions }
