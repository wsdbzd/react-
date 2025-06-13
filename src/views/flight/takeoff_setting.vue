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
        @on-change="loadData"
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
          <Input v-model="editForm.id" placeholder="请输入ID" disabled />
        </FormItem>
        <FormItem label="设备ID">
          <Input v-model="editForm.device_id" placeholder="请输入设备ID" />
        </FormItem>
        <FormItem label="目标高度">
          <Input
            v-model="editForm.target_height"
            placeholder="请输入目标高度"
          />
        </FormItem>
        <FormItem label="目标纬度">
          <Input
            v-model="editForm.target_latitude"
            placeholder="请输入目标纬度"
          />
        </FormItem>
        <FormItem label="目标经度">
          <Input
            v-model="editForm.target_longitude"
            placeholder="请输入目标经度"
          />
        </FormItem>
        <FormItem label="安全起飞高度">
          <Input
            v-model="editForm.security_takeoff_height"
            placeholder="请输入安全起飞高度"
          />
        </FormItem>
        <FormItem label="返航模式">
          <Input v-model="editForm.rth_mode" placeholder="请输入返航模式" />
        </FormItem>
        <FormItem label="返航高度">
          <Input v-model="editForm.rth_altitude" placeholder="请输入返航高度" />
        </FormItem>
        <FormItem label="遥控器失控动作">
          <Input
            v-model="editForm.rc_lost_action"
            placeholder="请输入遥控器失控动作"
          />
        </FormItem>
        <FormItem label="指点飞行失控动作">
          <Input
            v-model="editForm.commander_mode_lost_action"
            placeholder="请输入指点飞行失控动作"
          />
        </FormItem>
        <FormItem label="指点飞行模式设置值">
          <Input
            v-model="editForm.commander_flight_mode"
            placeholder="请输入指点飞行模式设置值"
          />
        </FormItem>
        <FormItem label="指点飞行高度">
          <Input
            v-model="editForm.commander_flight_height"
            placeholder="请输入指点飞行高度"
          />
        </FormItem>
        <FormItem label="一键起飞最大速度">
          <Input
            v-model="editForm.max_speed"
            placeholder="请输入一键起飞最大速度"
          />
        </FormItem>
        <FormItem label="飞行安全预检查">
          <Input
            v-model="editForm.flight_safety_advance_check"
            placeholder="请输入飞行安全预检查"
          />
        </FormItem>
        <FormItem label="纬度">
          <Input v-model="editForm.latitude" placeholder="请输入纬度" />
        </FormItem>
        <FormItem label="经度">
          <Input v-model="editForm.longitude" placeholder="请输入经度" />
        </FormItem>
      </Form>
    </Modal>

    <Modal
      class="page-exchange-win"
      v-model="createStatus"
      title="新增"
      @on-ok="doCreate"
      :loading="loadingModal"
    >
      <Form :model="createForm" :label-width="170">
        <FormItem label="ID">
          <Input v-model="editForm.id" placeholder="请输入ID" />
        </FormItem>
        <FormItem label="设备ID">
          <Input v-model="createForm.device_id" placeholder="请输入设备ID" />
        </FormItem>
        <FormItem label="目标高度">
          <Input
            v-model="createForm.target_height"
            placeholder="请输入目标高度"
          />
        </FormItem>
        <FormItem label="目标纬度">
          <Input
            v-model="createForm.target_latitude"
            placeholder="请输入目标纬度"
          />
        </FormItem>
        <FormItem label="目标经度">
          <Input
            v-model="createForm.target_longitude"
            placeholder="请输入目标经度"
          />
        </FormItem>
        <FormItem label="安全起飞高度">
          <Input
            v-model="createForm.security_takeoff_height"
            placeholder="请输入安全起飞高度"
          />
        </FormItem>
        <FormItem label="返航模式">
          <Input v-model="createForm.rth_mode" placeholder="请输入返航模式" />
        </FormItem>
        <FormItem label="返航高度">
          <Input
            v-model="createForm.rth_altitude"
            placeholder="请输入返航高度"
          />
        </FormItem>
        <FormItem label="遥控器失控动作">
          <Input
            v-model="createForm.rc_lost_action"
            placeholder="请输入遥控器失控动作"
          />
        </FormItem>
        <FormItem label="指点飞行失控动作">
          <Input
            v-model="createForm.commander_mode_lost_action"
            placeholder="请输入指点飞行失控动作"
          />
        </FormItem>
        <FormItem label="指点飞行模式设置值">
          <Input
            v-model="createForm.commander_flight_mode"
            placeholder="请输入指点飞行模式设置值"
          />
        </FormItem>
        <FormItem label="指点飞行高度">
          <Input
            v-model="createForm.commander_flight_height"
            placeholder="请输入指点飞行高度"
          />
        </FormItem>
        <FormItem label="一键起飞最大速度">
          <Input
            v-model="createForm.max_speed"
            placeholder="请输入一键起飞最大速度"
          />
        </FormItem>
        <FormItem label="飞行安全预检查">
          <Input
            v-model="createForm.flight_safety_advance_check"
            placeholder="请输入飞行安全预检查"
          />
        </FormItem>
        <FormItem label="纬度">
          <Input v-model="createForm.latitude" placeholder="请输入纬度" />
        </FormItem>
        <FormItem label="经度">
          <Input v-model="createForm.longitude" placeholder="请输入经度" />
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
              label: "设备ID",
              name: "device_id",
              type: "input",
              placeholder: "请输入设备ID",
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
              col: 16,
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
        },
      },
      columns: [
        { title: "id", key: "id" },
        { title: "设备ID", key: "device_id" },
        { title: "目标高度", key: "target_height" },
        { title: "目标纬度", key: "target_latitude" },
        { title: "目标经度", key: "target_longitude" },
        { title: "安全起飞高度", key: "security_takeoff_height" },
        { title: "返航模式", key: "rth_mode" },
        { title: "返航高度", key: "rth_altitude" },
        { title: "遥控器失控动作", key: "rc_lost_action" },
        { title: "指点飞行失控动作", key: "commander_mode_lost_action" },
        { title: "指点飞行模式设置值", key: "commander_flight_mode" },
        { title: "指点飞行高度", key: "commander_flight_height" },
        { title: "一键起飞最大速度", key: "max_speed" },
        { title: "飞行安全预检查", key: "flight_safety_advance_check" },
        { title: "纬度", key: "latitude" },
        { title: "经度", key: "longitude" },
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
      createStatus: false,
      createForm: {
        id: "",
        device_id: "",
        target_height: "",
        target_latitude: "",
        target_longitude: "",
        security_takeoff_height: "",
        rth_mode: "",
        rth_altitude: "",
        rc_lost_action: "",
        commander_mode_lost_action: "",
        commander_flight_mode: "",
        commander_flight_height: "",
        max_speed: "",
        flight_safety_advance_check: "",
        latitude: "",
        longitude: "",
      },
      editForm: {
        id: "",
        device_id: "",
        target_height: "",
        target_latitude: "",
        target_longitude: "",
        security_takeoff_height: "",
        rth_mode: "",
        rth_altitude: "",
        rc_lost_action: "",
        commander_mode_lost_action: "",
        commander_flight_mode: "",
        commander_flight_height: "",
        max_speed: "",
        flight_safety_advance_check: "",
        latitude: "",
        longitude: "",
      },
      searchForm: {
        current: 1,
        page_size: 10,
        device_id: "",
      },
    };
  },
  methods: {
    async handleSearch() {
      this.loadingTable = true;
      await this.$axios
        .get("/api/v1/flight_manage/takeoff_setting", {
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
    onSearch(value) {
      this.searchForm.current = 1;
      this.searchForm.device_id = Number(value.device_id);
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 10,
        device_id: "",
      };
      this.handleSearch();
    },
    loadData() {
      this.handleSearch();
    },
    async doCreate() {
      this.loadingModal = true;
      await this.$axios
        .post("/api/v1/flight_manage/create_takeoff_setting", {
          device_id: Number(this.createForm.device_id),
          target_height: Number(this.createForm.target_height),
          target_latitude: this.createForm.target_latitude,
          target_longitude: this.createForm.target_longitude,
          security_takeoff_height: Number(
            this.createForm.security_takeoff_height
          ),
          rth_mode: Number(this.createForm.rth_mode),
          rth_altitude: Number(this.createForm.rth_altitude),
          rc_lost_action: Number(this.createForm.rc_lost_action),
          commander_mode_lost_action: Number(
            this.createForm.commander_mode_lost_action
          ),
          commander_flight_mode: Number(this.createForm.commander_flight_mode),
          commander_flight_height: Number(
            this.createForm.commander_flight_height
          ),
          max_speed: Number(this.createForm.max_speed),
          flight_safety_advance_check: Number(
            this.createForm.flight_safety_advance_check
          ),
          latitude: this.createForm.latitude,
          longitude: this.createForm.longitude,
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
          this.loadData();
        });
      this.loadingModal = false;
    },
    async doEdit() {
      this.loadingModal = true;

      await this.$axios
        .post("/api/v1/flight_manage/update_takeoff_setting", {
          id: this.editForm.id,
          device_id: Number(this.editForm.device_id),
          target_height: Number(this.editForm.target_height),
          target_latitude: this.editForm.target_latitude,
          target_longitude: this.editForm.target_longitude,
          security_takeoff_height: Number(
            this.editForm.security_takeoff_height
          ),
          rth_mode: Number(this.editForm.rth_mode),
          rth_altitude: Number(this.editForm.rth_altitude),
          rc_lost_action: Number(this.editForm.rc_lost_action),
          commander_mode_lost_action: Number(
            this.editForm.commander_mode_lost_action
          ),
          commander_flight_mode: Number(this.editForm.commander_flight_mode),
          commander_flight_height: Number(
            this.editForm.commander_flight_height
          ),
          max_speed: Number(this.editForm.max_speed),
          flight_safety_advance_check: Number(
            this.editForm.flight_safety_advance_check
          ),
          latitude: this.editForm.latitude,
          longitude: this.editForm.longitude,
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
