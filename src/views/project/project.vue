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

        <FormItem label="图片">
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

        <FormItem label="项目名称">
          <Input v-model="editForm.project_name" placeholder="请输入项目名称" />
        </FormItem>
        <FormItem label="地址名称">
          <Input
            v-model="editForm.location_name"
            placeholder="请输入地址名称"
          />
        </FormItem>
        <FormItem label="简介">
          <Input
            type="textarea"
            v-model="editForm.profile"
            placeholder="请输入简介"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></Input>
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
         <FormItem label="图片">
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
        <FormItem label="项目名称">
          <Input v-model="createForm.project_name" placeholder="请输入项目名称" />
        </FormItem>
        <FormItem label="地址名称">
          <Input v-model="createForm.location_name" placeholder="请输入地址名称" />
        </FormItem>
        <FormItem label="简介">
          <Input
            type="textarea"
            v-model="createForm.profile"
            placeholder="请输入简介"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></Input>
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
              placeholder: "请输入ID",
              labelWidth: "120px",
            },
            {
              col: 4,
              label: "项目名称",
              name: "project_name",
              type: "input",
              placeholder: "请输入",
              labelWidth: "100px",
            },
            {
              col: 4,
              label: "地址名称",
              name: "location_name",
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
          project_name: "",
          location_name: "",
        },
      },
      columns: [
        { title: "id", key: "id", width: 60 },
        {
          title: "图片",
          key: "img_url",
          width: 110,
          render: (h, p) => {
            const img = h("img", {
              attrs: {
                src: p.row.img_url,
              },
              style: {
                width: "100px",
                height: "100px",
              },
            });
            return h("viewer", [img]);
          },
        },
        { title: "项目名称", key: "project_name", width: 160 },
        { title: "地址名称", key: "location_name", width: 180 },
        { title: "简介", key: "profile", minWidth: 600 },
        {
          title: "创建时间",
          key: "created_at",
          width: 150,
          render: (h, p) => {
            if (p.row.created_at === "0001-01-01T00:00:00Z") {
              return h("span", "-");
            }
            return h("span", new Date(p.row.created_at).format());
          },
        },
        {
          title: "更新时间",
          key: "updated_at",
          width: 150,
          render: (h, p) => {
            if (p.row.updated_at === "0001-01-01T00:00:00Z") {
              return h("span", "-");
            }
            return h("span", new Date(p.row.updated_at).format());
          },
        },
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
        project_name: "",
        location_name: "",
        profile: "",
      },
      editForm: {},
      searchForm: {
        current: 1,
        page_size: 20,
        id: "",
        project_name: "",
        location_name: "",
      },
    };
  },
  methods: {
    onSearch(v) {
      this.searchForm = {
        current: 1,
        page_size: 20,
        id: v.id,
        project_name: v.project_name,
        location_name: v.location_name,
      };
      this.handleSearch();
    },
    onReset() {
      this.searchForm = {
        current: 1,
        page_size: 20,
        id: "",
        project_name: "",
        location_name: "",
      };
      this.handleSearch();
    },
    async handleSearch() {
      this.loadingTable = true;
      await this.$axios
        .post("/api/v1/project_manage/projects", {
          current: Number(this.searchForm.current),
          page_size: Number(this.searchForm.page_size),
          id: Number(this.searchForm.id),
          project_name: this.searchForm.project_name,
          location_name: this.searchForm.location_name,
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
        .post("/api/v1/project_manage/create_project", {
          id: Number(this.createForm.id),
          project_name: this.createForm.project_name,
          location_name: this.createForm.location_name,
          profile: this.createForm.profile,
          img_url: this.fileList.length > 0 ? this.fileList[0] : "",
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
    async doEdit() {
      this.loadingModal = true;
      await this.$axios
        .post("/api/v1/project_manage/update_project", {
          id: Number(this.editForm.id),
          project_name: this.editForm.project_name,
          location_name: this.editForm.location_name,
          profile: this.editForm.profile,
          img_url: this.fileList.length > 0 ? this.fileList[0] : "",
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
