export interface BikeFromDatabase {
  id: string;
  name: string;
  price: number;
  link: string;
  image_url: string;
  category?: string;
  review_text?: string | null;
}
