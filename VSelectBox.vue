<template>
  <div v-click-outside="hide">
    <div class="bordered item-box" @click="open" :class="{ 'err': hasError }">
      <div class="items-panel">
        <div v-for="selected in currentOptions.selected" class="var-item">
          <div class="label-item">
            <span class="text">{{selected.text}}</span><span class="remove" @click="remove(selected, $event)">×</span>
          </div>
        </div>
        <div v-if="currentOptions.selected.length === 0 && currentOptions.placeholder" class="var-item placeholder">
          <span>{{currentOptions.placeholder}}</span>
        </div>
      </div>
      <div class="var-item arrow-container">
        <span class="arrow"></span>
      </div>
    </div>
    <div class="filtro-content" :class="{'hide': !opened}">
      <div class="filtro-search">
        <div class="input-group">
          <input ref="input" type="text" class="form-control input-sm" v-model="currentOptions.query" @input="debounce">
          <span class="input-group-addon"><i class="fa fa-search"></i></span>
        </div>
      </div>
      <ul ref="list" class="filtro-list" @scroll="onScroll">
        <li v-for="item in currentOptions.items" class="filtro-item" :class="{ 'selected': item.selected }" @click="select(item)">
          <span>{{ item.text }}</span>
        </li>
        <li v-if="currentOptions.items.length === 0" class="filtro-item">
          <span v-if="loading">Pesquisando...</span>
          <span v-else>Nenhum item encontrado.</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import defaultOptions from './default'
  import ClickOutside from 'vue-click-outside'
  import { debounce, remove } from 'lodash'
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'font-awesome/css/font-awesome.css'

  const ERRORS = {
    NO_OPTIONS: 'You should pass an object containing the options.',
    WRONG_OPTIONS_TYPE: 'The "options" type should be object.',
    NO_LOAD: 'You should pass a function to load the items.',
    WRONG_LOAD_TYPE: 'The property "load" should be a function.'
  }

  export default {
    name: 'VSelectBox',
    props: ['options', 'hasError'],
    directives: {
      ClickOutside
    },
    created () {
      this.currentOptions = this.createOptions(this.options)
    },
    methods: {
      hide () {
        this.opened = false
        this.currentOptions.page = 1
        this.currentOptions.pageCount = 1
        this.currentOptions.items = []
        this.currentOptions.query = ''
      },
      open (e) {
        this.opened = true
        this.$nextTick(() => this.$refs.input.focus())
        this.load({ more: false }).then(() => {
          const element = this.$refs.list
          element.scrollTop = 0
        })
      },
      remove (item, e) {
        const { id } = item
        const { onSelect } = this.currentOptions

        if (e) e.stopPropagation()

        remove(this.currentOptions.selected, i => i.id === id)

        const i = this.currentOptions.items.find(i => i.id === item.id)
        if (i) i.selected = false

        if (onSelect) onSelect()
        this.$forceUpdate()
      },
      isEndOfList () {
        const element = this.$refs.list
        return element.scrollHeight - element.scrollTop - element.clientHeight < 1
      },
      onScroll () {
        const { page, pageCount } = this.currentOptions

        if (page < pageCount && this.isEndOfList()) {
          this.load({ more: true })
        }
      },
      load ({ more }) {
        const { load, params, pageSize, query, page } = this.currentOptions
        const { search, size } = params
        let pageNum = more ? page + 1 : page
        this.loading = true

        return load({ [search]: query, [size]: pageSize, page: pageNum })
          .then(response => {
            this.loading = false

            this.currentOptions.page = response.page
            this.currentOptions.pageCount = response.pageCount
            this.currentOptions.pageSize = response.pageSize
            this.currentOptions.items = more ? this.currentOptions.items.concat(response.items) : response.items
            this.checkSelected()
          })
      },
      select (item) {
        const { multi, onSelect } = this.currentOptions

        if (!multi) {
          this.currentOptions.items.forEach(item => (item.selected = false))
          this.currentOptions.selected = []
        }

        if (!this.currentOptions.selected.find(i => i.id === item.id)) {
          item.selected = true
          this.currentOptions.selected.push(item)
          if (onSelect) onSelect(item)
        } else {
          this.remove(item)
        }
      },
      createOptions (options) {
        if (!options) throw ERRORS.NO_OPTIONS
        if (typeof (options) !== 'object') throw ERRORS.WRONG_OPTIONS_TYPE
        if (!options.load) throw ERRORS.NO_LOAD
        if (typeof (options.load) !== 'function') throw ERRORS.WRONG_LOAD_TYPE

        const params = { ...defaultOptions.params, ...options.params }
        return { ...defaultOptions, ...options, params }
      },
      checkSelected () {
        this.currentOptions.selected.forEach(s => {
          this.currentOptions.items.forEach(i => {
            if (s.id === i.id) {
              i.selected = true
            }
          })
        })
      }
    },
    data () {
      return {
        opened: false,
        loading: false,
        currentOptions: {},
        debounce: debounce(this.load, 500)
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
    border: 1px solid #e5e6e7;
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
    border: 1px solid #e5e6e7;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .item-box {
    cursor: pointer;
    overflow: hidden;
    min-height: 40px;
    width: 240px;
    max-width: 240px;
    padding: 4px;
    position: relative;
  }
  .var-item {
    display: inline-block;
    padding: 1px;
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
  .err {
    border-color: #e1777a;
  }
  .placeholder {
    float: left;
    margin-left: 8px;
    margin-top: 3px;
    color: #999;
  }
  .arrow {
    border-color: #888 transparent transparent;
    border-style: solid;
    border-width: 5px 4px 0;
  }
  .arrow-container{
    position: absolute;
    margin-right: 10px;
    right: 0;
    top: 50%;
  }
  .items-panel {
    margin-right: 25px;
  }
</style>
