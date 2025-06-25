-- LOCATIONS
CREATE TABLE locations (
                           id TEXT PRIMARY KEY,
                           latitude TEXT,
                           longitude TEXT,
                           address TEXT,
                           postal_code TEXT,
                           city TEXT,
                           state TEXT,
                           country TEXT
);

-- ORGS
CREATE TABLE orgs (
                      id TEXT PRIMARY KEY,
                      name TEXT NOT NULL,
                      team_name TEXT,
                      brand_logo TEXT,
                      live_scoring_link TEXT,
                      location_id TEXT REFERENCES locations(id)
);

-- PLAYERS
CREATE TABLE players (
                         id TEXT PRIMARY KEY,
                         first_name TEXT,
                         last_name TEXT,
                         gender TEXT CHECK (gender IN ('0','1','2','9')),
                         info_about_me TEXT,
                         profile_link TEXT,
                         university_id TEXT REFERENCES orgs(id)
);

-- EVENTS
CREATE TABLE events (
                        id TEXT PRIMARY KEY,
                        event_type TEXT CHECK (event_type IN ('league', 'tournament', 'friendly', 'exhibition', 'other')),
                        event_name TEXT NOT NULL,
                        tournament_director TEXT,
                        league TEXT,
                        prize TEXT,
                        description TEXT,
                        organizer_id TEXT REFERENCES orgs(id),
                        venue_id TEXT REFERENCES venues(id),
                        start_time TEXT,
                        end_time TEXT
);

-- VENUES
CREATE TABLE venues (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        location_id TEXT REFERENCES locations(id),
                        beacon_major TEXT UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_venues_beacon_major ON venues(beacon_major);

-- COURTS
CREATE TABLE courts (
                        id TEXT PRIMARY KEY,
                        match_id TEXT,
                        location_venue TEXT,
                        court_number TEXT,
                        court_name TEXT,
                        surface_type TEXT,
                        venue_id TEXT REFERENCES venues(id),
                        location_id TEXT REFERENCES locations(id),
                        beacon_minor TEXT UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_courts_beacon_minor ON courts(beacon_minor);

-- EVENT PARTICIPANTS
CREATE TABLE event_participants (
                                    id TEXT PRIMARY KEY,
                                    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
                                    type TEXT CHECK (type IN ('org', 'player')) NOT NULL,
                                    org_id TEXT REFERENCES orgs(id),
                                    player_id TEXT REFERENCES players(id)
);

-- PARTICIPANT PLAYERS (for teams)
CREATE TABLE event_participant_players (
                                           event_participant_id TEXT NOT NULL,
                                           player_id TEXT NOT NULL,
                                           PRIMARY KEY (event_participant_id, player_id),
                                           FOREIGN KEY (event_participant_id) REFERENCES event_participants(id) ON DELETE CASCADE,
                                           FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- BEACONS
CREATE TABLE beacons (
                         serial_number TEXT PRIMARY KEY,
                         proximity_uuid TEXT NOT NULL,
                         major TEXT NOT NULL,
                         minor TEXT NOT NULL,
                         FOREIGN KEY (major) REFERENCES venues(beacon_major) ON DELETE CASCADE,
                         FOREIGN KEY (minor) REFERENCES courts(beacon_minor) ON DELETE CASCADE
);

-- BEACON TRIGGERS
CREATE TRIGGER validate_beacon_major_exists
    BEFORE INSERT ON beacons
    WHEN NOT EXISTS (
        SELECT 1 FROM venues WHERE beacon_major = NEW.major
    )
BEGIN
    SELECT RAISE(ABORT, 'beacon.major must reference a valid venue beacon_major');
END;

CREATE TRIGGER validate_beacon_minor_exists
    BEFORE INSERT ON beacons
    WHEN NOT EXISTS (
        SELECT 1 FROM courts WHERE beacon_minor = NEW.minor
    )
BEGIN
    SELECT RAISE(ABORT, 'beacon.minor must reference a valid court beacon_minor');
END;

CREATE TRIGGER validate_beacon_major_range
    BEFORE INSERT ON beacons
    WHEN (CAST(NEW.major AS INTEGER) < 0 OR CAST(NEW.major AS INTEGER) > 65535)
BEGIN
    SELECT RAISE(ABORT, 'beacon.major must be between 0 and 65535');
END;

CREATE TRIGGER validate_beacon_minor_range
    BEFORE INSERT ON beacons
    WHEN (CAST(NEW.minor AS INTEGER) < 0 OR CAST(NEW.minor AS INTEGER) > 65535)
BEGIN
    SELECT RAISE(ABORT, 'beacon.minor must be between 0 and 65535');
END;
