import React, { useState } from "react";
import { Layout, Dropdown, Button, Avatar } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Image from "../../assets/react.svg";
import "./index.scss";
import { collapseMenu } from "../../store/reducers/tab";

const { Header } = Layout;

const CommonHeader = ({ collapsed }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          个人中心
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={logout}>
          退出
        </a>
      ),
    },
  ];

  const dispatch = useDispatch();

  // 点击展开收起按钮
  const setCollapsed = () => {
    // console.log(collapsed);
    dispatch(collapseMenu());
  };

  return (
    <Header className="header-container">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={setCollapsed}
        style={{
          fontSize: "16px",
          width: 64,
          height: 32,
          background: "#fff",
        }}
      />
      <Dropdown menu={{ items }}>
        <Avatar src={Image} />
      </Dropdown>
    </Header>
  );
};

export default CommonHeader;
