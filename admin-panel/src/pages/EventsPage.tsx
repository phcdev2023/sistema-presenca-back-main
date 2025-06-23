import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button, Drawer, Popconfirm } from 'antd';
import axios from 'axios';
import EventForm, { EventFormValues } from './EventForm';

interface Event {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: { name: string } | string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    axios.get(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
    })
      .then(res => setEvents(res.data))
      .catch(() => message.error('Erro ao carregar eventos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    setEditingEvent(null);
    setDrawerOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setDrawerOpen(true);
  };

  const handleDelete = async (event: Event) => {
    try {
      await axios.delete(`${API_URL}/events/${event._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
      });
      message.success('Evento removido!');
      fetchEvents();
    } catch {
      message.error('Erro ao remover evento');
    }
  };

  const handleFinish = async (values: EventFormValues) => {
    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/events/${editingEvent._id}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
        });
        message.success('Evento atualizado!');
      } else {
        await axios.post(`${API_URL}/events`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` }
        });
        message.success('Evento criado!');
      }
      setDrawerOpen(false);
      fetchEvents();
    } catch {
      message.error('Erro ao salvar evento');
    }
  };

  const columns = [
    { title: 'Título', dataIndex: 'title', key: 'title' },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    { title: 'Início', dataIndex: 'startDate', key: 'startDate', render: (d: string) => new Date(d).toLocaleString() },
    { title: 'Fim', dataIndex: 'endDate', key: 'endDate', render: (d: string) => new Date(d).toLocaleString() },
    { title: 'Local', key: 'location', render: (_: any, record: Event) => typeof record.location === 'string' ? record.location : record.location?.name },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, event: Event) => (
        <>
          <Button type="link" onClick={() => handleEdit(event)}>Editar</Button>
          <Popconfirm title="Remover evento?" onConfirm={() => handleDelete(event)} okText="Sim" cancelText="Não">
            <Button type="link" danger>Remover</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <h2>Eventos</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleCreate}>Novo Evento</Button>
      <Spin spinning={loading}>
        <Table rowKey="_id" columns={columns} dataSource={events} pagination={{ pageSize: 10 }} />
      </Spin>
      <Drawer
        title={editingEvent ? 'Editar Evento' : 'Novo Evento'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
        width={400}
      >
        <EventForm initialValues={editingEvent ? {
          ...editingEvent,
          startDate: editingEvent.startDate ? new Date(editingEvent.startDate) : undefined,
          endDate: editingEvent.endDate ? new Date(editingEvent.endDate) : undefined,
          location: typeof editingEvent.location === 'string' ? editingEvent.location : editingEvent.location?.name
        } : {}} onFinish={handleFinish} submitText={editingEvent ? 'Salvar' : 'Criar'} />
      </Drawer>
    </div>
  );
}
