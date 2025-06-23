import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button, Drawer, Popconfirm } from 'antd';
import axios from 'axios';
import UserForm, { UserFormValues } from './UserForm';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  registration?: string;
  course?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => message.error('Erro ao carregar usuários'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleDelete = async (user: User) => {
    try {
      await axios.delete(`${API_URL}/users/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
      });
      message.success('Usuário removido!');
      fetchUsers();
    } catch {
      message.error('Erro ao remover usuário');
    }
  };

  const handleFinish = async (values: UserFormValues) => {
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/users/${editingUser._id}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
        });
        message.success('Usuário atualizado!');
      } else {
        await axios.post(`${API_URL}/users`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
        });
        message.success('Usuário criado!');
      }
      setDrawerOpen(false);
      fetchUsers();
    } catch {
      message.error('Erro ao salvar usuário');
    }
  };

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Matrícula', dataIndex: 'registration', key: 'registration' },
    { title: 'Curso', dataIndex: 'course', key: 'course' },
    { title: 'Perfil', dataIndex: 'role', key: 'role' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, user: User) => (
        <>
          <Button type="link" onClick={() => handleEdit(user)}>Editar</Button>
          <Popconfirm title="Remover usuário?" onConfirm={() => handleDelete(user)} okText="Sim" cancelText="Não">
            <Button type="link" danger>Remover</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <h2>Usuários</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleCreate}>Novo Usuário</Button>
      <Spin spinning={loading}>
        <Table rowKey="_id" columns={columns} dataSource={users} pagination={{ pageSize: 10 }} />
      </Spin>
      <Drawer
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
        width={400}
      >
        <UserForm initialValues={editingUser || {}} onFinish={handleFinish} submitText={editingUser ? 'Salvar' : 'Criar'} />
      </Drawer>
    </div>
  );
}
