import { Form, Input, Button, message } from 'antd';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import request from '../../request';
import qs from 'qs';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './style.css';

class LoginForm extends Component {
  state = {
    isLogin: false,
  }

  onFinish = (values: any) => {
    request.post('/api/login', qs.stringify({
      password: values.password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(res => {
      const data: responseResult.login = res.data 
      if (data) {
        this.setState({
          isLogin: true,
        })
      } else {
        message.error('登入失敗')
      }
    })
  };
  render () {
    const {isLogin} = this.state
    
    return (
      isLogin ? (
        <Redirect to='/' />
      ) : (
        <div className="login-page">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '請輸入密碼!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
  
          <Form.Item>
            <Button type="primary" htmlType="submit">登入</Button>
          </Form.Item>
        </Form>
      </div>
      )
    );
  }
};

export default LoginForm;