<template>
  <Main class="page-exchange">
    <tables
      ref="tables"
      editable
      :loading="loadingTable"
      v-model="tableData"
      :columns="columns"
      @on-search="handleSearch"
      :deleteable="false"
    ></tables>

    <Modal
      class="page-exchange-win"
      v-model="editStatus"
      title="修改"
      @on-ok="doEdit"
      :loading="loadingModal"
    >
      <Form :model="editForm" :label-width="170">
        <FormItem label="飞行时间(分钟)">
          <Input v-model="editForm.flight_time" placeholder="请输入飞行时间" />
        </FormItem>
        <FormItem label="起飞电量">
          <Input v-model="editForm.takeoff_battery" placeholder="" />
        </FormItem>
        <FormItem label="健康检查时间">
          <Input v-model="editForm.health_check_time" placeholder="" />
        </FormItem>
      </Form>
    </Modal>
  </Main>
</template>
<script>
import Tables from "@/components/tables";

export default {
  name: "Asset_tables",
  components: {
    Tables,
  },
  data() {
    return {
      loadingTable: false,
      loadingModal: false,
      tableData: [],
      columns: [
        { title: "id", key: "id" },
        { title: "飞行时间", key: "flight_time" },
        { title: "起飞电量", key: "takeoff_battery" },
        { title: "健康检查时间", key: "health_check_time" },
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
        page_size: 10,
      },
    };
  },
  methods: {
    async handleSearch() {
      this.loadingTable = true;
      await this.$axios
        .get("/api/v1/flight_manage/flight_setting", {
          params: this.searchForm,
        })
        .then((result) => {
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
        .post("/api/v1/flight_manage/update_flight_setting", {
          id: this.editForm.id,
          flight_time: Number(this.editForm.flight_time),
          takeoff_battery: Number(this.editForm.takeoff_battery),
          health_check_time: Number(this.editForm.health_check_time),
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
