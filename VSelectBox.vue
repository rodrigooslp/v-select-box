<template>
  <div v-click-outside="outside" class="v-select-box">
    <div ref="box" class="bordered item-box" @click="open" :class="{ 'err': hasError, 'v-select-disabled': disable }">
      <div class="items-panel">
        <div v-if="config.multi" v-for="selected in config.selected" class="var-item filtro-item-text">
          <div class="label-item">
            <span class="text">{{selected.text}}</span><span class="remove" @click.stop="remove(selected)">×</span>
          </div>
        </div>
        <div v-else class="var-item filtro-item-text">
          <div v-if="config.selected[0].id">
            <div class="single-item">
              <span class="text filtro-item-text">{{selected.text}}</span>
              <span class="remove single-remove" @click.stop="remove(selected)">×</span>
            </div>
          </div>
        </div>
        <div v-if="(config.selected.length === 0 || !config.selected[0].id) && config.placeholder" class="var-item placeholder">
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
          <div class="v-select-box-input-group-addon">
            <img class="v-select-box-search" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAwIDUxMiA1MTIiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzM3MTEiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNlYXJjaDIuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjIgKDVjM2U4MGQsIDIwMTctMDgtMDYpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzNzE3Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMzcxNSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgICBpZD0ibmFtZWR2aWV3MzcxMyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMS42NTYyNSIKICAgICBpbmtzY2FwZTpjeD0iMTU3Ljg4Njc5IgogICAgIGlua3NjYXBlOmN5PSIyNTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzM3MTEiIC8+CiAgPHBhdGgKICAgICBkPSJNNTA1IDQ0Mi43TDQwNS4zIDM0M2MtNC41LTQuNS0xMC42LTctMTctN0gzNzJjMjcuNi0zNS4zIDQ0LTc5LjcgNDQtMTI4QzQxNiA5My4xIDMyMi45IDAgMjA4IDBTMCA5My4xIDAgMjA4czkzLjEgMjA4IDIwOCAyMDhjNDguMyAwIDkyLjctMTYuNCAxMjgtNDR2MTYuM2MwIDYuNCAyLjUgMTIuNSA3IDE3bDk5LjcgOTkuN2M5LjQgOS40IDI0LjYgOS40IDMzLjkgMGwyOC4zLTI4LjNjOS40LTkuNCA5LjQtMjQuNi4xLTM0ek0yMDggMzM2Yy03MC43IDAtMTI4LTU3LjItMTI4LTEyOCAwLTcwLjcgNTcuMi0xMjggMTI4LTEyOCA3MC43IDAgMTI4IDU3LjIgMTI4IDEyOCAwIDcwLjctNTcuMiAxMjgtMTI4IDEyOHoiCiAgICAgaWQ9InBhdGgzNzA5IgogICAgIHN0eWxlPSJzdHJva2U6bm9uZTtzdHJva2Utb3BhY2l0eTowO2ZpbGw6IzU1NTU1NTtmaWxsLW9wYWNpdHk6MSIgLz4KPC9zdmc+Cg==">
          </div>
        </div>
      </div>
      <ul ref="list" class="filtro-list" @scroll="onScroll">
        <li v-for="item in config.items" class="filtro-item" :class="{ 'selected': item.selected }" @click="select(item)">
          <span class="filtro-item-text item-color-dark">{{ item.text }}</span>
        </li>
        <li v-if="config.items.length === 0" class="filtro-item filtro-item-text full-width">
          <div v-if="error">
            <span class="item-color-dark filtro-item-text">{{ config.i18n[config.locale].error }}</span>
          </div>
          <div v-else>
            <span v-if="loading" class="item-color-dark filtro-item-text">{{ config.i18n[config.locale].loading }}</span>
            <div v-else>
              <span v-if="config.debouncedQuery.length < config.minimumInput" class="item-color-dark filtro-item-text">{{ config.i18n[config.locale].notEnough(config.minimumInput) }}</span>
              <span v-else class="item-color-dark filtro-item-text">{{ config.i18n[config.locale].notFound }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import defaultOptions from './default'
  import ClickOutside from 'vue-click-outside'
  import debounce from 'lodash.debounce'
  import remove from 'lodash.remove'

  const ERRORS = {
    NO_OPTIONS: 'You should pass an object containing the options.',
    WRONG_OPTIONS_TYPE: 'The "options" type should be object.',
    NO_LOAD: 'You should pass a function to load the items.',
    WRONG_LOAD_TYPE: 'The property "load" should be a function.',
    UNSUPPORTED_LOCALE: 'The choosen locale is not supported.',
    WRONG_VALUE_SINGLE: 'In single select mode, the v-model should be an object.',
    WRONG_VALUE_MULTI: 'In multi select mode, the v-model should be an array.',
    MISSING_ITEM_PROPS: 'To be displayed correctly, each item should have an "id" and a "text".',
    RESPONSE_MISSING_PROPS: 'The Promise returned by the "load" function should resolve to an object that has the following properties: page, pageCount, pageSize and items.'
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
    props: ['options', 'hasError', 'value', 'disable'],
    directives: {
      ClickOutside
    },
    created () {
      this.config = this.createConfig(this.options, this.value)
    },
    mounted () {
      this.debug(DEBUG.MOUNTED, this.config)
    },
    methods: {
      outside () {
        this.hide('click outside')
      },
      debug (msg, data) {
        const { debug } = this.config
        if (debug) {
          data ? console.info({ msg, element: this.$el, data: { ...data } }) : console.info({ msg, element: this.$el })
        }
      },
      hide (caller) {
        this.debug(DEBUG.HIDE_CALLED, { caller })
        this.opened = false
        this.config.page = 1
        this.config.pageCount = 1
        this.config.items = []
        this.config.query = ''
        this.error = false
      },
      open () {
        this.debug(DEBUG.OPEN_CALLED)
        if (!this.disable) {
          if (!this.opened) {
            this.config.page = 1
            this.config.pageCount = 1
            this.opened = true
            this.error = false
            this.$nextTick(() => {
              this.debug(DEBUG.REQUEST_FOCUS)
              this.$refs.input.focus()
            })
            this.load({ more: false }).then(() => {
              const element = this.$refs.list
              element.scrollTop = 0
            })
          } else {
            this.debug(DEBUG.REQUEST_FOCUS)
            this.$refs.input.focus()
          }
        }
      },
      remove (item, e) {
        this.debug(DEBUG.REMOVE_CALLED, item)
        const { id } = item
        const { onSelect, multi } = this.config

        remove(this.config.selected, i => i.id === id)

        const i = this.config.items.find(i => i.id === item.id)
        if (i) i.selected = false

        this.$nextTick(() => this.$parent.$forceUpdate())
        if (onSelect) onSelect({ ...item, selected: false })

        if (multi) {
          this.$emit('input', this.config.selected)
        } else {
          this.hide('remove function')
          this.$emit('input', this.config.selected[0] ? this.config.selected[0] : {})
        }

        if (!this.opened) this.$refs.box.click()
        else {
          this.$nextTick(() => {
            this.debug(DEBUG.REQUEST_FOCUS)
            this.$refs.input.focus()
          })
        }
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
      mapSelected (item) {
        return { selected: false, ...item }
      },
      load ({ more }) {
        const { load, params, pageSize, query, page, minimumInput } = this.config

        this.config.debouncedQuery = query

        if (query.length >= minimumInput) {
          const { search, size } = params
          let pageNum = more ? page + 1 : 1
          this.loading = true

          if (!more) {
            this.config.items = []
          }

          this.debug(DEBUG.LOAD_CALLED, { more, params: { [search]: query, [size]: pageSize, page: pageNum } })
          return load({ [search]: query, [size]: pageSize, page: pageNum })
            .then(response => {
              this.debug(DEBUG.LOAD_FINISHED, response)
              if (response.page === undefined || response.pageCount === undefined || response.pageSize === undefined || response.items === undefined) throw ERRORS.RESPONSE_MISSING_PROPS

              let err = false
              response.items.forEach(item => {
                if (!item.id || !item.text) err = true
              })
              if (err) throw ERRORS.MISSING_ITEM_PROPS

              this.loading = false

              this.config.page = response.page
              this.config.pageCount = response.pageCount
              this.config.pageSize = response.pageSize
              this.config.items = more ? this.config.items.concat(response.items.map(this.mapSelected)) : response.items.map(this.mapSelected)
              this.checkSelected()
            })
            .catch(err => {
              this.error = true
              throw err
            })
        } else {
          this.config.items = []
          return Promise.resolve()
        }
      },
      select (item) {
        const { multi, onSelect } = this.config

        const wasSelected = this.config.selected.find(i => i.id === item.id)
        this.debug(DEBUG.SELECT_ITEM, { multi, item, wasSelected })

        if (!wasSelected) {
          if (!multi) {
            this.config.items.forEach(i => (i.selected = false))
            this.config.selected.length = 0
          }

          item.selected = true
          this.config.selected.push(item)

          if (onSelect) onSelect({ ...item })

          if (multi) {
            this.$emit('input', this.config.selected)
          } else {
            this.hide('select function')
            this.$emit('input', this.config.selected[0] ? this.config.selected[0] : {})
          }
        } else {
          this.remove(item)
        }
        this.$nextTick(() => {
          this.debug(DEBUG.REQUEST_FOCUS)
          this.$refs.input.focus()
        })
      },
      createConfig (options, value) {
        if (!options) throw ERRORS.NO_OPTIONS
        if (typeof (options) !== 'object') throw ERRORS.WRONG_OPTIONS_TYPE
        if (!options.load) throw ERRORS.NO_LOAD
        if (typeof (options.load) !== 'function') throw ERRORS.WRONG_LOAD_TYPE

        if (!Array.isArray(value) && typeof (value) === 'object') {
          if (options.multi) throw ERRORS.WRONG_VALUE_MULTI
        }

        if (Array.isArray(value)) {
          if (!options.multi) throw ERRORS.WRONG_VALUE_SINGLE
        }

        let selected
        if (!value) selected = []
        else {
          if (!Array.isArray(value) && typeof (value) === 'object') selected = [value]
          else if (Array.isArray(value)) selected = value
        }
        const params = { ...defaultOptions.params, ...options.params }
        const i18n = { ...defaultOptions.i18n, ...options.i18n }

        if (!i18n[options.locale]) throw ERRORS.UNSUPPORTED_LOCALE

        return { ...defaultOptions, ...options, params, i18n, selected }
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
    watch: {
      options: {
        deep: true,
        handler (newOptions) {
          this.config = this.createConfig(newOptions, this.value)
        }
      },
      value: {
        deep: true,
        handler (newValue) {
          if (Array.isArray(newValue)) this.config.selected = newValue
          else this.config.selected = [newValue]
        }
      },
      disable (value) {
        if (value) {
          this.config.selected = []
          if (this.config.onSelect) this.config.onSelect({ selected: false })
        }
      }
    },
    data () {
      return {
        opened: false,
        loading: false,
        error: false,
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
    font-size: 13px;
    user-select: none;
    position: relative;
  }
  .filtro-title {
    font-size: 13px;
  }
  .filtro-content {
    margin-top: 4px;
    position: absolute;
    width: 100%;
    margin-bottom: 30px;
    max-width: 100%;
    padding: 8px;
    border: 1px solid #e5e6e7;
    border-radius: 1px;
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
    border-radius: 1px;
    /* margin-bottom: 10px; */
  }
  .item-box {
    cursor: pointer;
    overflow: hidden;
    min-height: 34px;
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
    border-radius: 1px;
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
    font-size: 14px;
    float: left;
    margin-left: 8px;
    margin-top: 2px;
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
    transform: translateY(-50%);
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
    border-radius: 1px;
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
    border-radius: 1px;
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
    border-radius: 1px;
    width: 1%;
    white-space: nowrap;
    vertical-align: middle;
    display: table-cell;
  }
  .filtro-item-text {
    float: left;
  }
  .v-select-box-search {
    width: 14px;
  }
  .item-color {
    color: #999;
  }
  .item-color-dark {
    color: #546E7A;
  }
  .full-width {
    width: 100%;
  }
  .single-item {
    display: inline-block;
    padding: 0px 6px;
    cursor: pointer;
    transition: all .2s linear;
    font-size: 13px;
    padding-bottom: 0px;
  }
  .single-remove {
    position: absolute;
    right: 35px;
    font-size: 15px;
    top: 5.5px;
  }
  .v-select-disabled {
    background-color: #eee;
    cursor: default;
  }
</style>
