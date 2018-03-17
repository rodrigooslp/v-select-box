<template>
  <div v-click-outside="hide" class="v-select-box">
    <div class="bordered item-box" @click="open" :class="{ 'err': hasError }">
      <div class="items-panel">
        <div v-for="selected in config.selected" class="var-item">
          <div class="label-item">
            <span class="text">{{selected.text}}</span><span class="remove" @click="remove(selected)">×</span>
          </div>
        </div>
        <div v-if="config.selected.length === 0 && config.placeholder" class="var-item placeholder">
          <span>{{config.placeholder}}</span>
        </div>
      </div>
      <div class="var-item arrow-container">
        <span class="arrow"></span>
      </div>
    </div>
    <div class="filtro-content" :class="{'hide': !opened}">
      <div class="filtro-search">
        <div class="v-select-box-input-group">
          <input ref="input" type="text" class="v-select-box-form-control v-select-box-input-sm" v-model="config.query" @input="debounce">
          <span class="v-select-box-input-group-addon"><i class="fa fa-search"></i></span>
        </div>
      </div>
      <ul ref="list" class="filtro-list" @scroll="onScroll">
        <li v-for="item in config.items" class="filtro-item" :class="{ 'selected': item.selected }" @click="select(item)">
          <span class="filtro-item-text">{{ item.text }}</span>
        </li>
        <li v-if="config.items.length === 0" class="filtro-item">
          <span v-if="loading">{{ config.i18n[config.locale].loading }}</span>
          <span v-else>{{ config.i18n[config.locale].notFound }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // import 'bootstrap'
  // import 'bootstrap/dist/css/bootstrap.css'
  import 'font-awesome/css/font-awesome.css'

  import defaultOptions from './default'
  import ClickOutside from 'vue-click-outside'
  import { debounce, remove } from 'lodash'

  const ERRORS = {
    NO_OPTIONS: 'You should pass an object containing the options.',
    WRONG_OPTIONS_TYPE: 'The "options" type should be object.',
    NO_LOAD: 'You should pass a function to load the items.',
    WRONG_LOAD_TYPE: 'The property "load" should be a function.',
    UNSUPPORTED_LOCALE: 'The choosen locale is not supported.'
  }

  const DEBUG = {
    MOUNTED: 'The component has been mounted.',
    HIDE_CALLED: 'The "hide" function has been called.',
    OPEN_CALLED: 'The "open" function has been called.',
    REMOVE_CALLED: 'The "remove" function has been called.',
    END_OF_LIST: 'The list has been scrolled till the end.',
    CURRENT_PAGE: 'Current page and the total pages available.',
    LOAD_CALLED: 'The "load" function has been called.',
    LOAD_FINISHED: 'The "load" function has been finished with success.',
    SELECT_ITEM: 'An item has been selected.',
    REQUEST_FOCUS: 'Focus has been requested for the search input.'
  }

  export default {
    name: 'VSelectBox',
    props: ['options', 'hasError'],
    directives: {
      ClickOutside
    },
    created () {
      this.config = this.createConfig(this.options)
    },
    mounted () {
      this.debug(DEBUG.MOUNTED, this.config)
    },
    methods: {
      debug (msg, data) {
        const { debug } = this.config
        if (debug) {
          data ? console.info({ msg, element: this.$el, data: { ...data } }) : console.info({ msg, element: this.$el })
        }
      },
      hide () {
        this.debug(DEBUG.HIDE_CALLED)
        this.opened = false
        this.config.page = 1
        this.config.pageCount = 1
        this.config.items = []
        this.config.query = ''
      },
      open () {
        this.debug(DEBUG.OPEN_CALLED)
        this.opened = true
        this.$nextTick(() => {
          this.debug(DEBUG.REQUEST_FOCUS)
          this.$refs.input.focus()
        })
        this.load({ more: false }).then(() => {
          const element = this.$refs.list
          element.scrollTop = 0
        })
      },
      remove (item, e) {
        this.debug(DEBUG.REMOVE_CALLED, item)
        const { id } = item
        const { onSelect } = this.config

        remove(this.config.selected, i => i.id === id)

        const i = this.config.items.find(i => i.id === item.id)
        if (i) i.selected = false

        if (onSelect) onSelect()
      },
      isEndOfList () {
        const element = this.$refs.list
        return element.scrollHeight - element.scrollTop - element.clientHeight < 1
      },
      onScroll () {
        const { page, pageCount } = this.config

        if (this.isEndOfList()) {
          this.debug(DEBUG.END_OF_LIST)
          if (page < pageCount) {
            this.debug(DEBUG.CURRENT_PAGE, { page, pageCount })
            this.load({ more: true })
          }
        }
      },
      load ({ more }) {
        const { load, params, pageSize, query, page } = this.config
        const { search, size } = params
        let pageNum = more ? page + 1 : page
        this.loading = true

        this.debug(DEBUG.LOAD_CALLED, { more, params: { [search]: query, [size]: pageSize, page: pageNum } })
        return load({ [search]: query, [size]: pageSize, page: pageNum })
          .then(response => {
            this.debug(DEBUG.LOAD_FINISHED, response)
            this.loading = false

            this.config.page = response.page
            this.config.pageCount = response.pageCount
            this.config.pageSize = response.pageSize
            this.config.items = more ? this.config.items.concat(response.items) : response.items
            this.checkSelected()
          })
      },
      select (item) {
        const { multi, onSelect } = this.config

        if (!multi) {
          this.config.items.forEach(item => (item.selected = false))
          this.config.selected = []
        }

        const wasSelected = this.config.selected.find(i => i.id === item.id)
        this.debug(DEBUG.SELECT_ITEM, { multi, item, wasSelected })

        if (!wasSelected) {
          item.selected = true
          this.config.selected.push(item)
          if (onSelect) onSelect(item)
        } else {
          this.remove(item)
        }
      },
      createConfig (options) {
        if (!options) throw ERRORS.NO_OPTIONS
        if (typeof (options) !== 'object') throw ERRORS.WRONG_OPTIONS_TYPE
        if (!options.load) throw ERRORS.NO_LOAD
        if (typeof (options.load) !== 'function') throw ERRORS.WRONG_LOAD_TYPE

        const params = { ...defaultOptions.params, ...options.params }
        const i18n = { ...defaultOptions.i18n, ...options.i18n }

        if (!i18n[options.locale]) throw ERRORS.UNSUPPORTED_LOCALE

        return { ...defaultOptions, ...options, params, i18n }
      },
      checkSelected () {
        this.config.selected.forEach(s => {
          this.config.items.forEach(i => {
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
        config: {},
        debounce: debounce(this.load, 500)
      }
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }
  .v-select-box {
    font-size: 14px;
  }
  .filtro-title {
    font-size: 13px;
  }
  .filtro-content {
    width: 100%;
    margin-bottom: 30px;
    max-width: 100%;
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
    overflow: hidden;
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
    /* width: 240px; */
    max-width: 100%;
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
  .v-select-box-input-group {
    position: relative;
    display: table;
    border-collapse: separate;
  }
  .v-select-box-input-group .form-control:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .v-select-box-input-group .form-control {
    display: table-cell;
  }
  .v-select-box-input-group .form-control {
    position: relative;
    z-index: 2;
    float: left;
    width: 100%;
    margin-bottom: 0;
  }
  .v-select-box-input-sm {
    height: 30px;
    padding: 5px 10px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .v-select-box-form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }
  input {
    font-family: inherit;
    margin: 0;
    font: inherit;
  }
  .v-select-box-input-group-addon:last-child {
    border-left: 0;
  }
  .v-select-box-input-group-addon:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .v-select-box-input-group-addon {
    padding: 6px 12px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
    color: #555;
    text-align: center;
    background-color: #eee;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 1%;
    white-space: nowrap;
    vertical-align: middle;
    display: table-cell;
  }
  .filtro-item-text {
    float: left;
  }
</style>
