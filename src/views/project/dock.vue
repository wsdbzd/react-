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

        <FormItem label="机场SN">
          <Input v-model="editForm.airport_sn" placeholder="请输入机场SN"  />
        </FormItem>

        <FormItem label="舱内温度">
          <Input v-model="editForm.temperature" placeholder="请输入舱内温度" />
        </FormItem>

        <FormItem label="环境温度">
          <Input v-model="editForm.environment_temperature" placeholder="请输入环境温度" />
        </FormItem>

        <FormItem label="风速">
          <Input v-model="editForm.wind_speed" placeholder="请输入风速" />
        </FormItem>

        <FormItem label="剩余电量">
          <Input v-model="editForm.capacity_percent" placeholder="请输入剩余电量" />
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
        <FormItem label="机场SN">
          <Input v-model="createForm.airport_sn" placeholder="请输入机场SN"  />
        </FormItem>

        <FormItem label="舱内温度">
          <Input v-model="createForm.temperature" placeholder="请输入舱内温度" />
        </FormItem>

        <FormItem label="环境温度">
          <Input v-model="createForm.environment_temperature" placeholder="请输入环境温度" />
        </FormItem>

        <FormItem label="风速">
          <Input v-model="createForm.wind_speed" placeholder="请输入风速" />
        </FormItem>

        <FormItem label="剩余电量">
          <Input v-model="createForm.capacity_percent" placeholder="请输入剩余电量" />
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
              label: "ID",
              name: "id",
              type: "input",
              placeholder: "请输入设备ID",
              labelWidth: "80px",
            },
            {
              col: 6,
              label: "机场SN",
              name: "airport_sn",
              type: "input",
              placeholder: "请输入机场SN",
              labelWidth: "120px",
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
              col: 6,
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
          id: "",
          airport_sn: "",
        },
      },
      columns: [
        { title: "ID", key: "id" },
        { title: "机场SN",key: "airport_sn" },
        { title: "舱内温度", key: "temperature" },
        { title: "环境温度", key: "environment_temperature" },
        { title: "风速", key: "wind_speed" },
        { title: "剩余电量", key: "capacity_percent" },
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
        id: "",
        airport_sn: "",
        temperature: "",
        environment_temperature: "",
        wind_speed: "",
        capacity_percent: "",
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        id: "",
        airport_sn: "",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        id: v.id,
        airport_sn: v.airport_sn,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        id: "",
        airport_sn: "",
      };
      this.handleSearch();
    },
    async handleSearch() { // 获取列表
      this.loadingTable = true;
      await this.$axios
        // .post("/api/v1/device_manage/wayline_files")
        // .then((result) => {
        //     // console.log("result", result);
        //   if (result.code === 10000) {
        //     this.tableData = result.data ? result.data : [];
        //     this.total = result.total;
        //     console.log(this.tableData);
        //   }
        // });
      this.loadingTable = false;
    },
    async doCreate() { // 新增
      this.loadingModal = true;
      await this.$axios
        .post("/api/v1/device_manage/create_wayline_file", {
          airport_sn: this.createForm.airport_sn,
          temperature: this.createForm.temperature,
          environment_temperature: this.createForm.environment_temperature,
          wind_speed: this.createForm.wind_speed,
          capacity_percent: this.createForm.capacity_percent,
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
          airport_sn: this.editForm.airport_sn,
          temperature: this.editForm.temperature,
          environment_temperature: this.editForm.environment_temperature,
          wind_speed: this.editForm.wind_speed,
          capacity_percent: this.editForm.capacity_percent,
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
