<template lang="pug">
    Main.page-exchange
        tables(ref="tables", editable, searchable, :loading="loadingTable",v-model="tableData", :columns="columns",
            :searchOptions="searchOptions", @on-search="handleSearch" 
                :deleteable="false"
                    @on-add-row="handleAddRow" )

        // 新增
        Modal.page-exchange-win(v-model="creatWinStatus",width="800",:title="$lang(nextType =='create' ? '新增':'修改')" @on-ok="doNext" :loading="loading")
            Form(:model='createForm', :label-width='100')
                FormItem(:label='$lang("角色名称")')
                    Input(v-model='createForm.name', , :placeholder="$lang('请输入',$lang('角色名称'))" )
                FormItem(:label='$lang("权限系统")')
                    MenuCheckbox( v-model="createForm.menuData" )
                FormItem(:label='$lang("关联用户")')
                    CheckboxGroup(v-model="createForm.userData")
                        Checkbox(:label="item.id" v-for="item in allUsers" :key="item.id") {{item.username}}
    </template>
    
<script>
import Tables from "@/components/tables";
import MenuCheckbox from "./menu_checkbox.vue";
export default {
    name: "Asset_tables",
    components: {
        Tables,
        MenuCheckbox,
    },
    data() {
        return {
            loading: true,
            loadingTable: true,
            total: 0,
            allUsers: [],
            requestDataForm: {
                current: 1,
                page_size: 20,
            },
            columns: [
                { title: this.$lang("ID"), key: "id", maxWidth: 100 },
                {
                    title: this.$lang("创建时间"),
                    key: "created_at",
                    render: (h, p) => {
                        return h("span", new Date(p.row.created_at).format());
                    },
                },
                { title: this.$lang("角色名称"), key: "name" },
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
                                                this.createForm.id = params.row.id;
                                                this.getDetail();
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
            searchOptions: ["name"],
            selectDataStore: [],
            creatWinStatus: false,
            detialWinSatus: false,
            // create创建 / edit修改
            nextType: "",
            createForm: {
                name: "",
                menuData: [],
                userData: [],
            },
            deleteForm: {
                ids: [],
            },
        };
    },
    methods: {
        loadData() {
            this.createForm = {
                name: "",
                menuData: [],
                userData: [],
            }
            this.loadingTable = true
            this.$axios
                .get("/api/v1/roles", { params: this.requestDataForm })
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

            this.$axios
                .get("/api/v1/users")
                .then((result) => {
                    this.loadingTable = false;
                    this.loading = false;
                    setTimeout(() => {
                        this.loading = true;
                    }, 200);
                    if (result.code === 10000) {
                        this.allUsers = result.data ? result.data : [];
                        this.total = result.total;
                    }
                });
        },
        handleSearch(searchKey, searchValue) {
            //this.loadingTable = true;
            if (searchKey === "name") {
                this.requestDataForm.name = searchValue;
            }

            this.requestDataForm.current = 1;
            this.$axios
                .get("/api/v1/roles", { params: this.requestDataForm })
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
            this.creatWinStatus = true;
            this.nextType = "create";
            this.createForm = {
                name: "",
                menuData: [],
                userData: [],
            }
        },
        create() {
            this.createForm = {
                name: "",
                menuData: [],
                userData: [],
            }
            this.creatWinStatus = true;
            this.nextType = "create";
        },
        getDetail() {
            this.createForm.menuData = []
            this.createForm.userData = []
            this.createForm.name = ""
                this.$axios
                    .get("/api/v1/role_detail", { params: { id: this.createForm.id } })
                    .then((result) => {
                        this.loadingTable = false;
                        this.loading = false;
                        setTimeout(() => {
                            this.loading = true;
                        }, 200);
                        if (result.code === 10000) {
                            let data = result.data ? result.data : [];
                            this.createForm.name = data.name;
                            this.createForm.menuData = data.auth_ids ? data.auth_ids : [];
                            this.createForm.userData = data.user_ids ? data.user_ids : [];

                            this.total = result.total;
                        }
                    });
        },
        saveEdit() {
            var params = {
                id: this.createForm.id,
                name: this.createForm.name,
                auth_ids: this.createForm.menuData.map((v) => Number(v)),
                user_ids: this.createForm.userData.map((v) => Number(v)),
            }
            this.$axios.put("/api/v1/update_role", params).then((result) => {
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

                this.createForm = {
                    name: this.createForm.name,
                    auth_ids: this.createForm.menuData.map((v) => Number(v)),
                    user_ids: this.createForm.userData.map((v) => Number(v)),
                    enable: 1,
                };
                this.$axios
                    .post("/api/v1/create_role", this.createForm)
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
                this.saveEdit();
            }
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>
    
<style lang="less" scoped>
.ivu-modal {
    width: 600px !important;
}
</style>
