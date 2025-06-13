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

        <FormItem label="openID">
          <Input v-model="editForm.open_id" placeholder="请输入openID" disabled />
        </FormItem>

        <FormItem label="用户名">
          <Input v-model="editForm.nick_name" placeholder="请输入用户名" disabled />
        </FormItem>

        <FormItem label="开启/关闭">
          <Input v-model="editForm.enable" placeholder="请输入开启/关闭" />
        </FormItem>

        <FormItem label="是否白名单">
          <Input v-model="editForm.is_white_list" placeholder="请输入是否白名单" />
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
        <FormItem label="openID">
          <Input v-model="createForm.open_id" placeholder="请输入openID"  />
        </FormItem>

        <FormItem label="头像">
          <el-upload
            class="avatar-uploader"
            drag
            action="#"
            :http-request="customUpload"
            :show-file-list="true"
            :on-success="updateUrluccess"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
            :file-list="fileList"
            :limit="limit"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过1MB
            </div>
          </el-upload>
        </FormItem>

        <FormItem label="用户名">
          <Input v-model="createForm.nick_name" placeholder="请输入用户名" />
        </FormItem>

        <FormItem label="开启/关闭">
          <Input v-model="createForm.enable" placeholder="请输入开启/关闭" />
        </FormItem>

        <FormItem label="是否白名单">
          <Input v-model="createForm.is_white_list" placeholder="请输入是否白名单" />
        </FormItem>
      </Form>
    </Modal>

  </Main>
</template>
<script>
import Tables from "@/components/tables";
import UserForm from "@/components/user/userForm.vue";
import en from "../../locale/en";

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
              name: "nick_name",
              type: "input",
              placeholder: "请输入设备ID",
              labelWidth: "100px",
            },
            {
              col: 4,
              label: "openID",
              name: "open_id",
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
          nick_name: "",
          open_id: "",
        },
      },
      columns: [
        { title: "ID", key: "id" },
        { title: "openID",key: "open_id" },
        {
          title: "头像",
          key: "avatar_url",
          width: 110,
          render: (h, p) => {
            const img = h("img", {
              attrs: {
                src: p.row.avatar_url,
              },
              style: {
                width: "100px",
                height: "100px",
              },
            });
            return h("viewer", [img]);
          },
        },
        { title: "用户名", key: "nick_name" },
        { title: "开启/关闭", key: "enable" },
        { title: "是否白名单", key: "is_white_list" },
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
        open_id: "",
        nick_name: "",
        enable: "",
        is_white_list: "",
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        nick_name: "",
        open_id: "",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        username: v.username,
        open_id: v.open_id,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        username: "",
        open_id: "",
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
          open_id: this.createForm.open_id,
          avatar_url: this.fileList.length > 0 ? this.fileList[0] : "",
          nick_name: this.createForm.nick_name,
          enable: this.createForm.enable,
          is_white_list: this.createForm.is_white_list,
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
          enable: Number(this.editForm.enable),
          is_white_list: this.editForm.is_white_list,
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
    async customUpload(file) {
      try {
        const result = await this.$axios.get("/api/v1/file/get_file_token");
        if (result.code !== 10000) {
          throw new Error("获取上传地址失败");
          return;
        }
        const data = JSON.parse(result.data);
        const flieName = "wechat/project/" + new Date().getTime() + ".jpg";
        let formData = new FormData();
        formData.append("success_action_status", "200");
        formData.append("policy", data.policy);
        formData.append("x-oss-signature", data.signature);
        formData.append("x-oss-signature-version", "OSS4-HMAC-SHA256");
        formData.append("x-oss-credential", data.x_oss_credential);
        formData.append("x-oss-date", data.x_oss_date);
        formData.append("key", flieName); // 文件名
        formData.append("x-oss-security-token", data.security_token);
        formData.append("file", file.file); // file 必须为最后一个表单域

        // 2. 发送上传请求
        const response = await fetch(data.host, {
          method: "POST",
          body: formData,
        });

        console.log("上传响应:", response);
        if (!response.ok) {
          throw new Error("上传失败，状态码: " + response.status);
        }
        // 3. 上传成功处理
        this.$message.success("上传成功!");
        return `${this.domain}${flieName}`;
      } catch (error) {
        this.$message.error("上传失败: " + error.message);
      }
    },
    beforeUpload(file) {
      const fileType = file.name;
      if (
        fileType.indexOf(".jpg") != -1 ||
        fileType.indexOf(".png") != -1 ||
        fileType.indexOf(".jpeg") != -1
      ) {
        if (file.size / 1024 / 1024 > 1) {
          this.$message.error("上传图片大小不能超过1MB");
          return false;
        }
        return true;
      } else {
        return false;
      }
    },
    updateUrluccess(url) {
      this.fileList.push(url);

      console.log("上传成功", url);
    },
    onRemove(res, file) {
      this.fileList.pop();
    },
  },
  mounted() {
    this.handleSearch();
  },
};
</script>
<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
