import * as React from 'react';
import {Pressable, View, Text} from 'react-native';
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
import {useEffect, useState} from "react";
import {Event} from "~/lib/types/tennis";
import {api} from "~/lib/api";
import {useRouter} from "expo-router";

export default function Screen() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        async function fetchEvents() {
            try {
                // api.events.getAll() is assumed to be a function that fetches all events
                const eventsData = await api.events.getAll();
                console.log("Fetched events:", eventsData);
                //@ts-ignore
                setEvents(eventsData);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        }

        fetchEvents();
    }, []);



  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <H1>
       Events
      </H1>

        {          events.length === 0 ? (
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Loading Events...</CardTitle>
              <CardDescription>Please wait while we fetch the events.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled>
                <Info className='mr-2 h-4 w-4' />
                <Text>
                    Loading...
                </Text>
              </Button>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>
                        <Text>🏆 {event.event_name}</Text>
                    </CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <View className='flex-row items-center gap-2'>
                    <Text>
                        {event.start_time} - {event.end_time}
                    </Text>
                    </View>
                </CardContent>
                <CardFooter>
                    <Button onPress={() => router.navigate(`/${event.id}`)}>
                    <Text>
                        View Details
                    </Text>
                    </Button>
                </CardFooter>
            </Card>
            ))
        )}


    </View>
  );
}
