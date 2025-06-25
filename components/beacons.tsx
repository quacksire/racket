import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { DeviceEventEmitter } from 'react-native';
import {Card, CardContent, CardHeader} from './ui/card';
import { Text } from './ui/text';
import {requestWhenInUseAuthorization, startScanning} from "react-native-beacon-radar";
import {Court} from "~/lib/types/tennis";
import {api} from "~/lib/api";
import {H1, P, Small} from "~/components/ui/typography";
import CountdownTimer from "~/components/CountdownTimer";

type Beacon = {
    uuid: string;
    major: number;
    minor: number;
    rssi: number;
    distance: number;
};

export default function useNearestCourt(uuid: string ) {
    const [closestBeacon, setClosestBeacon] = useState<Beacon | null>(null);

    const [courts, setCourts] = useState<Court[]>([])
    const [timeLeft, setTimeLeft] = useState(10);

    const courtsFetch = useCallback(async () => {
        let courts = await api.courts.getAll()
        console.log("Fetched courts:", courts);
        setCourts(courts);
    }, []);

    useEffect(() => {
        courtsFetch()
    }, []);

    useEffect(() => {
        requestWhenInUseAuthorization();

        let distanceLog: Record<string, number[]> = {};
        let lastBeaconKey: string | null = null;
        let lastAvg: number | null = null;

        const runScanCycle = async () => {
            distanceLog = {}; // clear for new round

            startScanning(uuid, {
                useForegroundService: true,
                useBackgroundService: true,
            });

            const subscription = DeviceEventEmitter.addListener('onBeaconsDetected', (beacons: Beacon[]) => {
                beacons.forEach((b) => {
                    if (b.distance >= 0 && b.rssi !== 0) {
                        const key = `${b.major}_${b.minor}`;
                        if (!distanceLog[key]) distanceLog[key] = [];
                        distanceLog[key].push(b.distance);
                    }
                });
            });

            // Let scan run for 1.5 seconds
            setTimeout(() => {
                subscription.remove();

                const averaged: { key: string; avg: number; major: number; minor: number }[] = [];

                for (const key in distanceLog) {
                    const values = distanceLog[key];
                    if (values.length > 0) {
                        const avg = values.reduce((a, b) => a + b, 0) / values.length;
                        const [major, minor] = key.split('_').map(Number);
                        averaged.push({ key, avg, major, minor });
                    }
                }

                if (averaged.length > 0) {
                    const closest = averaged.sort((a, b) => a.avg - b.avg)[0];

                    const isNew = closest.key !== lastBeaconKey;
                    const distanceChanged = lastAvg === null || Math.abs(closest.avg - lastAvg) > 0.3;

                    if (isNew || distanceChanged) {
                        lastBeaconKey = closest.key;
                        lastAvg = closest.avg;

                        setClosestBeacon({
                            uuid,
                            major: closest.major,
                            minor: closest.minor,
                            rssi: 0,
                            distance: closest.avg,
                        });
                    }
                }
            }, 1500); // scan for 1.5s
        };

        // Run every 10 seconds
        runScanCycle(); // initial
        const intervalId = setInterval(runScanCycle, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [uuid]);

    if (!closestBeacon) return null

    const court = courts.find(c => String(c.beacon_minor) === String(closestBeacon.minor));

    return court?.id
}
