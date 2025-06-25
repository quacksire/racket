export interface Event {
    id: string;
    event_type: EventType;
    event_name: string;
    tournament_director: string;
    league: string;
    prize: string;
    participants: EventParticipant[]; // mixed participants
    description: string;
    organizer: Org;
    venue: Venue;
    start_time: string;
    end_time: string;
}

export type EventParticipant =
    | { type: "org"; org: Org, players: Player[] } // teams with rosters
    | { type: "player"; player: Player } // individual players

export interface EventEntry {
    event: Event;
    matches: Match[];
}

// event types
export type EventType = "league" | "tournament" | "friendly" | "exhibition" | "other";

export interface Location {
    lattitude: string;
    longtitude: string;
    address: string;
    postal_code: string;
    city: string;
    state: string;
    country: string;
}

export interface Venue {
    id: string;
    name: string;
    location: Location,
    courts: Court[];
}

export interface Court {
    beacon_minor: string;
    beacons: string; // Empty string if none; could be made optional or null if needed
    court_name: string;
    court_number: string;
    id: string;
    location_id: string;
    location_venue: string;
    match_id: string | null;
    surface_type: string;
    venue_id: string;
}

export interface SetEntry {
    side_1: {
        players: Player[];
        score: number;
    };
    side_2: {
        players: Player[];
        score: number;
    };
}

export interface Match {
    id: string;
    court: Court;
    event: string;
    players: {
        side_1: Player[];
        side_2: Player[];
    };
    match_id: string;
    match_duration: string;
    video_stream_url: string;
    match_highlights_url: string;
    sets: SetEntry[];
    current_set: number;
    in_progress: boolean;
    scheduled_time: string;
}

export interface Org {
    id: string;
    name: string;
    team_name: string;
    brand_logo: string;
    live_scoring_link: string;
}

export interface Player {
    id: string;
    first_name: string;
    last_name: string;
    gender: "0" | "1" | "2" | "9"; // ISO/IEC 5218: Unknown, Male, Female, Not applicable
    info_about_me: string;
    profile_link: string;
    university: Org;
    social_media_links: {
        title: string;
        url: string;
    }[];
    related_videos: {
        title: string;
        url: string;
    }[];
    action_photos: string[];
}

export interface EventParticipantPlayer {
    event_participant_id: string;
    player_id: string;
}

export interface Beacon {
    serial_number: string;
    proximity_uuid: string;
    major: string;
    minor: string;
}
