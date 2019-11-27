# v-select-box
[![npm](https://img.shields.io/npm/v/v-select-box.svg)](https://www.npmjs.com/package/v-select-box)
[![npm](https://img.shields.io/npm/dy/v-select-box)](https://www.npmjs.com/package/v-select-box)

Demo
-------------------------------------
There is an example showcasing the component [here](https://github.com/rodrigooslp/v-select-box-example).

Description
-------------------------------------

A vue.js component to provide a box with a list of items with search and pagination, without the overhead of jquery.

Features
-------------------------------------
- Search
- Infinite Scroll
- Single/Multi Select
- Minimal Size

Installation
-------------------------------------

    npm install v-select-box

Basic Usage
-------------------------------------

```html
<template>
  <div id="app">
    <v-select-box v-model="selected" :options="options"></v-select-box>
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
        selected: {},
        options: {
          load: (params) => {
            //Request code goes here
            //Should return a Promise, resolving the result object
            const mock = {
              page: 1,
              pageCount: 1,
              pageSize: 10,
              items: [
                { id: 1, text: 'test1' },
                { id: 2, text: 'test2' }
              ]
            }

            return Promise(mock)
          }
        }
      }
    }
  }
</script>
```

Options
-------------------------------------

The only property required for the `v-select-box` to work is the `load` function. All the other ones are optional.

Name            | Type     | Default   | Description
:-------------- | :------  | :------   |:----------
multi           | boolean  | false     | Whether or not it allows selection of multiple items.
debug           | boolean  | false     | Debug flag that enables console messages.
page            | number   | 1         | Used to detemine which is the next page to request.
pageCount       | number   | 1         | Used to detemine if the current page is the last.
pageSize        | number   | 10        | How many items each page will have.
minimumInput    | number   | 0         | The minimum number of characters the search query should have.
placeholder     | string   | ''        | The placeholder displayed.
locale          | string   | 'enUS'    | The language displayed.
items           | array    | []        | The items that should be displayed.
onSelect        | function | undefined | Called after the user clicks an item.
load            | function | undefined | Called to request items to display in the list.
params          | object   | {}        | Optional object with the names of params sent in the requests.

Params
-------------------------------------

Name            | Type     | Default   | Description
:-------------- | :------  | :------   | :----------
search          | string   | q         | The name of the param to send the search query in the requests.
size            | string   | pageSize  | The name of the param to send the size of the page in the requests.

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
##### Syntax
`load({ [search], [size], page })`
##### Parameters
- `search` the actual name of the property depends on the `params.search`, that could've been passed to the component via the options object. If a `params.search` is not set, the default name for this parameter is `q`.
- `size` the actual name of the property depends on the `params.size`, that could've been passed to the component via the options object. If a `params.size` is not set, the default name for this parameter is `pageSize`.
- `page` the number of the page that the component is requesting. The next page.
##### Return Value
For the reasons expressed above, the `load()` method has to return a Promise.

New Features
-------------------------------------

There is a list of features that are currently being worked on. They will be pushed to this repository as soon as they're finished.

Your feedback is appreciated!
