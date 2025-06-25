import { DeviceEventEmitter } from 'react-native';
import { startScanning, requestWhenInUseAuthorization } from 'react-native-beacon-radar';

// given a uuid, returns an object of beacons in order of proximity
export async function beaconRanger(uuid: string) {
    // Request location permission
    await requestWhenInUseAuthorization();

    // Start scanning for beacons with the given UUID
    const beacons = await startScanning(uuid, {
        useForegroundService: true,
        useBackgroundService: true,
    });

    DeviceEventEmitter.addListener('onBeaconsDetected', (beacons) => {
        //console.log('onBeaconsDetected', beacons);

        const sortedBeacons = [...beacons]
            .filter((b) => b.distance >= 0 && b.rssi !== 0)
            .sort((a, b) => a.distance - b.distance);

        const orderedBeaconMap: { [key: string]: typeof sortedBeacons[0] } = {};
        sortedBeacons.forEach((beacon) => {
            orderedBeaconMap[`${beacon.major}_${beacon.minor}`] = beacon;
        });

        console.log('Sorted Beacons:', orderedBeaconMap);

        return orderedBeaconMap;
    });

    //[{"distance": -1, "major": 1001, "minor": 3, "rssi": 0, "uuid": "C2E53AF6-2058-4616-A53A-F62058161672"}, {"distance": 0.052749970637026196, "major": 1001, "minor": 2, "rssi": -36, "uuid": "C2E53AF6-2058-4616-A53A-F62058161672"}

}
