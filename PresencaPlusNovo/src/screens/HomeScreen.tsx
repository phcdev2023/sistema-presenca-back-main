import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { createStudent, getStudents, updateStudent, deleteStudent } from '../api';

interface Student {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  registration: string;
}

export default function HomeScreen({ navigation }: any) {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registration, setRegistration] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      // Suporte para id ou _id
      const data = res.data.map((s: any) => ({ ...s, id: s._id || s.id }));
      setStudents(data);
    } catch (err) {
      Alert.alert('Erro ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditStudent = async () => {
    if (!name || !email || !registration) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    try {
      if (editingId) {
        await updateStudent(editingId, { name, email, registration });
        Alert.alert('Aluno atualizado com sucesso!');
      } else {
        await createStudent({ name, email, registration });
        Alert.alert('Aluno cadastrado com sucesso!');
      }
      setName('');
      setEmail('');
      setRegistration('');
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      Alert.alert('Erro ao salvar aluno');
    }
  };

  const handleEdit = (student: Student) => {
    setName(student.name);
    setEmail(student.email);
    setRegistration(student.registration);
    setEditingId(student.id || student._id || '');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remover aluno', 'Tem certeza que deseja remover este aluno?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        try {
          await deleteStudent(id);
          fetchStudents();
        } catch (err) {
          Alert.alert('Erro ao remover aluno');
        }
      }}
    ]);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Alunos</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          value={registration}
          onChangeText={setRegistration}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleAddOrEditStudent}>
          <Ionicons name={editingId ? 'create' : 'add-circle'} size={22} color={colors.secondary} />
          <Text style={styles.saveButtonText}>{editingId ? 'Salvar Alteração' : 'Adicionar Aluno'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.listTitle}>Alunos Cadastrados</Text>
      <FlatList
        data={students}
        keyExtractor={item => (item.id || item._id || '')}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentInfo}>Email: {item.email}</Text>
              <Text style={styles.studentInfo}>Matrícula: {item.registration}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
              <Ionicons name="create" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id || item._id || '')} style={styles.actionButton}>
              <Ionicons name="trash" size={20} color={colors.error || '#e53935'} />
            </TouchableOpacity>
          </View>
        )}
        style={{ width: '100%', marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 18,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  studentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
  },
  studentInfo: {
    fontSize: 15,
    color: colors.text,
    marginTop: 2,
  },
  actionButton: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
});
