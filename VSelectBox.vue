<template>
  <div v-click-outside="hide">
    <div class="bordered item-box" @click="open">
      <div v-for="selected in options.selected" class="var-item">
        <div class="label-item">
          <span class="text">{{selected.text}}</span><span class="remove" @click="remove(selected, $event)">×</span>
        </div>
      </div>
    </div>
    <div class="filtro-content" :class="{'hide': !opened}" @click="stop">
      <div class="filtro-search">
        <div class="input-group">
          <input ref="input" type="text" class="form-control input-sm" v-model="query" @input="debounce">
          <span class="input-group-addon"><i class="fa fa-search"></i></span>
        </div>
      </div>
      <ul ref="list" class="filtro-list" @scroll="onScroll">
        <li v-for="item in options.items" class="filtro-item" :class="{ 'selected': item.selected }" @click="select(item)">
          <span>{{ item.text }}</span>
        </li>
        <li v-if="options.items.length === 0" class="filtro-item">
          <span v-if="loading">Pesquisando...</span>
          <span v-else>Nenhum item encontrado.</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import ClickOutside from 'vue-click-outside'
  import { debounce, remove } from 'lodash'
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'font-awesome/css/font-awesome.css'
  export default {
    name: 'VSelectBox',
    props: ['options'],
    directives: {
      ClickOutside
    },
    created () {
      const { clearItems, params, itemsPerPage, selected } = this.options

      if (clearItems) clearItems()
      if (itemsPerPage) this.itemsPerPage = itemsPerPage
      if (!selected) this.options.selected = []

      if (params) {
        const { search, pageSize } = params

        if (search) this.params.search = search
        if (pageSize) this.params.pageSize = pageSize
      }
    },
    methods: {
      hide () {
        this.opened = false
      },
      stop (e) {
        e.stopPropagation()
      },
      open (e) {
        this.opened = !this.opened
        this.search().then(() => {
          const element = this.$refs.list
          element.scrollTop = 0
        })
        e.stopPropagation()
      },
      remove (item, e) {
        if (e) e.stopPropagation()
        const {id} = item
        remove(this.options.selected, i => i.id === id)
        if (this.options.onRemove) {
          this.options.onRemove(item)
        }

        const i = this.options.items.find(i => i.id === item.id)
        if (i) {
          i.selected = false
        }
        this.$forceUpdate()
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
            this.loading = true

            loadMore({
              page: page + 1,
              [search]: this.query,
              [pageSize]: this.itemsPerPage
            }).then(() => {
              this.loading = false
              this.options.selected.forEach(s => {
                this.options.items.forEach(i => {
                  if (s.id === i.id) {
                    i.selected = true
                  }
                })
              })
            })
          }
        }
      },
      search () {
        const { onSearch } = this.options

        if (onSearch) {
          const { search, pageSize } = this.params

          this.loading = true

          return onSearch({
            [search]: this.query,
            [pageSize]: this.itemsPerPage,
            clear: true
          }).then(() => {
            this.loading = false
            this.options.selected.forEach(s => {
              this.options.items.forEach(i => {
                if (s.id === i.id) {
                  i.selected = true
                }
              })
            })
          })
        }
      },
      select (item) {
        const { multiSelect, onSelect } = this.options

        item.selected = true
        if (!this.options.selected.find(i => i.id === item.id)) {
          this.options.selected.push(item)
        } else {
          this.remove(item)
          item.selected = false
        }

        if (onSelect) {
          onSelect({ item, multiSelect: !!multiSelect })
        }
      }
    },
    data () {
      return {
        opened: false,
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
    max-width: 240px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    position: absolute;
    z-index: 999;
    background-color: #fff;
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
  .bordered {
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .item-box {
    min-height: 40px;
    width: 240px;
    max-width: 240px;
    padding: 4px;
    position: relative;
  }
  .var-item {
    display: inline-block;
    padding: 2px;
  }
  .label-item {
    background-color: #16c372;
    border: 1px solid #16c372;
    color: #fff;
    display: inline-block;
    padding: 4px 6px;
    border-radius: 2px;
    cursor: pointer;
    transition: all .2s linear;
    font-size: 12px;
  }
  .label-item .text {
    padding: 2px;
  }
  .label-item .remove {
    padding: 2px;
    z-index: 2;
    transition: all .2s linear;
  }
  .hide {
    display: none;
  }
</style>
