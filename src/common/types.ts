export interface Seller {
  name: string;
  price: number;
  url: string;
}

export interface BikeSpecifications {
  batteryCapacity: string;
  motorPower: string;
  maxSpeed: string;
  range: string;
  weight: string;
  chargingTime: string;
}

export interface Bike {
  id: string;
  name: string;
  category: keyof typeof Category;
  price: number;
  imgSrc: string;
  specifications?: BikeSpecifications;
  sellers?: Seller[];
}

export enum Category {
  all = "all",
  road = "road",
  mountain = "mountain",
  bmx = "bmx",
}

export interface FilterState {
  currentCategory: string;
  maxPrice: number;
}
