<template>
  <Main class="page-exchange">
    <UserForm
      :formData="formData"
      @onSearch="onSearch"
      @onReset="onReset"
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
      v-model="editStatus"
      title="修改"
      @on-ok="doEdit"
      :loading="loadingModal"
    >
      <Form :model="editForm" :label-width="170">
        <FormItem label="ID">
          <Input v-model="editForm.id" placeholder="" disabled />
        </FormItem>
        <FormItem label="起飞ID">
          <Input v-model="editForm.flight_id" placeholder="" disabled />
        </FormItem>
        <FormItem label="状态">
          <Input v-model="editForm.status" placeholder="" />
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
      formData: {
        contents: [
          [
            {
              col: 4,
              label: "微信用户ID",
              name: "wechat_user_id",
              type: "input",
              placeholder: "请输入微信用户ID",
              labelWidth: "120px",
            },
            {
              col: 4,
              label: "飞行ID",
              name: "flight_id",
              type: "input",
              placeholder: "请输入飞行ID",
              labelWidth: "100px",
            },
            {
              col: 4,
              label: "机场SN",
              name: "airport_sn",
              type: "input",
              placeholder: "请输入",
              labelWidth: "100px",
            },
            {
              col: 4,
              label: "无人机SN",
              name: "drone_sn",
              type: "input",
              placeholder: "请输入",
              labelWidth: "100px",
            },
          ],
          [
            {
              col: 4,
              label: "时间排序",
              name: "sort",
              type: "select",
              options: [
                {
                  label: "降序",
                  value: "created_at desc",
                },
                {
                  label: "升序",
                  value: "created_at asc",
                },
              ],
            },
            {
              col: 4,
              label: "起飞状态",
              name: "takeoff_status",
              type: "input",
              placeholder: "请输入",
              labelWidth: "100px",
            },
            {
              col: 4,
              label: "状态",
              name: "status",
              type: "input",
              placeholder: "请输入",
              labelWidth: "100px",
            },
            {
              col: 4,
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
          ],
        ],
        labelWidth: "80px",
        data: {
          wechat_user_id: "",
          flight_id: "",
          drone_sn: "",
          takeoff_status: "",
          status: "",
          airport_sn: "",
          sort: "created_at desc",
        },
      },
      columns: [
        { title: "id", key: "id", minWidth: 60 },
        { title: "微信用户ID", key: "wechat_user_id", minWidth: 110 },
        { title: "飞行ID", key: "flight_id", minWidth: 140 },
        { title: "机场SN", key: "airport_sn", minWidth: 160 },
        { title: "无人机SN", key: "drone_sn", minWidth: 140 },
        {
          title: "开始时间",
          key: "start_time",
          render: (h, p) => {
            if (p.row.start_time == "0001-01-01T00:00:00Z") {
              return h("span", "-");
            }
            return h("span", new Date(p.row.current_time).format());
          },
          minWidth: 150,
        },
        {
          title: "当前时间",
          key: "current_time",
          render: (h, p) => {
            if (p.row.current_time == "0001-01-01T00:00:00Z") {
              return h("span", "-");
            }
            return h("span", new Date(p.row.current_time).format());
          },
          minWidth: 150,
        },
        {
          title: "使用时间(秒)",
          key: "use_time",
          render: (h, p) => {
            const minutes = Math.floor(Number(p.row.use_time) / 60);
            const remainingSeconds = Number(p.row.use_time) % 60;
            return h(
              "span",
              `${minutes}分${remainingSeconds ? remainingSeconds + "秒" : ""}`
            );
          },
          minWidth: 120,
        },
        { title: "状态", key: "status", minWidth: 80 },
        { title: "起飞状态", key: "takeoff_status", minWidth: 120 },
        {
          title: "创建时间",
          key: "created_at",
          render: (h, p) => {
            return h("span", new Date(p.row.created_at).format());
          },
          minWidth: 150,
        },
        {
          title: "更新时间",
          key: "updated_at",
          render: (h, p) => {
            return h("span", new Date(p.row.updated_at).format());
          },
          minWidth: 150,
        },
        {
          title: this.$lang("操作"),
          key: "handle",
          align: "right",
          fixed: "right",
          minWidth: 120,
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
                        this.nextType = "edit";
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
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        wechat_user_id: "",
        flight_id: "",
        drone_sn: "",
        takeoff_status: "",
        status: "",
        airport_sn: "",
        sort: "created_at desc",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        wechat_user_id: Number(v.wechat_user_id),
        flight_id: v.flight_id,
        drone_sn: v.drone_sn,
        takeoff_status: Number(v.takeoff_status),
        status: Number(v.status),
        airport_sn: v.airport_sn,
        sort: v.sort,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        wechat_user_id: 0,
        flight_id: "",
        drone_sn: "",
        takeoff_status: 0,
        status: 0,
        airport_sn: "",
        sort: "created_at desc",
      };
      this.handleSearch();
    },
    async handleSearch() {
      this.loadingTable = true;
      await this.$axios
        .post("/api/v1/flight_manage/get_flight_task", {
          current: Number(this.searchForm.current),
          page_size: Number(this.searchForm.page_size),
          wechat_user_id: Number(this.searchForm.wechat_user_id),
          flight_id: this.searchForm.flight_id,
          drone_sn: this.searchForm.drone_sn,
          takeoff_status: Number(this.searchForm.takeoff_status),
          status: Number(this.searchForm.status),
          airport_sn: this.searchForm.airport_sn,
          sort: this.searchForm.sort,
        })
        .then((result) => {
          console.log("result", result);
          if (result.code === 10000) {
            this.tableData = result.data ? result.data : [];
            this.total = result.total;
            console.log(this.tableData);
          }
        });
      this.loadingTable = false;
    },
    async doEdit() {
      this.loadingModal = true;

      await this.$axios
        .post("/api/v1/flight_manage/update_flight_task_status", {
          flight_id: this.editForm.flight_id,
          status: Number(this.editForm.status),
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
<style lang="less" scoped></style>
