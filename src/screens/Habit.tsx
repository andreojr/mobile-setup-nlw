import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Feather } from '@expo/vector-icons';

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { HabitsEmpty } from "../components/HabitsEmpty";
import colors from "tailwindcss/colors";
import clsx from "clsx";

interface HabitParams {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;
    }[];
}

export function Habit() {
    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const route = useRoute();
    const { date } = route.params as HabitParams;

    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const habitProgress = dayInfo?.possibleHabits.length
        ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
        : 0;

    async function fetchHabits() {
        try {
            setLoading(true);
            const response = await api.get('/day', { params: { date } });
            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits);
        } catch(error) {
            console.log(error);
            Alert.alert('Ops!', 'Não foi possível carregar os hábitos do dia selecionado.');
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleHabit(habit_id: string) {
        try {
            await api.patch(`/habits/${habit_id}/toggle`);
            if (completedHabits.includes(habit_id)) setCompletedHabits(prevState => prevState.filter(habit => habit !== habit_id));
            else setCompletedHabits(prevState => [...prevState, habit_id])
        } catch(error) {
            console.log(error);
            Alert.alert('Ops!', 'Não foi possível atualizar o status do hábito.');
        }
    }

    useEffect(() => {
        fetchHabits();
    }, []);

    return loading ? <Loading /> : (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>
                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitProgress} />

                <View
                    className={clsx("mt-6", {
                        ["opacity-50"]: isDateInPast && dayInfo?.possibleHabits && dayInfo.possibleHabits.length > 0,
                    })}
                >
                    {dayInfo?.possibleHabits &&
                    (dayInfo.possibleHabits.length > 0
                    ? dayInfo.possibleHabits.map(habit => (
                        <Checkbox
                            key={habit.id}
                            title={habit.title}
                            checked={completedHabits.includes(habit.id)}
                            disabled={isDateInPast}
                            onPress={() => handleToggleHabit(habit.id)}
                        />
                    ))
                    : <HabitsEmpty />)}
                </View>

                {isDateInPast && dayInfo?.possibleHabits && dayInfo.possibleHabits.length > 0 && (
                    <View className="flex-row justify-start items-center mt-10">
                        <Feather
                            name='info'
                            size={24}
                            color={colors.yellow[600]}
                            className=""
                        />
                        <Text
                            className="text-yellow-600 ml-3 w-5/6"
                        >   
                            Você não pode mexer em hábitos de uma data passada.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}