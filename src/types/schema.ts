// Directus collection types for the SDK's `createDirectus<Schema>` generic.
//
// Relations are typed as `string | <Expanded>` because the SDK returns the raw
// FK (a uuid string) by default and only expands when `fields` requests it.

export interface Family {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface Species {
  id: string;
  name: string;
  latin_name: string | null;
  family: string | Family | null;
  plants?: (string | Plant)[] | null;
}

export interface WateringRecord {
  id: string;
  plant: string | null;
  date_created: string | null;
  user_created: string | null;
}

export interface Plant {
  id: string;
  name: string | null;
  status: string;
  species?: string | Species | null;
  location?: string | Room | null;
  watering_records?: (string | WateringRecord)[] | null;
}

export interface Schema {
  plant: Plant[];
  species: Species[];
  family: Family[];
  room: Room[];
  watering_record: WateringRecord[];
}
