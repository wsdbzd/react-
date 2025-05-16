import {
  Button,
  Form,
  Input,
  Table,
  Popconfirm,
  Modal,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import "./index.scss";
import { getUser, addUser, editUser, delUser } from "../../api";

const User = () => {
  const [listData, setlistData] = useState({
    name: "",
  });
  const [tableData, setTableData] = useState([]);
  // 0代表新增，1代表编辑
  const [modalType, setModalType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleClick = (type, rowData) => {
    setIsModalOpen(!isModalOpen);
    if (type === "add") setModalType(0);
    else if (type === "edit") {
      setModalType(1);
      const cloneData = JSON.parse(JSON.stringify(rowData));
    //   console.log("cloneData", cloneData);
      cloneData.birth = dayjs(cloneData.birth);
      form.setFieldsValue(cloneData);
    }
  };

  const handleDelete = (rowData) => {
    // console.log("handleDelete", rowData)
    delUser(rowData).then(() => {
      getUserTableData();
    });
  }

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
    {
      title: "性别",
      dataIndex: "sex",
      render: (val) => {
        return val === 0 ? "男" : "女";
      },
    },
    {
      title: "出生日期",
      dataIndex: "birth",
    },
    {
      title: "地址",
      dataIndex: "addr",
    },
    {
      title: "操作",
      render: (rowData) => {
        return (
          <div className="">
            <Button
              type="primary"
              style={{ marginRight: "5px" }}
              onClick={() => handleClick("edit", rowData)}
            >
              编辑
            </Button>
            <Popconfirm
              title="提示"
              description="此操作将删除该用户，是否继续"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDelete(rowData)}
            >
              <Button danger type="primary">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleFinish = (values) => {
    // console.log(values);
    setlistData({
      name: values.name,
    });
  };

  const getUserTableData = () => {
    getUser(listData).then(({ data }) => {
      //   console.log("getUserTableData", res);
      setTableData(data.list);
    });
  };

  useEffect(() => {
    getUserTableData();
  }, [listData]);

  // 弹窗确定
  const handleOk = () => {
    // 表单校验
    form.validateFields().then((val) => {
    //   console.log("val", val);
      val.birth = dayjs(val.birth).format("YYYY-MM-DD");
      if (modalType === 0) {
        // 新增
        addUser(val).then(() => {
          handleCancel();
          getUserTableData();
        });
      } else {
        editUser(val).then(() => {
            handleCancel();
            getUserTableData();
        })
      }
    }).catch((err) => {
        console.log(err);
    })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="user">
      <div className="flex-box">
        <Button type="primary" onClick={() => handleClick("add")}>
          新增
        </Button>
        <Form layout="inline" onFinish={handleFinish}>
          <Form.Item name="name">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table rowKey={"id"} dataSource={tableData} columns={columns} />
      <Modal
        title={modalType === 0 ? "新增用户" : "编辑用户"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          {modalType === 1 && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="年龄"
            name="age"
            rules={[
              { required: true, message: "请输入年龄" },
              { type: "number", message: "年龄必须是数字" },
            ]}
          >
            <InputNumber placeholder="请输入年龄" style={{ width: "50%" }} />
          </Form.Item>

          <Form.Item
            label="性别"
            name="sex"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { label: "男", value: 0 },
                { label: "女", value: 1 },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item
            label="出生日期"
            name="birth"
            rules={[{ required: true, message: "请选择出生日期" }]}
          >
            <DatePicker placeholder="请选择出生日期" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="地址"
            name="addr"
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
