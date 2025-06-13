<template lang="pug">
    Main.page-exchange
        tables(ref="tables", editable, searchable, :loading="loadingTable",v-model="tableData", :columns="columns",
            :searchOptions="searchOptions", @on-search="handleSearch"
            :deleteable="false"
             @on-add-row="handleAddRow" )

        // 新增
        Modal.page-exchange-win(v-model="creatWinStatus", , :title="$lang(nextType =='create' ? '新增':'修改')" @on-ok="doNext" :loading="loading")
            Form(:model='createForm', :label-width='70')
                FormItem(:label='$lang("用户姓名")')
                    Input(v-model='createForm.username', , :placeholder="$lang('请输入',$lang('用户姓名'))" , )
                FormItem(:label='$lang("登录密码")')
                    Input(v-model='createForm.password', , :placeholder="$lang('请输入',$lang('密码包含至少一位数字，大小字母和特殊字符,且长度8-20位'))", )
                FormItem(:label='$lang("关联角色")')
                    CheckboxGroup(v-model="createForm.role_ids")
                        Checkbox(:label="item.id" v-for="item in allRoles" :key="item.id") {{item.name}}
    </template>
    
<script>
import Tables from "@/components/tables";
import { resolveComponent } from "vue";
export default {
  name: "Asset_tables",
  components: {
    Tables,
  },
  data() {
    return {
      loading: true,
      loadingTable: true,
      total: 0,
      requestDataForm: {
        current: 1,
        page_size: 20,
      },
      allRoles: [],
      columns: [
        { title: this.$lang("ID"), key: "id", width: 80 },
        {
          title: this.$lang("创建时间"),
          key: "created_at",
          render: (h, p) => {
            return h("span", new Date(p.row.created_at).format());
          },
        },
        { title: this.$lang("用户姓名"), key: "username" },
        {
          title: this.$lang("启/禁用"),
          key: "enable",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("i-switch", {
                size: "small",
                props: {
                  type: "primary",
                  value: params.row.enable === 1,
                },
                on:{
                    'on-change':(value)=>{
                      this.updateEnable(params.row.id,value ? 1 : 2,params.row.role_ids)
                    }
                }
              }),
            ]);
          },
        },
        {
          title: this.$lang("操作"),
          key: "handle",
          align: "right",
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
                        this.creatWinStatus = true;
                        this.nextType = "edit";
                        Object.assign(this.createForm, params.row);
                        this.getDetail(params.row.id);
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
      tableData: [],
      searchOptions: ["username"],
      selectDataStore: [],
      creatWinStatus: false,
      detialWinSatus: false,
      // create创建 / edit修改
      nextType: "",
      createForm: {
        username: "",
        password: "",
        role_ids: [],
      },
      editForm: {
        id: "",
        username: "",
        password: "",
        role_ids: [],
      },
      deleteForm: {
        ids: [],
      },
    };
  },
  methods: {
    loadData() {
      (this.createForm = {
        username: "",
        password: "",
        role_ids: [],
      }),
        (this.editForm = {
          id: "",
          username: "",
          password: "",
          role_ids: [],
        }),
        (this.loadingTable = true);
      this.$axios
        .get("/api/v1/users", { params: this.requestDataForm })
        .then((result) => {
          this.loadingTable = false;
          this.loading = false;
          setTimeout(() => {
            this.loading = true;
          }, 200);
          if (result.code === 10000) {
            this.tableData = result.data ? result.data : [];
            this.total = result.total;
          }
        });
      this.getRoles();
    },
    getRoles() {
      this.$axios.get("/api/v1/roles").then((result) => {
        this.loadingTable = false;
        this.loading = false;
        setTimeout(() => {
          this.loading = true;
        }, 200);
        if (result.code === 10000) {
          this.allRoles = result.data ? result.data : [];
          this.total = result.total;
        }
      });
    },
    getDetail(id) {
      this.createForm = {
        id: id,
        username: "",
        password: "",
        role_ids: [],
      };

      this.$axios
        .get("/api/v1/user_detail", { params: { id } })
        .then((result) => {
          this.loadingTable = false;
          this.loading = false;
          setTimeout(() => {
            this.loading = true;
          }, 200);
          if (result.code === 10000) {
            let data = result.data ? result.data : [];
            this.createForm.role_ids = data.role_ids ? data.role_ids : [];
            this.createForm.username = data.name;
            this.total = result.total;
          }
        });
    },
    handleSearch(searchKey, searchValue) {
      //this.loadingTable = true;
      if (searchKey === "username") {
        this.requestDataForm.username = searchValue;
      }

      this.requestDataForm.current = 1;
      this.$axios
        .get("/api/v1/users", { params: this.requestDataForm })
        .then((result) => {
          this.loadingTable = false;
          this.loading = false;
          setTimeout(() => {
            this.loading = true;
          }, 200);
          if (result.code === 10000) {
            this.tableData = result.data ? result.data : [];

            this.total = result.total;
          }
        });
    },
    handleAddRow() {
      this.createForm = {
        username: "",
        password: "",
        role_ids: [],
      };
      this.creatWinStatus = true;
      this.nextType = "create";
    },
    create() {
      this.creatWinStatus = true;
      this.nextType = "create";
    },
    updateEnable(id,enable,role_ids){
        this.$axios
        .get("/api/v1/user_detail", { params: { id } })
        .then((result) => {
          this.loading = false;
          setTimeout(() => {
            this.loading = true;
          }, 200);
          if (result.code === 10000) {
        let role_ids = result.data.role_ids ? result.data.role_ids : [];
        this.$axios.put("/api/v1/update_user",{id,enable,role_ids}).then((result) => {
        this.loading = false;
        setTimeout(() => {
          this.loading = true;
        }, 200);

        if (result.code == 10000) {
          this.$Notice.success({
            title: this.$lang("修改成功"),
            duration: 2,
          });
        } else {
          this.$Notice.error({
            title: this.$lang("修改失败"),
            duration: 2,
          });
        }
        this.loadData();
      });
    }
        });
    },
    saveEdit(id, username, password, role_ids) {
      this.editForm.id = Number(id);
      this.editForm.username = username;
      this.editForm.password = password;
      this.editForm.role_ids = role_ids;
      this.$axios.put("/api/v1/update_user", this.editForm).then((result) => {
        this.loading = false;
        setTimeout(() => {
          this.loading = true;
        }, 200);

        if (result.code == 10000) {
          this.$Notice.success({
            title: this.$lang("修改成功"),
            duration: 2,
          });
          this.creatWinStatus = false;
          if (result.msg == "password error") {
            this.$Notice.success({
              title: this.$lang(
                "密码包含至少一位数字，字母和特殊字符,且长度8-20位"
              ),
              duration: 2,
            });
          }
        } else {
          this.$Notice.error({
            title: this.$lang("修改失败"),
            duration: 2,
          });
          this.creatWinStatus = false;
        }
        this.loadData();
      });
    },
    doNext() {
      if (this.nextType == "create") {
        this.$axios
          .post("/api/v1/create_user", this.createForm)
          .then((result) => {
            this.loading = false;
            setTimeout(() => {
              this.loading = true;
            }, 200);

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
      } else {
        this.saveEdit(
          this.createForm.id,
          this.createForm.username,
          this.createForm.password,
          this.createForm.role_ids
        );
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>
    
<style lang="less" scoped>
/* .ivu-modal-content{
        width: 600px !important;
    } */
</style>
