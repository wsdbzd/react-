<template>
    <Main class="page-exchange">
      <Modal
        class="page-exchange-win"
        v-model="polygonModalVisible"
        :title="polygonTitle"
        @on-ok="handlePolygonOk"
        @on-cancel="polygonModalVisible = false"
        width="600"
      >
        <div v-if="selectedRow" class="modal-content">
          <div class="device-info">
            <p class="info-item">
              <span class="label">设备名称:</span>
              <span class="value">{{ selectedRow.name }}</span>
            </p>
            <p class="info-item">
              <span class="label">设备ID:</span>
              <span class="value">{{ selectedRow.id }}</span>
            </p>
          </div>
          <div class="polygon-form">
            <Form :model="polygonForm" label-position="left" :label-width="100">
              <FormItem label="设备边界数据">
                <Input 
                  v-model="polygonForm.content" 
                  type="textarea" 
                  :rows="4" 
                  placeholder='请输入设备边界坐标，格式："[[x1,y1],[x2,y2],...]"'
                  class="polygon-input"
                />
              </FormItem>
            </Form>
          </div>
        </div>
      </Modal>
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
        v-model="editStatus"
        title="修改"
        @on-ok="doEdit"
        :loading="loadingModal"
      >
        <Form :model="editForm" :label-width="170">
          <FormItem label="设备ID">
            <Input v-model="editForm.id" placeholder="请输入设备ID" disabled />
          </FormItem>
          <FormItem label="设备名称">
            <Input
              v-model="editForm.name"
              placeholder="请输入设备名称"
            />
          </FormItem>
          <FormItem label="机场SN">
            <Input
              v-model="editForm.airport_sn"
              placeholder="请输入机场SN"
            />
          </FormItem>
          <FormItem label="无人机SN">
            <Input
              v-model="editForm.drone_sn"
              placeholder="请输入无人机SN"
            />
          </FormItem>
          <FormItem label="机场摄像头索引">
            <Input
              v-model="editForm.airport_camera_index"
              placeholder="请输入机场摄像头索引"
            />
          </FormItem>
          <FormItem label="机场摄像头索引">
            <Input v-model="editForm.airport_video_index" placeholder="请输入机场摄像头索引" />
          </FormItem>
          <FormItem label="无人机摄像头索引">
            <Input
              v-model="editForm.drone_camera_index"
              placeholder="请输入无人机摄像头索引"
            />
          </FormItem>
          <FormItem label="无人机视频索引">
            <Input
              v-model="editForm.drone_video_index"
              placeholder="请输入无人机视频索引"
            />
          </FormItem>
          <FormItem label="位置ID">
            <Input
              v-model="editForm.location_id"
              placeholder="请输入位置ID"
            />
          </FormItem>
          <FormItem label="摄像头类型">
            <Input
              v-model="editForm.camera_type"
              placeholder="请输入摄像头类型"
            />
          </FormItem>
          <FormItem label="摄像头模式">
            <Input
              v-model="editForm.camera_mode"
              placeholder="请输入摄像头模式"
            />
          </FormItem>
          <FormItem label="录像状态">
            <Input
              v-model="editForm.recording_state"
              placeholder="请输入录像状态"
            />
          </FormItem>
          <FormItem label="飞行状态">
            <Input
              v-model="editForm.flight_status"
              placeholder="请输入飞行状态"
            />
          </FormItem>
          <FormItem label="更新机场信息">
            <Input v-model="editForm.update_dock_info" placeholder="请输入更新机场信息" />
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
          <FormItem label="设备ID">
            <Input v-model="createForm.id" placeholder="请输入设备ID" />
          </FormItem>
          <FormItem label="设备名称">
            <Input
              v-model="createForm.name"
              placeholder="请输入设备名称"
            />
          </FormItem>
          <FormItem label="机场SN">
            <Input
              v-model="createForm.airport_sn"
              placeholder="请输入机场SN"
            />
          </FormItem>
          <FormItem label="无人机SN">
            <Input
              v-model="createForm.drone_sn"
              placeholder="请输入无人机SN"
            />
          </FormItem>
          <FormItem label="机场摄像头索引">
            <Input
              v-model="createForm.airport_camera_index"
              placeholder="请输入机场摄像头索引"
            />
          </FormItem>
          <FormItem label="机场摄像头索引">
            <Input v-model="createForm.airport_video_index" placeholder="请输入机场摄像头索引" />
          </FormItem>
          <FormItem label="无人机摄像头索引">
            <Input
              v-model="createForm.drone_camera_index"
              placeholder="请输入无人机摄像头索引"
            />
          </FormItem>
          <FormItem label="无人机视频索引">
            <Input
              v-model="createForm.drone_video_index"
              placeholder="请输入无人机视频索引"
            />
          </FormItem>
          <FormItem label="位置ID">
            <Input
              v-model="createForm.location_id"
              placeholder="请输入位置ID"
            />
          </FormItem>
          <FormItem label="摄像头类型">
            <Input
              v-model="createForm.camera_type"
              placeholder="请输入摄像头类型"
            />
          </FormItem>
          <FormItem label="摄像头模式">
            <Input
              v-model="createForm.camera_mode"
              placeholder="请输入摄像头模式"
            />
          </FormItem>
          <FormItem label="录像状态">
            <Input
              v-model="createForm.recording_state"
              placeholder="请输入录像状态"
            />
          </FormItem>
          <FormItem label="飞行状态">
            <Input
              v-model="createForm.flight_status"
              placeholder="请输入飞行状态"
            />
          </FormItem>
          <FormItem label="更新机场信息">
            <Input v-model="createForm.update_dock_info" placeholder="请输入更新机场信息" />
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
                name: "id",
                type: "input",
                placeholder: "请输入",
              },
              {
                col: 4,
                label: "机场SN",
                name: "airport_sn",
                type: "input",
                placeholder: "请输入",
              },
              {
                col: 4,
                label: "无人机SN",
                name: "drone_sn",
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
            id: "",
            "airport_sn": "",
            "drone_sn": "",
          },
        },
        columns: [
          { title: "设备ID", key: "id" },
          { title: "设备名称", key: "name" },
          { title: "机场SN", key: "airport_sn" },
          { title: "无人机SN", key: "drone_sn" },
          { title: "机场摄像头索引", key: "airport_camera_index" },
          { title: "机场视频索引", key: "airport_video_index" }, 
          { title: "无人机摄像头索引", key: "drone_camera_index" },
          { title: "无人机视频索引", key: "drone_video_index" },
          { title: "位置ID", key: "location_id" },
          { title: "摄像头类型", key: "camera_type" },
          { title: "摄像头模式", key: "camera_mode" },
          { title: "录像状态", key: "recording_state" },
          { title: "飞行状态", key: "flight_status" },
          { title: "更新机场信息", key: "update_dock_info" },
          { title: "经度", key: "latitude" },
          { title: "纬度", key: "longitude" },
          {
            title: this.$lang("操作"),
            key: "handle",
            align: "right",
            fixed: "right",
            width: 240,
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
                          console.log('params.row:', params.row.name);
                          this.editStatus = true;
                          Object.assign(this.editForm, params.row);
                        },
                      },
                    },
                    this.$lang("编辑")
                  ),
                ]);
              },
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
                        click: async () => {
                          console.log('params.row:', params.row.name);
                          this.selectedRow = params.row;
                          // 查询设备边界数据
                          await this.getDevicePolygon(params.row.id);
                          this.polygonModalVisible = true;
                        },
                      },
                    },
                    "设备边界"
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
        polygonModalVisible: false,
        selectedRow: null,
        polygonForm: {
          content: ''
        },
        createForm: {
          id: "",
          name: "",
          airport_sn: "",
          drone_sn: "",
          airport_camera_index: "",
          airport_video_index: "",
          drone_camera_index: "",
          drone_video_index: "",
          location_id: "",
          camera_type: "",
          camera_mode: "",
          recording_state: "",
          flight_status: "",
          update_dock_info: "",
          latitude: "",
          longitude: "",
        },
        editForm: {
          id: "",
          name: "",
          airport_sn: "",
          drone_sn: "",
          airport_camera_index: "",
          drone_camera_index: "",
          drone_video_index: "",
          airport_video_index: "",
          location_id: "",
          camera_type: "",
          camera_mode: "",
          recording_state: "",
          flight_status: "",
          update_dock_info: "",
          latitude: "",
          longitude: "",
        },
        searchForm: {
          current: 1,
          page_size: 20,
          id: "",
          drone_sn: "",
          airport_sn: "",
        },
        polygonTitle: '设备边界详情',
      };
    },
    methods: {
      // 添加查询设备边界的方法
      async getDevicePolygon(deviceId) {
        try {
          // 每次点击时先清空 content
          this.polygonForm.content = '';
          
          const response = await this.$axios.get(`/api/v1/device_manage/device_polygon/${deviceId}`);
          
          // 只在查询到数据时才处理
          if (response.data && response.data.content) {
            console.log("获取设备边界数据=====：" + response.data.content);
            this.polygonForm.content = JSON.stringify(response.data.content);
          }
        } catch (error) {
          // 如果是404错误，说明没有边界数据，不需要处理
          if (error.response && error.response.status !== 404) {
            console.log(error);
            this.$Message.error('获取设备边界失败：' + error.message);
          }
        }
      },
      onSearch(v) {
        this.searchForm = {
          current: 1,
          page_size: 20,
          id: v.id,
          drone_sn: v.drone_sn,
          airport_sn: v.airport_sn,
        };
        this.handleSearch();
      },
      onReset() {
        this.searchForm = {
          current: 1,
          page_size: 10,
          id: "",
          drone_sn: "",
          airport_sn: "",
        };
        this.handleSearch();
      },
      loadData() {
        this.handleSearch();
      },
      async handleSearch() {
      this.loadingTable = true;
      await this.$axios
        .post("/api/v1/device_manage/devices", {
          current: Number(this.searchForm.current),
          page_size: Number(this.searchForm.page_size),
          id: Number(this.searchForm.id),
          airport_sn: this.searchForm.airport_sn,
          drone_sn: this.searchForm.drone_sn,
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
      async doCreate() {
        this.loadingModal = true;
        await this.$axios
          .post("/api/v1/device_manage/create_device", {
            id: Number(this.createForm.id),
            name: this.createForm.name,
            airport_sn: this.createForm.airport_sn,
            drone_sn: this.createForm.drone_sn,
            airport_camera_index: this.createForm.airport_camera_index,
            airport_video_index: this.createForm.airport_video_index,
            drone_camera_index: this.createForm.drone_camera_index,
            drone_video_index: this.createForm.drone_video_index,
            location_id: Number(this.createForm.location_id),
            camera_type: this.createForm.camera_type,
            camera_mode: Number(this.createForm.camera_mode),
            recording_state: Number(this.createForm.recording_state),
            flight_status: Number(
              this.createForm.flight_status
            ),
            update_dock_info: Number(this.createForm.update_dock_info),
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
          .post("/api/v1/device_manage/update_device", {
            id: Number(this.editForm.id),
            name: this.editForm.name,
            airport_sn: this.editForm.airport_sn,
            drone_sn: this.editForm.drone_sn,
            airport_camera_index: this.editForm.airport_camera_index,
            airport_video_index: this.editForm.airport_video_index,
            drone_camera_index: this.editForm.drone_camera_index,
            drone_video_index: this.editForm.drone_video_index,
            location_id: Number(this.editForm.location_id),
            camera_type: this.editForm.camera_type,
            camera_mode: Number(this.editForm.camera_mode),
            recording_state: Number(this.editForm.recording_state),
            flight_status: Number(
              this.editForm.flight_status
            ),
            update_dock_info: Number(this.editForm.update_dock_info),
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
      handlePolygonOk() {
        if (!this.selectedRow || !this.selectedRow.id) {
          this.$Message.error('请先选择一个设备');
          return;
        }
        try {
          const device_id = this.selectedRow.id;
          console.log("device_id=====：" + device_id);
          const content = JSON.parse(this.polygonForm.content);
          
          // 验证数据格式
          if (typeof content !== 'string') {
            this.$Message.error('边界数据格式不正确，请输入有效的坐标数组');
            return;
          }

          // 更新设备边界数据
          this.$axios.post(`/api/v1/device_manage/update_device_polygon/${device_id}`, {
            device_id: device_id,
            content: content
          })
          .then(response => {
            this.$Message.success('设备边界更新成功');
            this.polygonModalVisible = false;
            this.handleSearch();
          })
          .catch(error => {
            console.error('更新设备边界失败:', error);
            this.$Message.error('更新设备边界失败: ' + error.message);
          });
        } catch (error) {
          this.$Message.error('边界数据格式不正确，请检查输入');
        }
      },
    },
    mounted() {
      this.handleSearch();
    },
  };
  </script>
  <style lang="less" scoped>
  .modal-content {
    padding: 20px;
    
    .device-info {
      margin-bottom: 20px;
      
      .info-item {
        margin-bottom: 10px;
        font-size: 14px;
        
        .label {
          color: #666;
          min-width: 80px;
          display: inline-block;
        }
        
        .value {
          color: #333;
        }
      }
    }
    
    .polygon-form {
      .polygon-input {
        width: 100%;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        padding: 8px;
        font-family: monospace;
        background-color: #f8f9fa;
      }
    }
  }
  </style>