# v-select-box
[![npm](https://img.shields.io/npm/v/v-select-box.svg)](https://www.npmjs.com/package/v-select-box)
[![npm](https://img.shields.io/npm/dt/v-select-box.svg)](https://www.npmjs.com/package/v-select-box)

Description
-------------------------------------

A vue.js component to provide a box with a list of items with search and pagination.

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
          onSelect (item) => {},
          load (params) => {}
        }
      }
    }
  }
</script>
```

Options
-------------------------------------

Name            | Type     | Default   | Required | Description
:-------------- | :------  | :------   | :------- |:----------
multi           | boolean  | true      | false    | Whether or not it allows selection of multiple values.
debug           | boolean  | false     | false    | Debug flag that enables console messages.
page            | number   | 1         | false    | Used to detemine which is the next page to request.
pageCount       | number   | 1         | false    | Used to detemine if the current page is the last.
pageSize        | number   | 10        | false    | How many items each page will have.
placeholder     | string   | ''        | false    | The placeholder displayed.
locale          | string   | 'enUS'    | false    | The language displayed.
items           | array    | []        | false    | The items that should be displayed.
selected        | array    | []        | false    | The items that have been selected.
onSelect        | function | undefined | true     | Called after the user clicks an item.
load            | function | undefined | true     | Called to request items to display in the list.
params          | object   | {}        | false    | Optional object with the names of params sent in the requests.

Params
-------------------------------------

Name            | Type     | Default   | Required | Description
:-------------- | :------  | :------   | :------- | :----------
search          | string   | q         | false    | The name of the param to send the search query in the requests.
size            | string   | pageSize  | false    | The name of the param to send the size of the page in the requests.

Methods
-------------------------------------

#### onSelect()
The `onSelect()` method is called after the user clicks an item and receives an object containing the item.
##### Syntax
`onSelect(item)`
##### Parameters
- `item` the object representing the list item. It has three properties:
  - `id` an unique identifier
  - `text` the text visible on the item itself
  - `selected` a boolean value indicating if the item is selected or not

  PS: this is the item suggested structure, there isn't any place where this is hardcoded. It is done this way because it's easier to plug the vuex helper with a simple format like this.
##### Return Value
The `onSelect()` method doesn't have to return anything.

--------------------------------------
#### load()
The `load()` method is called when the component needs to populate the list with items. When it is called, the parameter is an object with the search term that was typed in the search box and the page size and the number of the page that needs to be requested. The `load()` method needs to return a Promise. The promise needs to be resolved with an object with the following structure:
- `page` the current page
- `pageCount` the total of pages
- `pageSize` how many items each page has
- `items` an array containing the items that should be displayed
  - `id` an unique identifier
  - `text` the text visible on the item itself
  - `selected` a boolean value indicating if the item is selected or not
##### Syntax
`load({ [search], [size], page })`
##### Parameters
- `search` the actual name of the property depends on the `params.search`, that could've been passed to the component via the options object. If a `params.search` is not set, the default name for this parameter is `nome`.
- `pageSize` the actual name of the property depends on the `params.pageSize`, that could've been passed to the component via the options object. If a `params.pageSize` is not set, the default name for this parameter is `pageSize`.
- `page` the number of the page that the component is requesting. The next page.
##### Return Value
For the reason expressed above, the `load()` method has to return a Promise.

New Features
-------------------------------------

There is a list of features that are currently being worked on. They will be pushed to this repository as soon as they're finished.

Your feedback is appreciated!
