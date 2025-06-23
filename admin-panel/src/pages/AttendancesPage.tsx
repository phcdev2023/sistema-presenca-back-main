import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button, Drawer, Popconfirm } from 'antd';
import axios from 'axios';
import AttendanceForm, { AttendanceFormValues } from './AttendanceForm';

interface Attendance {
  _id: string;
  user: { _id: string; name: string } | string;
  event: { _id: string; title: string } | string;
  status: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const [events, setEvents] = useState<{ _id: string; title: string }[]>([]);

  const fetchAttendances = () => {
    setLoading(true);
    axios.get(`${API_URL}/attendances`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
    })
      .then(res => setAttendances(res.data))
      .catch(() => message.error('Erro ao carregar presenças'))
      .finally(() => setLoading(false));
  };

  const fetchUsersAndEvents = async () => {
    try {
      const [usersRes, eventsRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` } }),
        axios.get(`${API_URL}/events`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` } })
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch {
      message.error('Erro ao carregar usuários/eventos');
    }
  };

  useEffect(() => {
    fetchAttendances();
    fetchUsersAndEvents();
  }, []);

  const handleCreate = () => {
    setEditingAttendance(null);
    setDrawerOpen(true);
  };

  const handleEdit = (attendance: Attendance) => {
    setEditingAttendance(attendance);
    setDrawerOpen(true);
  };

  const handleDelete = async (attendance: Attendance) => {
    try {
      await axios.delete(`${API_URL}/attendances/${attendance._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
      });
      message.success('Presença removida!');
      fetchAttendances();
    } catch {
      message.error('Erro ao remover presença');
    }
  };

  const handleFinish = async (values: AttendanceFormValues) => {
    try {
      if (editingAttendance) {
        await axios.put(`${API_URL}/attendances/${editingAttendance._id}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
        });
        message.success('Presença atualizada!');
      } else {
        await axios.post(`${API_URL}/attendances`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
        });
        message.success('Presença criada!');
      }
      setDrawerOpen(false);
      fetchAttendances();
    } catch {
      message.error('Erro ao salvar presença');
    }
  };

  const columns = [
    { title: 'Usuário', dataIndex: ['user', 'name'], key: 'user', render: (u: any, record: Attendance) => typeof record.user === 'string' ? record.user : record.user?.name },
    { title: 'Evento', dataIndex: ['event', 'title'], key: 'event', render: (e: any, record: Attendance) => typeof record.event === 'string' ? record.event : record.event?.title },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, attendance: Attendance) => (
        <>
          <Button type="link" onClick={() => handleEdit(attendance)}>Editar</Button>
          <Popconfirm title="Remover presença?" onConfirm={() => handleDelete(attendance)} okText="Sim" cancelText="Não">
            <Button type="link" danger>Remover</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <h2>Presenças</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleCreate}>Nova Presença</Button>
      <Spin spinning={loading}>
        <Table rowKey="_id" columns={columns} dataSource={attendances} pagination={{ pageSize: 10 }} />
      </Spin>
      <Drawer
        title={editingAttendance ? 'Editar Presença' : 'Nova Presença'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
        width={400}
      >
        <AttendanceForm
          initialValues={editingAttendance ? {
            ...editingAttendance,
            user: typeof editingAttendance.user === 'string' ? editingAttendance.user : editingAttendance.user?._id,
            event: typeof editingAttendance.event === 'string' ? editingAttendance.event : editingAttendance.event?._id
          } : {}}
          users={users}
          events={events}
          onFinish={handleFinish}
          submitText={editingAttendance ? 'Salvar' : 'Criar'}
        />
      </Drawer>
    </div>
  );
}
