export type Vertical = 'pasticceria' | 'cakedesigner' | 'gelateria';

export type ThemeName = 'atelier' | 'gelato' | 'forno';

export type Allergene =
  | 'glutine'
  | 'crostacei'
  | 'uova'
  | 'pesce'
  | 'arachidi'
  | 'soia'
  | 'latte'
  | 'frutta_a_guscio'
  | 'sedano'
  | 'senape'
  | 'sesamo'
  | 'solfiti'
  | 'lupini'
  | 'molluschi';

export type DayKey =
  | 'lunedi'
  | 'martedi'
  | 'mercoledi'
  | 'giovedi'
  | 'venerdi'
  | 'sabato'
  | 'domenica';

export interface Brand {
  name: string;
  tagline: string;
  logo: string;
}

export interface Contact {
  telefono: string;
  whatsapp: string;
  email: string;
  indirizzo: string;
  lat: number;
  lng: number;
  partitaIva: string;
}

export interface DayHours {
  giorno: DayKey;
  chiuso: boolean;
  apertura?: string;
  chiusura?: string;
}

export interface Hours {
  settimana: DayHours[];
  chiusureStraordinarie: string[];
}

export interface Socials {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  pinterest?: string;
}

export interface HeroImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Hero {
  titolo: string;
  sottotitolo: string;
  ctaPrincipale: string;
  ctaSecondaria: string;
  immagine: HeroImage;
  layout: 'split' | 'fullbleed';
}

export interface Occasion {
  id: string;
  titolo: string;
  descrizione: string;
  immagine: HeroImage;
}

export interface Category {
  id: string;
  nome: string;
  descrizione: string;
  immagine: HeroImage;
}

export interface ProductPrice {
  label: string;
  valore: string;
}

export interface Product {
  id: string;
  nome: string;
  descrizione: string;
  categoriaId: string;
  prezzo: string;
  prezzoSuPreventivo?: boolean;
  allergeni: Allergene[];
  immagine: HeroImage;
  inEvidenza: boolean;
}

export interface GalleryItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProcessStep {
  id: string;
  titolo: string;
  descrizione: string;
  immagine: HeroImage;
}

export interface Testimonial {
  id: string;
  nome: string;
  ruolo: string;
  testo: string;
}

export interface Faq {
  id: string;
  domanda: string;
  risposta: string;
}

export interface Order {
  giorniMinimiAnticipo: number;
  templateMessaggioWhatsapp: string;
}

export interface Seo {
  title: string;
  description: string;
  ogImage: string;
}

export interface SiteConfig {
  brand: Brand;
  vertical: Vertical;
  theme: ThemeName;
  contact: Contact;
  hours: Hours;
  socials: Socials;
  hero: Hero;
  occasions: Occasion[];
  categories: Category[];
  products: Product[];
  gallery: GalleryItem[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  faq: Faq[];
  order: Order;
  seo: Seo;
}
