export default {
  debug: false,
  multi: false,
  items: [],
  query: '',
  debouncedQuery: '',
  page: 1,
  pageCount: 1,
  pageSize: 10,
  minimumInput: 0,
  params: {
    search: 'q',
    size: 'pageSize'
  },
  locale: 'enUS',
  i18n: {
    enUS: {
      loading: 'Loading...',
      notFound: 'No results were found.',
      error: 'An error has happened.',
      notEnough (num) {
        return `Please enter ${num} or more characters.`
      }
    },
    ptBR: {
      loading: 'Carregando...',
      notFound: 'Nenhum item encontrado.',
      error: 'Aconteceu um erro.',
      notEnough (num) {
        return `Por favor digite ${num} ou mais caracteres.`
      }
    }
  }
}
