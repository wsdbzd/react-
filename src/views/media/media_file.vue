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

        <FormItem label="飞行ID">
          <Input v-model="editForm.flight_id" placeholder="请输入飞行ID"  />
        </FormItem>

        <FormItem label="设备ID">
          <Input v-model="editForm.device_id" placeholder="请输入设备ID" />
        </FormItem>

        <FormItem label="项目ID">
          <Input v-model="editForm.project_id" placeholder="请输入项目ID" />
        </FormItem>

        <FormItem label="微信用户ID">
          <Input v-model="editForm.wechat_user_id" placeholder="请输入微信用户ID" />
        </FormItem>

        <FormItem label="机场SN">
          <Input v-model="editForm.airport_sn" placeholder="请输入机场SN" />
        </FormItem>

        <FormItem label="拍摄绝对高度">
          <Input v-model="editForm.absolute_altitude" placeholder="请输入拍摄绝对高度" />
        </FormItem>

        <FormItem label="拍摄位置纬度">
          <Input v-model="editForm.shoot_position_lat" placeholder="请输入拍摄位置纬度" />
        </FormItem>

        <FormItem label="拍摄位置经度">
          <Input v-model="editForm.shoot_position_lng" placeholder="请输入拍摄位置经度" />
        </FormItem>

        <FormItem label="文件名称">
          <Input v-model="editForm.file_name" placeholder="请输入文件名称" />
        </FormItem>

        <FormItem label="文件业务路径">
          <Input v-model="editForm.path" placeholder="请输入文件业务路径" />
        </FormItem>

        <FormItem label="媒体拍摄时间">
          <Input v-model="editForm.created_time" placeholder="请输入媒体拍摄时间" />
        </FormItem>

        <FormItem label="该飞行架次当前已上传媒体数量">
          <Input v-model="editForm.uploaded_file_count" placeholder="请输入已上传媒体数量" />
        </FormItem>

        <FormItem label="该飞行架次拍摄媒体总数量">
          <Input v-model="editForm.expected_file_count" placeholder="请输入拍摄媒体总数量" />
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
        <FormItem label="飞行ID">
          <Input v-model="createForm.flight_id" placeholder="请输入飞行ID"  />
        </FormItem>

        <FormItem label="设备ID">
          <Input v-model="createForm.device_id" placeholder="请输入设备ID" />
        </FormItem>

        <FormItem label="项目ID">
          <Input v-model="createForm.project_id" placeholder="请输入项目ID" />
        </FormItem>

        <FormItem label="微信用户ID">
          <Input v-model="createForm.wechat_user_id" placeholder="请输入微信用户ID" />
        </FormItem>

        <FormItem label="机场SN">
          <Input v-model="createForm.airport_sn" placeholder="请输入机场SN" />
        </FormItem>

        <FormItem label="拍摄绝对高度">
          <Input v-model="createForm.absolute_altitude" placeholder="请输入拍摄绝对高度" />
        </FormItem>

        <FormItem label="拍摄位置纬度">
          <Input v-model="createForm.shoot_position_lat" placeholder="请输入拍摄位置纬度" />
        </FormItem>

        <FormItem label="拍摄位置经度">
          <Input v-model="createForm.shoot_position_lng" placeholder="请输入拍摄位置经度" />
        </FormItem>

        <FormItem label="文件名称">
          <Input v-model="createForm.file_name" placeholder="请输入文件名称" />
        </FormItem>

        <FormItem label="文件业务路径">
          <Input v-model="createForm.path" placeholder="请输入文件业务路径" />
        </FormItem>

        <FormItem label="媒体拍摄时间">
          <Input v-model="createForm.created_time" placeholder="请输入媒体拍摄时间" />
        </FormItem>

        <FormItem label="该飞行架次当前已上传媒体数量">
          <Input v-model="createForm.uploaded_file_count" placeholder="请输入已上传媒体数量" />
        </FormItem>

        <FormItem label="该飞行架次拍摄媒体总数量">
          <Input v-model="createForm.expected_file_count" placeholder="请输入拍摄媒体总数量" />
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
              label: "飞行ID",
              name: "flight_id",
              type: "input",
              placeholder: "请输入设备ID",
              labelWidth: "80px",
            },
            {
              col: 4,
              label: "机场SN",
              name: "airport_sn",
              type: "input",
              placeholder: "请输入机场SN",
              labelWidth: "80px",
            },
            {
              col: 4,
              label: "项目ID",
              name: "project_id",
              type: "input",
              placeholder: "请输入项目ID",
              labelWidth: "80px",
            },
            {
              col: 4,
              label: "微信用户ID",
              name: "wechat_user_id",
              type: "input",
              placeholder: "请输入微信用户ID",
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
            {
              col: 4,
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
          flight_id: "",
          airport_sn: "",
          project_id: "",
          wechat_user_id: "",
        },
      },
      columns: [
        { title: "ID", key: "id", width: 80 },
        { title: "飞行ID",key: "flight_id", width: 80 },
        { title: "设备ID",key: "device_id", width: 80 },
        { title: "项目ID",key: "project_id", width: 80 },
        { title: "微信用户ID",key: "wechat_user_id", width: 120 },
        { title: "机场SN",key: "airport_sn", width: 120 },
        { title: "拍摄绝对高度",key: "absolute_altitude", width: 120 },
        { title: "拍摄位置纬度",key: "shoot_position_lat", width: 120 },
        { title: "拍摄位置经度",key: "shoot_position_lng", width: 120 },
        { title: "文件名称",key: "file_name", width: 150 },
        { title: "文件业务路径",key: "path", width: 200 },
        { title: "媒体拍摄时间",key: "created_time", width: 150 },
        { title: "该飞行架次当前已上传媒体数量",key: "uploaded_file_count", width: 120 },
        { title: "该飞行架次拍摄媒体总数量",key: "expected_file_count", width: 120 },
        { title: "更新时间",key: "updated_at", width: 150 },
        { title: "创建时间",key: "created_at", width: 150 },
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
        flight_id: "",
        device_id: "",
        project_id: "",
        wechat_user_id: "",
        airport_sn: "",
        absolute_altitude: "",
        shoot_position_lat: "",
        shoot_position_lng: "",
        file_name: "",
        path: "",
        created_time: "",
        uploaded_file_count: "",
        expected_file_count: "",
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        flight_id: "",
        airport_sn: "",
        project_id: "",
        wechat_user_id: "",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        flight_id: v.flight_id,
        airport_sn: v.airport_sn,
        project_id: v.project_id,
        wechat_user_id: v.wechat_user_id,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        flight_id: "",
        airport_sn: "",
        project_id: "",
        wechat_user_id: "",
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
          flight_id: Number(this.createForm.flight_id),
          device_id: Number(this.createForm.device_id),
          project_id: Number(this.createForm.project_id),
          wechat_user_id: Number(this.createForm.wechat_user_id),
          airport_sn: this.createForm.airport_sn,
          absolute_altitude: this.createForm.absolute_altitude,
          shoot_position_lat: this.createForm.shoot_position_lat,
          shoot_position_lng: this.createForm.shoot_position_lng,
          file_name: this.createForm.file_name,
          path: this.createForm.path,
          created_time: this.createForm.created_time,
          uploaded_file_count: this.createForm.uploaded_file_count,
          expected_file_count: this.createForm.expected_file_count,
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
          flight_id: Number(this.editForm.flight_id),
          device_id: Number(this.editForm.device_id),
          project_id: Number(this.editForm.project_id),
          wechat_user_id: Number(this.editForm.wechat_user_id),
          airport_sn: this.editForm.airport_sn,
          absolute_altitude: this.editForm.absolute_altitude,
          shoot_position_lat: this.editForm.shoot_position_lat,
          shoot_position_lng: this.editForm.shoot_position_lng,
          file_name: this.editForm.file_name,
          path: this.editForm.path,
          created_time: this.editForm.created_time,
          uploaded_file_count: this.editForm.uploaded_file_count,
          expected_file_count: this.editForm.expected_file_count,
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
