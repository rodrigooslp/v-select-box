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
