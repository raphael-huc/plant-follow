// Directus collection types for the SDK's `createDirectus<Schema>` generic.

export interface Plant {
  id: number;
  name: string;
}

export interface Schema {
  plant: Plant[];
}
