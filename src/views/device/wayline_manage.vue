<template>
  <Main class="page-exchange">
    <UserForm
      :formData="formData"
      @onSearch="onSearch"
      @onReset="onReset"
      @onAdd="createStatus = true"
    ></UserForm>
    
    <tables
      ref="tables"
      editable
      :loading="loadingTable"
      v-model="tableData"
      :columns="columns"
      @on-search="handleSearch"
      :deleteable="false"
    ></tables>

    <div class="page-pages" v-if="total > searchForm.page_size">
      <Page
        :current.sync="searchForm.current"
        :pageSize="searchForm.page_size"
        :total="total"
        @on-change="handleSearch"
      ></Page>
    </div>

    <Modal
      class="page-exchange-win"
      width="800px"
      v-model="editStatus"
      title="修改"
      @on-ok="doEdit"
      :loading="loadingModal"
    >
      <Form :model="editForm" :label-width="100">
        <FormItem label="ID">
          <Input v-model="editForm.id" placeholder="" disabled />
        </FormItem>

        <FormItem label="设备ID">
          <Input v-model="editForm.device_id" placeholder="请输入设备ID"  />
        </FormItem>

        <FormItem label="航线名称">
          <Input v-model="editForm.name" placeholder="请输入项目名称" />
        </FormItem>

        <FormItem label="路径">
          <Input v-model="editForm.path" placeholder="请输入路径" />
        </FormItem>

        <FormItem label="是否开启">
          <Input v-model="editForm.enable" placeholder="请输入是否开启" />
        </FormItem>
      </Form>
    </Modal>


    <Modal
      class="page-exchange-win"
      width="800px"
      v-model="createStatus"
      title="新增"
      @on-ok="doCreate"
      :loading="loadingModal"
    >
      <Form :model="createForm" :label-width="170">
         <FormItem label="设备ID">
          <Input v-model="createForm.id" placeholder="请输入设备ID" />
        </FormItem>
        
        <FormItem label="航线名称">
          <Input v-model="createForm.name" placeholder="请输入航线名称" />
        </FormItem>

        <FormItem label="路径">
          <Input v-model="createForm.path" placeholder="请输入路径" />
        </FormItem>

        <FormItem label="是否开启">
          <Input v-model="createForm.enable" placeholder="请输入是否开启" />
        </FormItem>
      </Form>
    </Modal>

  </Main>
</template>
<script>
import Tables from "@/components/tables";
import UserForm from "@/components/user/userForm.vue";

export default {
  name: "Asset_tables",
  components: {
    Tables,
    UserForm,
  },
  data() {
    return {
      loadingTable: false,
      loadingModal: false,
      tableData: [],

      fileList: [],
      domain: "https://air-pigeon.oss-cn-hangzhou.aliyuncs.com/",
      limit: 1,

      formData: {
        contents: [
          [
            {
              col: 4,
              label: "设备ID",
              name: "device_id",
              type: "input",
              placeholder: "请输入设备ID",
              labelWidth: "100px",
            },
            {
              col: 4,
              label: "航线名称",
              name: "name",
              type: "input",
              placeholder: "请输入",
              labelWidth: "100px",
            },
            {
              col: 8,
              labelWidth: "0px",
              operation: [
                {
                  name: "搜索",
                  method: "onSearch",
                },
                {
                  name: "重置",
                  method: "onReset",
                },
                
              ],
              type: "button",
              align: "start",
            },
            {
              col: 8,
              labelWidth: "0px",
              operation: [
                {
                  name: "新增",
                  method: "onAdd",
                },
              ],
              type: "button",
              align: "end",
            },
          ],
        ],
        labelWidth: "80px",
        data: {
          device_id: "",
          name: "",
        },
      },
      columns: [
        { title: "ID", key: "id" },
        { title: "设备ID",key: "device_id" },
        { title: "航线名称", key: "name" },
        { title: "路径", key: "path" },
        { title: "是否开启", key: "enable" },
        {
          title: this.$lang("操作"),
          key: "handle",
          align: "right",
          fixed: "right",
          width: 120,
          button: [
            (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.editStatus = true;
                        // this.fileList = [params.row.img_url];
                        Object.assign(this.editForm, params.row);
                      },
                    },
                  },
                  this.$lang("编辑")
                ),
              ]);
            },
          ],
        },
      ],
      searchOptions: [],
      total: 0,
      editStatus: false,
      createStatus: false,
      createForm: {
        device_id: "",
        name: "",
        path: "",
        enable: 1,
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        devide_id: "",
        name: "",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        device_id: v.device_id,
        name: v.name,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        devide_id: "",
        name: "",
      };
      this.handleSearch();
    },
    async handleSearch() { // 获取列表
      this.loadingTable = true;
      await this.$axios
        .post("/api/v1/device_manage/wayline_files")
        .then((result) => {
            // console.log("result", result);
          if (result.code === 10000) {
            this.tableData = result.data ? result.data : [];
            this.total = result.total;
            console.log(this.tableData);
          }
        });
      this.loadingTable = false;
    },
    async doCreate() { // 新增
      this.loadingModal = true;
      await this.$axios
        .post("/api/v1/device_manage/create_wayline_file", {
          device_id: Number(this.createForm.device_id),
          name: this.createForm.name,
          path: this.createForm.path,
          enable: Number(this.createForm.enable),
        })
        .then((result) => {
          this.loadingModal = false;
          if (result.code == 10000) {
            this.$Notice.success({
              title: this.$lang("新增成功"),
              duration: 2,
            });
            this.creatWinStatus = false;
          } else {
            this.$Notice.error({
              title: this.$lang("新增失败"),
              duration: 2,
            });
            this.creatWinStatus = false;
          }
          this.onReset();
        });
      this.loadingModal = false;
    },
    async doEdit() { // 修改
      this.loadingModal = true;
      await this.$axios
        .post("/api/v1/device_manage/update_wayline_file", {
          id: Number(this.editForm.id),
          device_id: Number(this.editForm.device_id),
          name: this.editForm.name,
          path: this.editForm.path,
          enable: Number(this.editForm.enable),
          sign: this.editForm.sign,
        })
        .then((result) => {
          if (result.code == 10000) {
            this.$Notice.success({
              title: "修改成功",
              duration: 2,
            });
            this.editStatus = false;
          } else {
            this.$Notice.error({
              title: "修改失败",
              duration: 2,
            });
            this.editStatus = false;
          }
          this.handleSearch();
        });
      this.loadingModal = false;
    },
  },
  mounted() {
    this.handleSearch();
  },
};
</script>
<style lang="less" scoped>

</style>
