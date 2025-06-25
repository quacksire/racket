import {Beacon, Court, EventParticipant, EventParticipantPlayer, Org, Player, Venue} from "./types/tennis";



// api.ts
// reference to the backend code is in ./backend/worker.js
const BASE_URL = "https://racket-dev.workers.quacksire.dev";

type Table =
    | "locations"
    | "orgs"
    | "players"
    | "events"
    | "venues"
    | "courts"
    | "event_participants"
    | "event_participant_players"
    | "beacons";

// i want to support
// /[table]?[column]=[value] filtering
// /[table]?[column]=[value]&[column]=[value] multiple filtering
// no sorting as we can do that client side

type Filter = {
    [key: string]: string | number | boolean | undefined;
};

// we need a type thats `Table | `${Table}?${Filter}`` with filter being optional but also chainable
type FilteredTable = Table | string;

// we need some JSDOC that gives an example of how to use this type



// how to use this type?
// Example usage:
const table: FilteredTable = "players?age=25&country=US";





// === Base fetch wrappers ===
async function getAll<T>(table: FilteredTable): Promise<T[]> {
    const res = await fetch(`${BASE_URL}/${table}`);
    if (!res.ok) throw new Error(`Failed to fetch ${table}`);
    const data = await res.json();
    return data.results ?? data;
}

async function getById<T>(table: FilteredTable): Promise<T> {
    const res = await fetch(`${BASE_URL}/${table}`);
    if (!res.ok) throw new Error(`Failed to fetch ${table} by id`);
    return await res.json();
}

async function insert<T>(table: FilteredTable, payload: T): Promise<void> {
    const res = await fetch(`${BASE_URL}/${table}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to insert into ${table}: ${err}`);
    }
}

// === Exported API with typed returns ===
export const api = {
    locations: {
        getAll: (): Promise<Location[]> => getAll<Location>("locations"),
        getById: (id: string): Promise<Location> => getById<Location>("locations?id=" + id),
        insert: (data: Location): Promise<void> => insert("locations", data),
    },
    orgs: {
        getAll: (): Promise<Org[]> => getAll<Org>("orgs"),
        getById: (id: string): Promise<Org> => getById<Org>("orgs?id=" + id),
        insert: (data: Org): Promise<void> => insert("orgs", data),
    },
    players: {
        getAll: (): Promise<Player[]> => getAll<Player>("players"),
        getById: (id: string): Promise<Player> => getById<Player>("players?id=" + id),
        insert: (data: Player): Promise<void> => insert("players", data),
    },
    events: {
        getAll: (): Promise<Event[]> => getAll<Event>("events"),
        getById: (id: string): Promise<Event> => getById<Event>("events?id=" + id),
        insert: (data: Event): Promise<void> => insert("events", data),
    },
    venues: {
        getAll: (): Promise<Venue[]> => getAll<Venue>("venues"),
        getById: (id: string): Promise<Venue> => getById<Venue>("venues?id=" + id),
        insert: (data: Venue): Promise<void> => insert("venues", data),
    },
    courts: {
        getAll: (): Promise<Court[]> => getAll<Court>("courts"),
        getByVenueId: (venueId: string): Promise<Court[]> => getAll<Court>(`courts?venue_id=${venueId}`),
        getById: (id: string): Promise<Court> => getById<Court>("courts?id=" + id),
        insert: (data: Court): Promise<void> => insert("courts", data),
    },
    eventParticipants: {
        getAll: (): Promise<EventParticipant[]> => getAll<EventParticipant>("event_participants"),
        getById: (id: string): Promise<EventParticipant> => getById<EventParticipant>("event_participants?id=" + id),
        insert: (data: EventParticipant): Promise<void> => insert("event_participants", data),
    },
    eventParticipantPlayers: {
        getAll: (): Promise<EventParticipantPlayer[]> => getAll<EventParticipantPlayer>("event_participant_players"),
        insert: (data: EventParticipantPlayer): Promise<void> => insert("event_participant_players", data),
    },
    beacons: {
        getAll: (): Promise<Beacon[]> => getAll<Beacon>("beacons"),
        getById: (id: string): Promise<Beacon> => getById<Beacon>("beacons?id=" + id),
        insert: (data: Beacon): Promise<void> => insert("beacons", data),
    },
};
