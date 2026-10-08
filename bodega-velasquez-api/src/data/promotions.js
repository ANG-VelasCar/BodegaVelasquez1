const promotions = [
  {
    id: 1,
    title: "Combazo Canasta Básica",
    description: "Llévate Arroz Costeño 1kg + Aceite Primor con 10% de descuento directo.",
    discount: 10,
    productIds: [1, 2],
    active: true,
    bannerUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
  },
  {
    id: 2,
    title: "Refresco Familiar de Fin de Semana",
    description: "Compra 2 Inca Kolas de 1.5L y obtén 15% de descuento en la segunda unidad.",
    discount: 15,
    productIds: [5],
    active: true,
    bannerUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80"
  },
  {
    id: 3,
    title: "Desayuno Nutritivo Gloria",
    description: "Leche Evaporada Gloria + Yogurt Griego con precio especial de temporada.",
    discount: 12,
    productIds: [8, 9],
    active: true,
    bannerUrl: "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=800&q=80"
  }
];

module.exports = promotions;