import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    axios.post(`${API_URL}/users/login`, {
      email: values.email,
      password: values.password
    })
      .then(res => {
        if (res.data && res.data.token) {
          localStorage.setItem('admin_jwt', res.data.token);
          onLogin(res.data.token);
          message.success('Login realizado com sucesso!');
        } else {
          message.error('Token não recebido!');
        }
      })
      .catch(() => message.error('Usuário ou senha inválidos!'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Login do Administrador" style={{ width: 350 }}>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Informe o e-mail!' }]}>
            <Input type="email" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe a senha!' }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
