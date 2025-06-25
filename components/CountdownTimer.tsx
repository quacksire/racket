import React from 'react';
import { Text, View } from 'react-native';
import { Progress } from './ui/progress';

export default function CountdownTimer({ timeLeft, duration }: { timeLeft: number; duration: number }) {
    const percent = ((duration - timeLeft) / duration) * 100;

    return (
        <View className="w-full mt-2">
            <Text className="text-center text-sm mb-1">
                Next update in {timeLeft}s
            </Text>
            <Progress value={percent} />
        </View>
    );
}
