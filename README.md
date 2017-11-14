# v-select-box
[![npm](https://img.shields.io/npm/v/v-select-box.svg)](https://www.npmjs.com/package/v-select-box)
[![npm](https://img.shields.io/npm/dt/v-select-box.svg)](https://www.npmjs.com/package/v-select-box)

Description
-------------------------------------

A vue.js component to provide a box with a list of items with search and pagination.

To integrate it with vuex, use the helper [v-select-box-vuex](https://www.npmjs.com/package/v-select-box-vuex). Use it to create the store module 
(together with the necessary actions, mutations, getters and the state).

Installation
-------------------------------------

    npm install v-select-box

Basic Usage
-------------------------------------

```html
<template>
  <div id="app">
    <v-select-box :options="options"></v-select-box>
  </div>
</template>

<script>
  import VSelectBox from 'v-select-box'
  export default {
    name: 'app',
    components: {
      VSelectBox
    },
    data () {
      return {
        options: {
          multiSelect: false,
          page: 1,
          pageCount: 1,
          items: [],
          itemsPerPage: 10,
          onSelect () => {},
          onSearch () => {},
          loadMore () => {},
          clearItems () => {},
          params: {
            search: 'name',
            pageSize: 'pageSize'
          }
        }
      }
    }
  }
</script>
```

Options
-------------------------------------

Name            | Type     | Default   | Description
:-------------- | :------  | :------   | :----------
multiSelect     | boolean  | false     | Whether or not it allows selection of multiple values.
page            | number   | 1         | Used on the pagination to detemine which is the next page to request.
pageCount       | number   | 1         | Used on the pagination to detemine if the current page is the last.
items           | array    | []        | The items that should be displayed.
itemsPerPage    | number   | 10        | Used on the pagination to detemine how many items each page will have.
onSelect        | function | undefined | Called when the user clicks an item.
onSearch        | function | undefined | Called when the search box receives an input.
loadMore        | function | undefined | Called when the user scrolls to the end of the list, requesting the next page.
clearItems      | function | undefined | Called internally to clear the items array.
params          | object   | {}        | Optional object with the names of params sent in the requests.

Params
-------------------------------------

Name            | Type     | Default   | Description
:-------------- | :------  | :------   | :----------
search          | string   | nome      | The name of the param to send the search query in the requests.
pageSize        | string   | pageSize  | The name of the param to send the size of the page in the requests.

Methods
-------------------------------------
#### onSelect()
The `onSelect()` method is called after the user clicks an item and receives an object containing the item and a flag showing if multiSelect is enabled or not. It doesn't need to return anything.
##### Syntax
`onSelect({ item, multiSelect })`
##### Parameters
- `item` the object representing the list item. It has three properties: 
  - `id` an unique identifier
  - `text` the text visible on the item itself
  - `selected` a boolean value indicating if the item is selected or not
- `multiSelect` the boolean value showing if the v-select-box multiSelect mode is active 
##### Return Value
The `onSelect()` method don't have to return anything.
  
--------------------------------------
#### onSearch()
The `onSearch()` method is called after a debounce when the search box has an input. When it is called, the parameter is an object with the search term that was typed in the search box and the page size. This method needs to return a Promise. The reason is that after the search is done, the component has to redraw the tooltips for the new items.
##### Syntax
`onSearch({ [search], [pageSize] })`
##### Parameters
- `search` the actual name of the property depends on the `params.search`, that could've been passed to the component via the options object. If a `params.search` is not set, the default name for this parameter is `nome`.
- `pageSize` the actual name of the property depends on the `params.pageSize`, that could've been passed to the component via the options object. If a `params.pageSize` is not set, the default name for this parameter is `pageSize`.
##### Return Value
For the reason expressed above, the `onSearch()` method has to return a Promise.
  
--------------------------------------
#### loadMore()
The `loadMore()` method is called when the user scrolls down to the end of the list. When it is called, the parameter is an object with the search term that was typed in the search box and the page size and the number of the current page plus one, if that page exists. If the list is already at the last page, this method won't be called. The `loadMore()` method needs to return a Promise. The reason is that after the loading is done, the component has to redraw the tooltips for the new items.
##### Syntax
`loadMore({ [search], [pageSize], page })`
##### Parameters
- `search` the actual name of the property depends on the `params.search`, that could've been passed to the component via the options object. If a `params.search` is not set, the default name for this parameter is `nome`.
- `pageSize` the actual name of the property depends on the `params.pageSize`, that could've been passed to the component via the options object. If a `params.pageSize` is not set, the default name for this parameter is `pageSize`.
- `page` the number of the page that the component is requesting. The next page.
##### Return Value
For the reason expressed above, the `loadMore()` method has to return a Promise.
  
--------------------------------------
#### clearItems()
The `clearItems()` method is an internal function that clears the list of items. It is exposed this way to help us work with vuex. It will be reworked/removed in the future versions.
##### Syntax
`clearItems()`
##### Parameters
It doesn't have any parameters
##### Return Value
It doesn't need to return anything.
  
-------------------------------------

Examples
-------------------------------------

There is a simple working example in [this](https://github.com/rodrigooslp/v-select-box-example) repository. A full example with [v-select-box-vuex](https://www.npmjs.com/package/v-select-box-vuex), with all bells and whistles is on the roadmap and will be up soon.

New Features
-------------------------------------

There is a list of features that are currently being worked on. They will be pushed to this repository as soon as they're finished.
  
Your feedback is appreciated!
