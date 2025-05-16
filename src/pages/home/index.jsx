import { Row, Col, Card, Table } from "antd";
import React, { useState, useEffect } from "react";

import userImg from "../../assets/react.svg";
import "./index.scss";
import { getData } from "../../api";
import * as Icon from "@ant-design/icons";
import MyEcharts from '../../components/Echarts/index'

// table列的数据
const columns = [
  {
    title: "课程",
    dataIndex: "name",
  },
  {
    title: "今日购买",
    dataIndex: "todayBuy",
  },
  {
    title: "本月购买",
    dataIndex: "monthBuy",
  },
  {
    title: "总购买",
    dataIndex: "totalBuy",
  },
];

// 订单统计数据
const countData = [
  {
    name: "今日支付订单",
    value: 1234,
    icon: "CheckCircleOutlined",
    color: "#2ec7c9",
  },
  {
    name: "今日收藏订单",
    value: 3421,
    icon: "ClockCircleOutlined",
    color: "#ffb980",
  },
  {
    name: "今日未支付订单",
    value: 1234,
    icon: "CloseCircleOutlined",
    color: "#5ab1ef",
  },
  {
    name: "本月支付订单",
    value: 1234,
    icon: "CheckCircleOutlined",
    color: "#2ec7c9",
  },
  {
    name: "本月收藏订单",
    value: 3421,
    icon: "ClockCircleOutlined",
    color: "#ffb980",
  },
  {
    name: "本月未支付订单",
    value: 1234,
    icon: "CloseCircleOutlined",
    color: "#5ab1ef",
  },
];

const Home = () => {
  const [tableData, setTableData] = useState([]);
  const [echartsData, setEchartsData] = useState([]);

  // 动态获取icon
  const iconToElement = (icon) => React.createElement(Icon[icon]);

  useEffect(() => {
    getData().then(({ data }) => {
      // console.log(data)
      const { tableData, orderData, userData, videoData } = data.data;
      setTableData(tableData);
      // 对于echarts数据的组装
      const order = orderData;
      // x轴的数据
      const xData = order.date;
      // series数据的组装
      const keyArray = Object.keys(order.data[0]);
      let series = [];
      keyArray.forEach(key => {
        series.push({
            name: key,
            data: order.data.map(item => item[key]),
            type: 'line'
        })
      });
      setEchartsData({
        order: {
            xData,
            series
        },
        user: {
            xData: userData.map(item => item.date),
            series: [
                {
                    name: '新增用户',
                    data: userData.map(item => item.new),
                    type: 'bar'
                },
                {
                    name: '活跃用户',
                    data: userData.map(item => item.active),
                    type: 'bar'
                },
            ]
        },
        video: {
            series: [
                {
                    data: videoData,
                    type: 'pie',
                },
            ]
        }
      })
    });

  }, []);

  return (
    <Row className="home">
      <Col span={8}>
        <Card hoverable style={{ marginBottom: "20px" }}>
          <div className="user">
            <img src={userImg} alt="" />
            <div className="user-info">
              <p className="name">Admin</p>
              <p className="access">超级管理员</p>
            </div>
          </div>

          <div className="login-info">
            <p>
              上次登录时间：<span>2021-08-01 10:00:00</span>
            </p>
            <p>
              上次登录地点：<span>武汉</span>
            </p>
          </div>
        </Card>

        <Card>
          <Table
            rowKey={"name"}
            pagination={false}
            dataSource={tableData}
            columns={columns}
          />
        </Card>
      </Col>

      <Col span={16}>
        <div className="num">
          {countData.map((item, index) => {
            return (
              <Card key={index}>
                <div
                  className="icon-box"
                  style={{ backgroundColor: item.color }}
                >
                  {iconToElement(item.icon)}
                </div>
                <div className="detail">
                  <p className="value">${item.value}</p>
                  <p className="name">{item.name}</p>
                </div>
              </Card>
            );
          })}
        </div>

        { echartsData.order && <MyEcharts chartData={echartsData.order} style={{ height: '280px' }}/>}

        <div className="graph">
          { echartsData.user && <MyEcharts chartData={echartsData.user} style={{ height: '240px', width: '50%' }}/>}
          { echartsData.video && <MyEcharts chartData={echartsData.video} isAxisChart={false} style={{ height: '260px', width: '50%' }}/>}
        </div>
      </Col>
    </Row>
  );
};

export default Home;
