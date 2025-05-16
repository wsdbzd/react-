import React, { useState } from "react";
import { Menu, Layout } from "antd";
import * as Icon from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { menus } from "../../config";
import { selectMenuList } from "../../store/reducers/tab";

const { Sider } = Layout;

// 动态获取icon
const iconToElement = (icon) => React.createElement(Icon[icon]);

const items = menus.map((item) => {
  const child = {
    key: item.path,
    icon: iconToElement(item.icon),
    label: item.label,
  };
  if (item.children) {
    child.children = item.children.map((subItem) => {
      return {
        key: subItem.path,
        icon: iconToElement(subItem.icon),
        label: subItem.label,
      };
    });
  }
  return child;
});

const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 添加数据到store
  const setTabsList = (val) => {
    dispatch(selectMenuList(val));
  }

  const selectMenu = (e) => {
    console.log("selectMenu", e);
    let data;
    menus.forEach((item) => {
      if (e.keyPath[e.keyPath.length - 1] === item.path) {
        data = item;
        if (e.keyPath.length > 1) {
          data = item.children.find((child) => {
            return child.path === e.key;
          });
        }
      }
    });
    setTabsList({
        path: data.path,
        name: data.name,
        label: data.label,
    });
    navigate(e.key);
  };

  return (
    <Sider trigger={null} collapsed={collapsed}>
      <h3 style={{ color: "white", textAlign: "center", margin: "16px 0" }}>
        {collapsed ? "后台" : "通用后台管理系统"}
      </h3>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        onClick={selectMenu}
      />
    </Sider>
  );
};

export default CommonAside;
