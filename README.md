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
    npm install v-select-box-vuex

Basic Usage
-------------------------------------

```html
  <template>
    <div id="app">
      <v-select-box :options="options"></v-select-box>
    </div>
  </template>
```

```javascript
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
name            | string   | nome      | The name of the param to send the search query in the requests.
pageSize        | string   | pageSize  | The name of the param to send the size of the page in the requests.
