import * as React from 'react';
import {Pressable, ScrollView, View, Text} from 'react-native';
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated';
import { Info } from '~/lib/icons/Info';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import {H1} from "~/components/ui/typography";
import {api} from "~/lib/api";
import {useEffect, useState} from "react";
import {Court} from "~/lib/types/tennis";
import {beaconRanger} from "~/lib/beaconRanger";
import ClosestBeacon from "~/components/beacons";
import useNearestCourt from "~/components/beacons";
import { toast } from 'sonner-native';


export default function Screen() {
    const [courts, setCourts] = useState<Court[]>([])
    const closestBeacon = useNearestCourt("c2e53af6-2058-4616-a53a-f62058161672");

    useEffect(() => {


        async function fetchCourts() {
            try {
                const courtsData = await api.courts.getAll();
                //console.log("Fetched courts:", courtsData);
                setCourts(courtsData);
            } catch (error) {
                console.error("Failed to fetch courts:", error);
            }
        }

        fetchCourts();
    }, []);

    useEffect(() => {
        if (!closestBeacon) return;
        toast.info(`You might be near ${courts.find(c => String(c.id) === String(closestBeacon))?.court_name}!`, {
            position: "bottom-center",
            richColors: true,
            dismissible: true,
        })
    }, [closestBeacon]);

    console.log("Closest Beacon:", closestBeacon);

    return (
        <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30 mt-3'>
            <H1>
                <Text>🎾Battle of the Bay!</Text>
            </H1>

            <View className={'w-screen items-center gap-10'}>
            {                courts.length === 0 ? (
                <Card className='w-full max-w-md'>
                    <CardHeader>
                        <CardTitle><Text>Loading Courts...</Text></CardTitle>
                        <CardDescription><Text>Please wait while we fetch the courts.</Text></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled>
                            <Info className='mr-2 h-4 w-4' />
                            <Text>Loading...</Text>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <ScrollView className='w-full'>
                    {courts.map((court) => (
                        <Animated.View
                            key={court.id}
                            entering={FadeInUp}
                            exiting={FadeOutDown}
                        >
                            <Card className='w-full max-w-md mb-4'>
                                <CardHeader>
                                    <CardTitle><Text>{court.court_name}</Text></CardTitle>
                                    <CardDescription><Text>Court #{court.court_number}</Text></CardDescription>
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                                <CardFooter>
                                </CardFooter>
                            </Card>
                        </Animated.View>
                    ))}
                </ScrollView>
            )}
            </View>

        </View>
    );
}
