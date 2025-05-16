import { Form, Input, Button, message } from "antd";
import { useNavigate, Navigate } from "react-router-dom";

import "./index.scss";
import { getMenu } from "../../api";

const Login = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = (val) => {
    if (!val.username || !val.password) {
      message.error("账号或密码不能为空！");
      return;
    }
    getMenu(val).then(({ data }) => {
      console.log("res", data);
      localStorage.setItem("token", data.data.token);
      navigate('/home')
    });
  };

  return (
    <Form className="login-container" onFinish={handleSubmit}>
      <div className="login-title">系统登录</div>
      <Form.Item label="账号" name="username">
        <Input placeholder="请输入账号" />
      </Form.Item>

      <Form.Item label="密码" name="password">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
