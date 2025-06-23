import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  LoginOutlined,
  HomeOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Header, Content, Sider } = Layout;

import UsersPage from './pages/UsersPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import AttendancesPage from './pages/AttendancesPage';

function Dashboard() {
  return <div>Bem-vindo ao Painel Administrativo!</div>;
}

function App() {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem('admin_jwt'));

  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('admin_jwt', jwt);
  };
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_jwt');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div style={{ height: 32, margin: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
            Admin Panel
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
            <Menu.Item key="dashboard" icon={<HomeOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              <Link to="/users">Usuários</Link>
            </Menu.Item>
            <Menu.Item key="events" icon={<CalendarOutlined />}>
              <Link to="/events">Eventos</Link>
            </Menu.Item>
            <Menu.Item key="attendances" icon={<CalendarOutlined />}>
              <Link to="/attendances">Presenças</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LoginOutlined />} onClick={handleLogout}>
              Sair
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontWeight: 'bold' }}>
            Sistema de Presença - Admin
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/attendances" element={<AttendancesPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
