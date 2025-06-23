import React from 'react';
import { Form, Input, Select } from 'antd';

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  registration?: string;
  course?: string;
  role: string;
}

export default function UserForm({ initialValues, onFinish, submitText = 'Salvar', loading = false }: {
  initialValues?: Partial<UserFormValues>;
  onFinish: (values: UserFormValues) => void;
  submitText?: string;
  loading?: boolean;
}) {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}> <Input /> </Form.Item>
      <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Informe o e-mail' }]}> <Input type="email" /> </Form.Item>
      {(!initialValues || !initialValues._id) && (
        <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe a senha' }]}> <Input.Password /> </Form.Item>
      )}
      <Form.Item name="registration" label="Matrícula"> <Input /> </Form.Item>
      <Form.Item name="course" label="Curso"> <Input /> </Form.Item>
      <Form.Item name="role" label="Perfil" rules={[{ required: true, message: 'Selecione o perfil' }]}> <Select>
        <Select.Option value="admin">Administrador</Select.Option>
        <Select.Option value="student">Aluno</Select.Option>
        <Select.Option value="teacher">Professor</Select.Option>
      </Select></Form.Item>
      <Form.Item>
        <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>{submitText}</button>
      </Form.Item>
    </Form>
  );
}
