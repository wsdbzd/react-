<template lang="pug">
    Main.page-exchange
        UserForm(:formData="formData" @onSearch="onSearch" @onReset="onReset")
        Table.user-table(:columns="columns", :data="listData", :loading="loadingTable" @on-selection-change="selectChange"  @on-select-all="selectItemAll" @on-select="selectItem"  @on-select-cancel="cancelItem")
        .page-pages(v-if="total>searchForm.page_size")
            Page(:current.sync="searchForm.current", :total="total", :pageSize="searchForm.page_size" @on-change="loadData")
    </template>
<script>
import UserForm from "@/components/user/userForm.vue";

export default {
    components: {
        UserForm,
    },
    data() {
        return {
            loading: true,
            loadingTable: true,
            total: 0,
            // 搜索关键字，包含非数字的字符串，处理为交易所简称
            searchKeyword: "",
            searchForm: {
                current: 1,
                page_size: 20,
            },
            listData: [],
            creatWinStatus: false,
            detialWinSatus: false,
            // create创建 / edit修改
            nextType: "",
            // 创建/修改/查看共用
            createForm: {
                org_id: "",
                token_id: "",
                total: "",
                locked: "",
                available: ""
            },
            // enable开启 / disable关闭
            settingsType: "",
            settingsDepositStatus: false,
            settingsNotifyStatus: false,
            settingsWithdrawalStatus: false,
            settingsTokenStatus: false,
            settingsForm: {
                id: "",
                remark: "",
            },
            selectDataStore: [],
            deleteForm: {
                token_ids: [],
            },
            formData: {
                contents: [
                    [
                        {
                            col: 4,
                            label: "用户名",
                            name: "user_name",
                            type: "input",
                            placeholder: "请输入用户名",
                        },
                        {
                            col: 4,
                            label: "角色名",
                            name: "role_name",
                            type: "input",
                            placeholder: "请输入角色名",
                        },
                        {
                            col: 4,
                            label: "客户端IP",
                            name: "client_ip",
                            type: "input",
                            placeholder: "请输入客户端IP",
                        }, {
                            col: 4,
                            label: "币种ID",
                            name: "token_id",
                            type: "input",
                            placeholder: "请输入币种ID",
                        }, {
                            col: 4,
                            label: "请求方法",
                            name: "method",
                            type: "select",
                            options: [
                                {
                                    label: "POST",
                                    value: "POST",
                                },
                                {
                                    label: "GET",
                                    value: "GET",
                                },
                                {
                                    label: "PUT",
                                    value: "PUT",
                                },
                            ],
                            placeholder: "请输入请求方式",
                        }, {
                            col: 4,
                            label: "请求路径",
                            name: "path",
                            type: "input",
                            placeholder: "请输入请求路径",
                        }, {
                            col: 4,
                            label: "用户代理",
                            name: "user_agent",
                            type: "input",
                            placeholder: "请输入用户代理",
                        }, {
                            col: 4,
                            label: "Canvas指纹hash",
                            name: "canvas_hash",
                            type: "input",
                            placeholder: "请输入Canvas指纹hash",
                        }, {
                            col: 4,
                            label: "硬件平台",
                            name: "platform",
                            type: "input",
                            placeholder: "请输入硬件平台",
                        }, {
                            col: 4,
                            label: "屏幕分辨率",
                            name: "screen_resolution",
                            type: "input",
                            placeholder: "请输入屏幕分辨率",
                        }, {
                            col: 4,
                            label: "WebGL指纹",
                            name: "webgl_vendor_and_renderer",
                            type: "input",
                            placeholder: "请输入WebGL指纹",
                        },
                        {
                            col: 4,
                            label: "时区",
                            name: "time_zone",
                            type: "input",
                            placeholder: "请输入时区",
                        },
                        {
                            col: 24,
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
                            align: "end",
                        },
                    ],
                ],
                labelWidth: "120px",
                data: {
                    user_name: "",
                    role_name: "",
                    client_ip: "",
                    method: "",
                    path: "",
                    user_agent: "",
                    canvas_hash: "",
                    platform: "",
                    screen_resolution: "",
                    webgl_vendor_and_renderer: "",
                    time_zone: "",

                },
            },
            columns: [
                {
                    title: this.$lang("用户名"),
                    key: "user_name",
                },
                {
                    title: this.$lang("角色名"),
                    key: "role_name",
                },
                {
                    title: this.$lang("客户端IP"),
                    key: "client_ip",
                },
                {
                    title: this.$lang("请求方法"),
                    key: "method",
                },
                {
                    title: this.$lang("请求路径"),
                    key: "path",
                },
                {
                    title: this.$lang("用户代理"),
                    key: "user_agent",
                    width: 200,
                },
                {
                    title: this.$lang("浏览器指纹hash"),
                    key: "fingerprint_hash",
                },
                {
                    title: this.$lang("Canvas指纹hash"),
                    key: "canvas_hash",
                },
                {
                    title: this.$lang("硬件平台"),
                    key: "platform",
                },
                {
                    title: this.$lang("屏幕分辨率"),
                    key: "screen_resolution",
                },
                {
                    title: this.$lang("WebGL指纹"),
                    key: "webgl_vendor_and_renderer",
                    width: 200,
                },
                {
                    title: this.$lang("时区"),
                    key: "time_zone",
                },
                {
                    title: this.$lang("操作"),
                    width: 140,
                    fixed: "right",
                    key: "handle",
                    align: "left",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small",
                                    },
                                    style: {
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: () => {
                                            this.detialWinSatus = true;
                                            Object.assign(this.createForm, params.row);
                                        },
                                    },
                                },
                                this.$lang("查看")
                            )
                        ]);
                    },
                },
            ],
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loadingTable = true;
            this.$axios
                .get("/api/v1/admin_log", { params: this.searchForm })
                .then((result) => {
                    this.loadingTable = false;
                    if (result.code === 10000) {
                        this.listData = result.data ? result.data : [];
                        this.total = result.total;
                    }
                });
        },
        create() {
            Object.keys(this.createForm).forEach((el) => (this.createForm[el] = ""));
            this.creatWinStatus = true;
            this.nextType = "create";
        },
        selectItemAll(selection) {
            // this.$Message.info('selectItemAll ok');
            this.selectDataStore = [];
            this.selectDataStore = this.selectDataStore.concat(selection);
        },
        selectItem(selection, row) {
            //this.$Message.info('selectItem ok');
            this.selectDataStore.push(row);
        },
        cancelItem(selection, row) {
            //this.$Message.info('cancelItem ok');
            this.selectDataStore.forEach((item, index) => {
                if (item.id === row.id) {
                    //ID，所以拿来做判断条件
                    this.selectDataStore.splice(index, 1);
                }
            });
        },
        selectChange(selection) {
            // this.$Message.info('selectChange ok');
            if (!selection.length) {
                let arr1 = this.selectDataStore;
                let arr2 = this.tableData;
                for (let i = 0; i < arr1.length; i++) {
                    for (let j = 0; j < arr2.length; j++) {
                        if (arr1[i].id === arr2[j].id) {
                            this.selectDataStore.splice(i, 1);
                        }
                    }
                }
            }
        },
        onSearch(value) {
            this.searchForm.current = 1
            this.searchForm.org_id = value.org_id
            this.searchForm.token_id = value.token_id
            this.searchForm.user_name = value.user_name
            this.searchForm.role_name = value.role_name
            this.searchForm.client_ip = value.client_ip
            this.searchForm.method = value.method
            this.searchForm.path = value.path
            this.searchForm.user_agent = value.user_agent
            this.searchForm.canvas_hash = value.canvas_hash
            this.searchForm.platform = value.platform
            this.searchForm.screen_resolution = value.screen_resolution
            this.searchForm.webgl_vendor_and_renderer = value.webgl_vendor_and_renderer
            this.searchForm.time_zone = value.time_zone

            this.loadData();
        },
        onReset() {
            this.searchForm = {
                current: 1,
                page_size: 20,
                user_name: "",
                role_name: "",
                client_ip: "",
                method: "",
                path: "",
                user_agent: "",
                canvas_hash: "",
                platform: "",
                screen_resolution: "",
                webgl_vendor_and_renderer: "",
                time_zone: "",
            };
            this.loadData();
        },
    },
};
</script>
    