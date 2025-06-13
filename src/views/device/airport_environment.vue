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

        <FormItem label="无人机序列号">
          <Input v-model="editForm.serial_number" placeholder="请输入无人机序列号"  />
        </FormItem>

        <FormItem label="设备工作区坐标文件">
          <Input v-model="editForm.coordinate_file" placeholder="请输入设备工作区坐标文件" />
        </FormItem>

        <FormItem label="机场舱内温度">
          <Input v-model="editForm.temperature" placeholder="请输入机场舱内温度" />
        </FormItem>

        <FormItem label="风速">
          <Input v-model="editForm.wind_speed" placeholder="请输入风速" />
        </FormItem>

        <FormItem label="雨量">
          <Input v-model="editForm.rainfall" placeholder="请输入雨量" />
        </FormItem>

        <FormItem label="电池剩余电量">
          <Input v-model="editForm.remaining_power" placeholder="请输入电池剩余电量" />
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
        <FormItem label="ID">
          <Input v-model="createForm.id" placeholder="请输入ID" />
        </FormItem>

        <FormItem label="无人机序列号">
          <Input v-model="createForm.serial_number" placeholder="请输入无人机序列号"  />
        </FormItem>

        <FormItem label="设备工作区坐标文件">
          <Input v-model="createForm.coordinate_file" placeholder="请输入设备工作区坐标文件" />
        </FormItem>

        <FormItem label="机场舱内温度">
          <Input v-model="createForm.temperature" placeholder="请输入机场舱内温度" />
        </FormItem>

        <FormItem label="风速">
          <Input v-model="createForm.wind_speed" placeholder="请输入风速" />
        </FormItem>

        <FormItem label="雨量">
          <Input v-model="createForm.rainfall" placeholder="请输入雨量" />
        </FormItem>

        <FormItem label="电池剩余电量">
          <Input v-model="createForm.remaining_power" placeholder="请输入电池剩余电量" />
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
              labelWidth: "100px",
            },
            {
              col: 6,
              label: "无人机序列号",
              name: "serial_number",
              type: "input",
              placeholder: "请输入无人机序列号",
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
          serial_number: "",
        },
      },
      columns: [
        { title: "ID", key: "id" },
        { title: "无人机序列号",key: "serial_number" },
        { title: "设备工作区坐标文件", key: "coordinate_file" },
        { title: "机场舱内温度", key: "temperature" },
        { title: "风速", key: "wind_speed" },
        { title: "雨量", key: "rainfall" },
        { title: "电池剩余电量", key: "remaining_power" },
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
        serial_number: "",
        coordinate_file: "",
        wind_speed: "",
        rainfall: "",
        remaining_power: "",
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        id: "",
        serial_number: "",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        id: v.id,
        serial_number: v.serial_number,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        id: "",
        serial_number: "",
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
          id: Number(this.createForm.id),
          serial_number: this.createForm.serial_number,
          coordinate_file: this.createForm.coordinate_file,
          wind_speed: this.createForm.wind_speed,
          rainfall: this.createForm.rainfall,
          remaining_power: this.createForm.remaining_power,
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
          serial_number: this.editForm.serial_number,
          coordinate_file: this.editForm.coordinate_file,
          wind_speed: this.editForm.wind_speed,
          rainfall: this.editForm.rainfall,
          remaining_power: this.editForm.remaining_power,
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
