export interface Person {
    id: string;
    name: string;
  }
  
  export interface TimeSlot {
    hour: number;
    people: Person[];
  }
  