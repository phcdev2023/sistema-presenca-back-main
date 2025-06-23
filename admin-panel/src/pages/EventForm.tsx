import React from 'react';
import { Form, Input, DatePicker } from 'antd';

export interface EventFormValues {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export default function EventForm({ initialValues, onFinish, submitText = 'Salvar', loading = false }: {
  initialValues?: Partial<EventFormValues>;
  onFinish: (values: EventFormValues) => void;
  submitText?: string;
  loading?: boolean;
}) {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={values => {
      // Converter datas para ISO string
      const { startDate, endDate, ...rest } = values;
      onFinish({
        ...rest,
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
      });
    }}>
      <Form.Item name="title" label="Título" rules={[{ required: true, message: 'Informe o título' }]}> <Input /> </Form.Item>
      <Form.Item name="description" label="Descrição"> <Input.TextArea /> </Form.Item>
      <Form.Item name="startDate" label="Data/Hora de Início" rules={[{ required: true, message: 'Informe a data/hora de início' }]}> <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} /> </Form.Item>
      <Form.Item name="endDate" label="Data/Hora de Fim" rules={[{ required: true, message: 'Informe a data/hora de fim' }]}> <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} /> </Form.Item>
      <Form.Item name="location" label="Local"> <Input /> </Form.Item>
      <Form.Item>
        <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>{submitText}</button>
      </Form.Item>
    </Form>
  );
}
