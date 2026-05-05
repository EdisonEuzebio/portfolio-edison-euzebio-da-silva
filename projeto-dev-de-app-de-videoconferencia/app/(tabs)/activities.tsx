import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTraining } from '@/lib/training-context';
import * as Haptics from 'expo-haptics';

interface Activity {
  id: string;
  name: string;
  duration: number;
  repetitions: number;
  completed: boolean;
}

export default function ActivitiesScreen() {
  const router = useRouter();
  const { state, setActivities } = useTraining();
  const [activities, setLocalActivities] = useState<Activity[]>([
    { id: '1', name: 'Aquecimento', duration: 300, repetitions: 0, completed: false },
    { id: '2', name: 'Flexão de Braço', duration: 600, repetitions: 20, completed: false },
    { id: '3', name: 'Agachamento', duration: 600, repetitions: 15, completed: false },
    { id: '4', name: 'Rosca Direta', duration: 600, repetitions: 12, completed: false },
    { id: '5', name: 'Desaquecimento', duration: 300, repetitions: 0, completed: false },
  ]);

  const handleAddActivity = () => {
    Alert.prompt(
      'Adicionar Atividade',
      'Nome do exercício:',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Adicionar',
          onPress: (name: string | undefined) => {
            if (name && name.trim()) {
              const newActivity: Activity = {
                id: String(activities.length + 1),
                name: name.trim(),
                duration: 600,
                repetitions: 10,
                completed: false,
              };
              const updated = [...activities, newActivity];
              setLocalActivities(updated);
              setActivities(updated as any);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };

  const handleToggleActivity = (id: string) => {
    const updated = activities.map((act) =>
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setLocalActivities(updated);
    setActivities(updated as any);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((act) => act.id !== id);
    setLocalActivities(updated);
    setActivities(updated as any);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleStartTraining = () => {
    if (activities.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício');
      return;
    }
    setActivities(activities as any);
    router.push('/(tabs)/training' as any);
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);

  const renderActivity = ({ item }: { item: Activity }) => (
    <View className="bg-surface rounded-lg p-4 border border-border mb-3 flex-row items-center gap-3">
      <TouchableOpacity
        onPress={() => handleToggleActivity(item.id)}
        className={`w-6 h-6 rounded border-2 items-center justify-center ${
          item.completed ? 'bg-success border-success' : 'border-border'
        }`}
      >
        {item.completed && <Text className="text-background text-sm font-bold">✓</Text>}
      </TouchableOpacity>

      <View className="flex-1">
        <Text className={`font-semibold ${item.completed ? 'text-muted line-through' : 'text-foreground'}`}>
          {item.name}
        </Text>
        <Text className="text-xs text-muted mt-1">
          {item.repetitions > 0 ? `${item.repetitions} reps` : 'Sem limite'} • {Math.floor(item.duration / 60)}min
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDeleteActivity(item.id)}
        className="bg-error rounded-full p-2"
      >
        <Text className="text-background text-sm">✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 px-6 py-4 gap-4">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Plano de Treino</Text>
            <Text className="text-sm text-muted mt-1">
              {completedCount} de {activities.length} exercícios • {Math.floor(totalDuration / 60)}min total
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="bg-surface rounded-lg p-3 border border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-sm font-semibold text-foreground">Progresso</Text>
              <Text className="text-xs text-muted">
                {Math.round((completedCount / Math.max(activities.length, 1)) * 100)}%
              </Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View
                className="h-full bg-success"
                style={{
                  width: `${(completedCount / Math.max(activities.length, 1)) * 100}%`,
                }}
              />
            </View>
          </View>

          {/* Activities List */}
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground mb-3">Exercícios</Text>
            {activities.length > 0 ? (
              <FlatList
                data={activities}
                renderItem={renderActivity}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-muted text-center">Nenhum exercício adicionado</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleAddActivity}
              className="bg-surface border-2 border-primary rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-primary font-bold">+ Adicionar Exercício</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStartTraining}
              className="bg-primary rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-background font-bold text-base">▶ Iniciar Treino</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
