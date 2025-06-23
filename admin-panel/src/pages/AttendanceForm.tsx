import React from 'react';
import { Form, Select } from 'antd';

export interface AttendanceFormValues {
  user: string;
  event: string;
  status: string;
}

export default function AttendanceForm({ initialValues, users, events, onFinish, submitText = 'Salvar', loading = false }: {
  initialValues?: Partial<AttendanceFormValues>;
  users: { _id: string; name: string }[];
  events: { _id: string; title: string }[];
  onFinish: (values: AttendanceFormValues) => void;
  submitText?: string;
  loading?: boolean;
}) {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item name="user" label="Usuário" rules={[{ required: true, message: 'Selecione o usuário' }]}> <Select>{users.map(u => <Select.Option key={u._id} value={u._id}>{u.name}</Select.Option>)}</Select> </Form.Item>
      <Form.Item name="event" label="Evento" rules={[{ required: true, message: 'Selecione o evento' }]}> <Select>{events.map(e => <Select.Option key={e._id} value={e._id}>{e.title}</Select.Option>)}</Select> </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Selecione o status' }]}> <Select>
        <Select.Option value="present">Presente</Select.Option>
        <Select.Option value="absent">Ausente</Select.Option>
        <Select.Option value="late">Atrasado</Select.Option>
      </Select></Form.Item>
      <Form.Item>
        <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>{submitText}</button>
      </Form.Item>
    </Form>
  );
}
