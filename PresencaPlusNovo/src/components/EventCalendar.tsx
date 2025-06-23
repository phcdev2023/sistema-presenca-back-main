import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { colors } from '../theme/colors';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

type AgendaEvent = {
  name: string;
  time: string;
  location: string;
  height: number;
  day: string;
};
type AgendaItems = { [date: string]: AgendaEvent[] };

const mockEvents: AgendaItems = {
  '2025-06-23': [{ name: 'Aula Magna', time: '19:00', location: 'Auditório', height: 70, day: '2025-06-23' }],
  '2025-06-24': [{ name: 'Palestra de Carreiras', time: '20:00', location: 'Sala 12', height: 70, day: '2025-06-24' }],
};

export default function EventCalendar() {
  console.log('EventCalendar renderizou');
  // Garante que todas as datas visíveis tenham arrays, mesmo vazios
  function getAgendaItems(events: AgendaItems) {
    const today = new Date();
    for (let i = -15; i <= 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const ymd = date.toISOString().slice(0, 10);
      if (!events[ymd]) events[ymd] = [];
      events[ymd] = events[ymd].map(ev => ({
        ...ev,
        height: typeof ev.height === 'number' ? ev.height : 70,
        day: ymd
      }));
    }
    return { ...events };
  }

  const [items] = useState(getAgendaItems({ ...mockEvents }));

  return (
    <View style={styles.container}>
      <Agenda
        items={{}}
        selected={'2025-06-23'}
        renderItem={(item) => <Text>{item?.name || 'Evento'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  eventCard: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 18,
    marginRight: 10,
    marginTop: 17,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  eventInfo: {
    fontSize: 14,
    color: colors.muted,
  },
});
