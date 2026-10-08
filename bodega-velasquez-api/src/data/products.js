const products = [
  {
    id: 1,
    name: "Arroz Superior Costeño 1kg",
    description: "Arroz graneado rinde más, ideal para acompañar tus comidas diarias.",
    price: 4.50,
    stock: 45,
    categoryId: 1, // Abarrotes
    brand: "Costeño",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlXxyN-cJgPW_T6kbuekteE3YJHtiAQQR8q-kLvSIzNv1jmIq4PP7rhFQ&s=10",
    featured: true
  },
  {
    id: 2,
    name: "Aceite Vegetal Primor 900ml",
    description: "Aceite 100% puro de soya, libre de grasas trans.",
    price: 8.90,
    stock: 30,
    categoryId: 1,
    brand: "Primor",
    image: "https://delivemas.fac.pe/web/image/product.template/5094/image",
    featured: true
  },
  {
    id: 3,
    name: "Azúcar Rubia Dom conviction 1kg",
    description: "Azúcar rubia doméstica de alta calidad.",
    price: 3.80,
    stock: 50,
    categoryId: 1,
    brand: "Dulcera",
    image: "https://metroio.vtexassets.com/arquivos/ids/537885-800-auto?v=638576122599470000&width=800&height=auto&aspect=true",
    featured: false
  },
  {
    id: 4,
    name: "Fideos Tallarín Don Vittorio 500g",
    description: "Pasta de sémola de trigo duro, cocción rápida.",
    price: 2.70,
    stock: 40,
    categoryId: 1,
    brand: "Don Vittorio",
    image: "https://miamarket.pe/assets/uploads/15efe2d1ec13cb2c2e787203792ee37d.png",
    featured: false
  },
  {
    id: 5,
    name: "Inca Kola 1.5L Retornable",
    description: "La bebida de sabor nacional. Servir bien fría.",
    price: 5.50,
    stock: 25,
    categoryId: 2, // Bebidas
    brand: "Inca Kola",
    image: "https://tse3.mm.bing.net/th/id/OIP.dUmGnVM_VVDQfm4C8gT72AHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    featured: true
  },
  {
    id: 6,
    name: "Coca-Cola Zero 2.25L",
    description: "Gaseosa sin azúcar con todo el sabor original.",
    price: 7.80,
    stock: 20,
    categoryId: 2,
    brand: "Coca-Cola",
    image: "https://miamarket.pe/assets/uploads/f6c832316f9598786bd6d839185e6bd4.jpg",
    featured: false
  },
  {
    id: 7,
    name: "Agua Mineral San Luis 2.5L",
    description: "Agua de mesa sin gas, perfecta para hidratar a la familia.",
    price: 3.50,
    stock: 35,
    categoryId: 2,
    brand: "San Luis",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3yHIddBf3E94rJfd_rgCqhQ7ePVM2cuEe9I7YTbuidZAJo_T2mPhXfFc&s=10",
    featured: false
  },
  {
    id: 8,
    name: "Leche Evaporada Gloria Azul 400g",
    description: "Leche entera concentrada enriquecida con vitaminas A y D.",
    price: 4.20,
    stock: 60,
    categoryId: 3, // Lácteos
    brand: "Gloria",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWfvgIn-H2fLQ6mt8CIWAR5PW7Ik6OFD9pojQzAFgkTF2yGJPnAqMLXX4r&s=10",
    featured: true
  },
  {
    id: 9,
    name: "Yogurt Griego Gloria Vainilla 1kg",
    description: "Yogurt aflanado alto en proteínas y de gran textura.",
    price: 9.50,
    stock: 15,
    categoryId: 3,
    brand: "Gloria",
    image: "https://tb-static.uber.com/prod/image-proc/processed_images/4eaba71cc8aafb48fe2cce1b600d1753/957777de4e8d7439bef56daddbfae227.jpeg",
    featured: false
  },
  {
    id: 10,
    name: "Mantequilla Laive con Sal 200g",
    description: "Mantequilla elaborada con pura crema de leche fresca.",
    price: 6.20,
    stock: 18,
    categoryId: 3,
    brand: "Laive",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLq0joPYqnI7a-uQdZJ39xCjqYvYbjRTDLZefCMCRxMRO50Y1rj71qkQ4h&s=10",
    featured: false
  },
  {
    id: 11,
    name: "Papas Lays Clásicas 160g",
    description: "Hojuelas de papa frita crujientes con un toque de sal.",
    price: 5.80,
    stock: 22,
    categoryId: 4, // Snacks
    brand: "Lays",
    image: "https://kyodai.com.pe/market/wp-content/uploads/2020/05/7758574001574.jpg",
    featured: true
  },
  {
    id: 12,
    name: "Galletas Casino Menta Pack 6 unidades",
    description: "Galletas rellenas sabor a menta con chocolate.",
    price: 3.50,
    stock: 30,
    categoryId: 4,
    brand: "Sayón",
    image: "https://miamarket.pe/assets/uploads/thumbs/6e4db7e158acb6ad6ac4a8960ba6ae21.png",
    featured: false
  },
  {
    id: 13,
    name: "Detergente Bolívar Multiacción 800g",
    description: "Detergente en polvo con suavizante y aroma floral.",
    price: 8.50,
    stock: 14,
    categoryId: 5, // Limpieza
    brand: "Bolívar",
    image: "https://www.utimax.pe/img/p/2/3/6/7/2367-thickbox_default.jpg",
    featured: false
  },
  {
    id: 14,
    name: "Lavavajillas Sapolio Limón 900g",
    description: "Pasta lavavajillas cortagrasa concentrada.",
    price: 6.90,
    stock: 25,
    categoryId: 5,
    brand: "Sapolio",
    image: "https://corporacionliderperu.com/53333-large_default/sapolio-lavavajilla-pote-x-800-gr-limon.jpg",
    featured: false
  },
  {
    id: 15,
    name: "Jabón de Tocador Camay 125g",
    description: "Jabón humectante con fragancia a rosas francesas.",
    price: 3.20,
    stock: 40,
    categoryId: 6, // Cuidado Personal
    brand: "Camay",
    image: "https://montenegro.com.pe/Images/Product/0000008030.jpg",
    featured: false
  },
  {
    id: 16,
    name: "Shampoo Head & Shoulders Limpieza Renovadora 375ml",
    description: "Fórmula control caspa con sensación fresca.",
    price: 16.50,
    stock: 10,
    categoryId: 6,
    brand: "Head & Shoulders",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAbOqpC9QWUzVuYoQJRbr4NSPMn9-3s_0pGP2trwfRDTVC-WdE8BXCVMJS&s=10",
    featured: false
  },
  {
    id: 17,
    name: "Atún Filete en Aceite Primor 170g",
    description: "Lomo de atún fresco en aceite vegetal, listo para consumir.",
    price: 5.90,
    stock: 35,
    categoryId: 7, // Conservas
    brand: "Primor",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCPtTjaP3N5XQZEkmzXjRK_QEN-irLVttScut7nCvjVw&s=10",
    featured: true
  },
  {
    id: 18,
    name: "Duraznos en Almíbar Compass 820g",
    description: "Mitades de duraznos seleccionados en almíbar denso.",
    price: 10.50,
    stock: 12,
    categoryId: 7,
    brand: "Compass",
    image: "https://metroio.vtexassets.com/arquivos/ids/307889-800-auto?v=638179486551700000&width=800&height=auto&aspect=true",
    featured: false
  },
  {
    id: 19,
    name: "Pan de Molde Blanco Bimbo Grande 650g",
    description: "Pan suave enriquecido con calcio y vitaminas.",
    price: 8.20,
    stock: 15,
    categoryId: 8, // Panadería
    brand: "Bimbo",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLulqJoj6QpuD34A-3o0O9laBTYPhsLWbok06Jszj-uYKpdpdJbwRhi-A&s=10",
    featured: false
  },
  {
    id: 20,
    name: "Tostadas Clásicas Ricoltada 160g",
    description: "Tostadas horneadas crocantes para el desayuno.",
    price: 3.90,
    stock: 28,
    categoryId: 8,
    brand: "Bimbo",
    image: "https://wongfood.vtexassets.com/arquivos/ids/831911/Tostadas-Cl-sicas-Cuisine-Co-140g-1-221465.jpg?v=639149170030830000",
    featured: false
  }
];

module.exports = products;  