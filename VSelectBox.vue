<template>
  <div class="filtro-content">
    <div class="filtro-search">
      <div class="input-group">
        <input ref="input" type="text" class="form-control input-sm" v-model="query" @input="debounce">
        <span class="input-group-addon"><i class="fa fa-search"></i></span>
      </div>
    </div>
    <ul ref="list" class="filtro-list" @scroll="onScroll">
      <li v-for="item in options.items" class="filtro-item" :class="{ 'selected': item.selected }" @click="select(item)" data-toggle="tooltip" data-placement="top" :title="item.text">
        <span>{{ item.text }}</span>
      </li>
      <li v-if="options.items.length === 0" class="filtro-item">
        <span v-if="loading">Pesquisando...</span>
        <span v-else>Nenhum item encontrado.</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { debounce } from 'lodash'
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'font-awesome/css/font-awesome.css'
  export default {
    name: 'VSelectBox',
    props: ['options'],
    created () {
      const { clearItems, params, itemsPerPage } = this.options

      if (clearItems) clearItems()
      if (itemsPerPage) this.itemsPerPage = itemsPerPage

      if (params) {
        const { search, pageSize } = params

        if (search) this.params.search = search
        if (pageSize) this.params.pageSize = pageSize
      }
    },
    methods: {
      createTooltips () {
        $(this.$el).find('[data-toggle="tooltip"]').tooltip()
      },
      destroyTooltips () {
        $(this.$el).find('[data-toggle="tooltip"]').tooltip('destroy')
      },
      isEndOfList () {
        const element = this.$refs.list
        return element.scrollHeight - element.scrollTop - element.clientHeight < 1
      },
      onScroll () {
        const { loadMore, page, pageCount } = this.options

        if (loadMore) {
          if (page < pageCount && this.isEndOfList()) {
            const { search, pageSize } = this.params
            this.destroyTooltips()
            this.loading = true

            loadMore({
              page: page + 1,
              [search]: this.query,
              [pageSize]: this.itemsPerPage
            }).then(() => {
              this.loading = false
              this.createTooltips()
            })
          }
        }
      },
      search () {
        const { onSearch } = this.options

        if (onSearch) {
          const { search, pageSize } = this.params

          this.destroyTooltips()
          this.loading = true

          onSearch({
            [search]: this.query,
            [pageSize]: this.itemsPerPage
          }).then(() => {
            this.loading = false
            this.createTooltips()
          })
        }
      },
      select (item) {
        const { multiSelect, onSelect } = this.options

        if (onSelect) {
          onSelect({ item, multiSelect })
        }
      }
    },
    data () {
      return {
        loading: false,
        params: {
          search: 'nome',
          pageSize: 'pageSize'
        },
        query: '',
        itemsPerPage: 10,
        debounce: debounce(this.search, 500)
      }
    }
  }
</script>

<style scoped>
  .filtro-title {
    font-size: 13px;
  }
  .filtro-content {
    width: 100%;
    margin-bottom: 30px;
  }
  .filtro-search {
    margin-bottom: 15px;
  }
  .filtro-list {
    list-style: none;
    padding: 0;
    overflow-y: scroll;
    height: 200px;
    border: 1px solid #eee;
    background-color: #fff;
  }
  .filtro-item {
    background-color: #fff;
    padding: 6px 12px;
    position: relative;
    margin-bottom: 1px;
    cursor: pointer;
    transition: all .2s linear;
  }
  .filtro-item:hover {
    background-color: #eee;
  }
  .filtro-item .icon {
    font-size: 10px;
    right: 6px;
    position: absolute;
    top: 50%;
    margin-top: -5px;
  }
  .filtro-item.selected {
    background-color: #81f0bd;
  }
  .filtro-item.selected:hover {
    background-color: #54eba5;
  }
</style>
