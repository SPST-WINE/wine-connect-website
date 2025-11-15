// components/korea/wineriesKorea.ts

export type KoreaWinery = {
  id: string;
  name: string;
  region: string;
  focus: string;
  styles?: string[];
};

export const KOREA_WINERIES: KoreaWinery[] = [
  {
    id: "podere-del-trullo",
    name: "Podere del Trullo",
    region: "Puglia",
    focus: "High-altitude Pinot Noir and expressive Mediterranean reds.",
    styles: ["Pinot Noir", "Rosato Pinot", "Southern reds"],
  },
  {
    id: "cantina-salice-salentino",
    name: "Cantina Salice Salentino",
    region: "Puglia",
    focus: "Authentic Negroamaro expressions with strong Salento identity.",
    styles: ["Negroamaro", "Salice Salentino DOC", "Rosato"],
  },
  {
    id: "nativ",
    name: "NATIV",
    region: "Campania",
    focus: "Iconic native-variety wines from volcanic soils.",
    styles: ["Aglianico", "Fiano", "Greco"],
  },
  {
    id: "tenute-girolamo",
    name: "Tenute Girolamo",
    region: "Puglia",
    focus: "Elegant, modern wines combining tradition and innovation.",
    styles: ["Primitivo", "Negroamaro", "Local whites"],
  },
  {
    id: "cincinelli",
    name: "Cincinelli",
    region: "Tuscany",
    focus: "Artisan Tuscan wines driven by Sangiovese.",
    styles: ["Sangiovese", "Chianti-style reds", "Tuscan blends"],
  },
  {
    id: "villa-prandone",
    name: "Villa Prandone",
    region: "Marche",
    focus: "Powerful hillside wines with modern character.",
    styles: ["Montepulciano", "Pecorino", "Rosso blends"],
  },
  {
    id: "bosco-del-sasso",
    name: "Bosco del Sasso",
    region: "Lombardy",
    focus: "Territorial reds: Buttafuoco and cool-climate Pinot Noir.",
    styles: ["Buttafuoco", "Pinot Noir", "Metodo Classico"],
  },
  {
    id: "baglio-di-pianetto",
    name: "Baglio di Pianetto",
    region: "Sicily",
    focus: "Organic, high-altitude Sicilian wines with elegance.",
    styles: ["Insolia", "Nero d’Avola", "White blends"],
  },
];
