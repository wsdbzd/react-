import React from "react";
import { Tag, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./index.scss";
import { closeTab, setCurrentMenu } from "../../store/reducers/tab";

const CommonTag = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tabList, currentMenu } = useSelector((state) => ({
    tabList: state.tab.tabList,
    currentMenu: state.tab.currentMenu,
  }));
//   console.log("tabList", tabList);

  const handleClose = (tag, index) => {
    let length = tabList.length;
    console.log("tab", tag);
    console.log("tabList", tabList);
    dispatch(closeTab(tag));
    if(tag.path !== currentMenu.path) return ;
    if (index === length - 1) {
        const curData = tabList[index - 1];
        dispatch(setCurrentMenu(curData));
        navigate(curData.path);
    } else {
        const curData = tabList[index + 1];
        dispatch(setCurrentMenu(curData));
        navigate(curData.path);
    }
    
  };

  // 点击tag
  const handleChange = (tag) => {
    dispatch(setCurrentMenu(tag));
    navigate(tag.path);
  }

  // tag的显示
  const setTag = (flag, item, index) => {
    return flag ? (
      <Tag
        color="#55acee"
        key={item.name}
        closable
        onClose={() => handleClose(item, index)}
      >
        {item.label}
      </Tag>
    ) : (
      <Tag key={item.name} onClick={() => handleChange(item)}>{item.label}</Tag>
    );
  };

  return (
    <Space className="common-tag" size={[0, 8]} wrap>
      {/* <Tag>首页</Tag>
        <Tag color='#55acee' closeIcon onClose={() => handleClose()}>用户列表</Tag> */}
      {currentMenu.name &&
        tabList.map((item, index) =>
          setTag(item.path === currentMenu.path, item, index)
        )}
    </Space>
  );
};

export default CommonTag;
