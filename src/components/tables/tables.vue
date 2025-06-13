<template>
  <div>
    <div
      v-if="searchable && searchPlace === 'top'"
      class="search-con search-con-top option-btns"
    >
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          v-if="searchOptions.indexOf(item.key) > -1"
          :value="item.key"
          :key="`search-col-${item.key}`"
          >{{ item.title }}</Option
        >
      </Select>
      <Input
        @on-change="handleClear"
        clearable
        placeholder="search keys"
        class="search-input"
        v-model="searchValue"
      />
      <Button @click="handleSearch" class="search-btn" type="primary"
        ><Icon type="search" />&nbsp;&nbsp;Search</Button
      >

      <Input
        v-if="customInputable === true"
        @on-change="handleCustomInput"
        clearable
        placeholder=""
        class="search-input"
        v-model="customInput"
      />
      <p v-if="customInputable === true" class="search-input">
        {{ customInputTip }}
      </p>

      <Button
        v-if="deleteable === true"
        style="float: right; margin: 4px"
        @click="modalDelete = true"
        class="search-btn"
        type="primary"
        ><Icon type="search" />&nbsp;&nbsp;删除选中</Button
      >
      <Modal
        v-model="modalDelete"
        title="删除提示"
        @on-ok="handleDeleteSelected"
        @on-cancel="modelDeleteCancel"
      >
        <p>确定要删除选中行吗？</p>
      </Modal>
      <div style="width: 100%" v-if="addable === true"></div>
      <Button
        v-if="addable === true"
        style="margin: 4px"
        size="large"
        type="primary"
        icon="md-add-circle"
        ghost
        @click="handleAddRow"
        class="search-btn"
        >{{ $lang("新增") }}</Button
      >
      <slot name="button" style="float: right; margin: 4px"></slot>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :searchOptions="searchOptions"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :addable="addable"
      :deleteable="deleteable"
      :customInputTip="customInputTip"
      :customInputable="customInputable"
      :searchOffline="searchOffline"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-add-row="handleAddRow"
      @on-search="handleSearch"
      @on-delete-selected="handleDeleteSelected"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <div
      v-if="searchable && searchPlace === 'bottom'"
      class="search-con search-con-top"
    >
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          v-if="searchOptions.indexOf(item.key) > -1"
          :value="item.key"
          :key="`search-col-${item.key}`"
          >{{ item.title }}</Option
        >
      </Select>
      <Input
        placeholder="search keys"
        class="search-input"
        v-model="searchValue"
      />
      <Button class="search-btn" type="primary"
        ><Icon type="search" />&nbsp;&nbsp;search</Button
      >
    </div>
    <a
      id="hrefToExportTable"
      style="display: none; width: 0px; height: 0px"
    ></a>
  </div>
</template>

<script>
import TablesEdit from "./edit.vue";
import handleBtns from "./handle-btns";
import "./index.less";
export default {
  name: "Tables",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    searchOptions: {
      type: Array,
      default() {
        return ["token_id"];
      },
    },
    size: String,
    width: {
      type: [Number, String],
    },
    height: {
      type: [Number, String],
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    addable: {
      type: Boolean,
      default: true,
    },
    customInputable: {
      type: Boolean,
      default: false,
    },
    customInputTip: {
      type: String,
      default: "",
    },
    searchOffline: {
      type: Boolean,
      default: false,
    },
    deleteable: {
      type: Boolean,
      default: true,
    },
    highlightRow: {
      type: Boolean,
      default: false,
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      },
    },
    context: {
      type: Object,
    },
    noDataText: {
      type: String,
    },
    noFilteredDataText: {
      type: String,
    },
    disabledHover: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: "top",
    },
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: "",
      edittingText: "",
      searchValue: "",
      searchKey: "",
      modalDelete: false,
      customInput: "",
    };
  },
  methods: {
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable,
          },
          on: {
            input: (val) => {
              this.edittingText = val;
            },
            "on-start-edit": (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`;
              this.$emit("on-start-edit", params);
            },
            "on-cancel-edit": (params) => {
              this.edittingCellId = "";
              this.$emit("on-cancel-edit", params);
            },
            "on-save-edit": (params) => {
              this.value[params.row.initRowIndex][params.column.key] =
                this.edittingText;
              this.$emit("input", this.value);
              this.$emit(
                "on-save-edit",
                Object.assign(params, {
                  id: this.insideTableData[params.index].id,
                  key: params.column.key,
                  value: this.edittingText,
                  data: params.row,
                })
              );
              this.edittingCellId = "";
            },
          },
        });
      };
      return item;
    },
    surportHandle(item) {
      let options = item.options || [];
      let insideBtns = [];
      options.forEach((item) => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item]);
      });
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
      item.render = (h, params) => {
        params.tableData = this.value;
        return h(
          "div",
          btns.map((item) => item(h, params, this))
        );
      };
      return item;
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item;
        if (res.editable) res = this.suportEdit(res, index);
        if (res.key === "handle") res = this.surportHandle(res);
        return res;
      });
    },
    setDefaultSearchKey() {
      //this.searchKey = (this.columns[0].key !== 'handle' && this.columns[0].key !== '') ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
    handleSearch() {
      if (this.searchOffline === true)
        this.insideTableData = this.value.filter(
          (item) => item[this.searchKey].indexOf(this.searchValue) > -1
        );
      else this.$emit("on-search", this.searchKey, this.searchValue);
    },
    handleCustomInput() {
      this.$emit("on-CustomInput", this.customInput);
    },
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        let res = item;
        res.initRowIndex = index;
        return res;
      });
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params);
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow();
    },
    handleAddRow() {
      this.$emit("on-add-row");
    },
    handleDeleteSelected() {
      this.$emit("on-delete-selected");
    },
    modelDeleteCancel() {
      //this.$Message.info('Clicked cancel');
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("on-current-change", currentRow, oldCurrentRow);
    },
    onSelect(selection, row) {
      this.$emit("on-select", selection, row);
    },
    onSelectCancel(selection, row) {
      this.$emit("on-select-cancel", selection, row);
    },
    onSelectAll(selection) {
      this.$emit("on-select-all", selection);
    },
    onSelectionChange(selection) {
      this.$emit("on-selection-change", selection);
    },
    onSortChange(column, key, order) {
      this.$emit("on-sort-change", column, key, order);
    },
    onFilterChange(row) {
      this.$emit("on-filter-change", row);
    },
    onRowClick(row, index) {
      this.$emit("on-row-click", row, index);
    },
    onRowDblclick(row, index) {
      this.$emit("on-row-dblclick", row, index);
    },
    onExpand(row, status) {
      this.$emit("on-expand", row, status);
    },
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns);
      this.setDefaultSearchKey();
    },
    value(val) {
      this.handleTableData();
      //if (this.searchable && this.searchKey != '' && this.searchValue != '') this.handleSearch()
    },
  },
  mounted() {
    this.handleColumns(this.columns);
    this.setDefaultSearchKey();
    this.handleTableData();
  },
};
</script>
