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

        <FormItem label="用户名">
          <Input v-model="editForm.username" placeholder="请输入用户名"  />
        </FormItem>

        <FormItem label="密码">
          <Input v-model="editForm.password_hash" placeholder="请输入密码" />
        </FormItem>

        <FormItem label="是否超级用户">
          <Input v-model="editForm.is_superuser" placeholder="请输入是否超级用户" />
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
        <FormItem label="用户名">
          <Input v-model="createForm.username" placeholder="请输入用户名"  />
        </FormItem>

        <FormItem label="密码">
          <Input v-model="createForm.password_hash" placeholder="请输入密码" />
        </FormItem>

        <FormItem label="是否超级用户">
          <Input v-model="createForm.is_superuser" placeholder="请输入是否超级用户" />
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
              label: "用户名",
              name: "username",
              type: "input",
              placeholder: "请输入用户名",
              labelWidth: "80px",
            },
            {
              col: 10,
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
              col: 10,
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
          username: "",
        },
      },
      columns: [
        { title: "ID", key: "id" },
        { title: "用户名",key: "username" },
        { title: "密码", key: "password_hash" },
        { title: "是否超级用户", key: "is_superuser" },
        { title: "创建时间", key: "created" },
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
        username: "",
        password_hash: "",
        is_superuser: "",
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        username: ""
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        username: v.username,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        username: "",
      };
      this.handleSearch();
    },
    async handleSearch() { // 获取列表
      this.loadingTable = true;
      await this.$axios
        .post("/api/v1/account_manage/mqtt_users")
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
        .post("/api/v1/account_manage/create_mqtt_user", {
          username: this.createForm.username,
          password_hash: this.createForm.password_hash,
          is_superuser: Number(this.createForm.is_superuser),
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
        .post("/api/v1/account_manage/update_mqtt_user", {
          id: Number(this.editForm.id),
          username: this.editForm.username,
          password_hash: this.editForm.password_hash,
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
