const orders = [
  {
    id: 1,
    customerId: 1,
    customerName: "Carlos Mendoza",
    customerEmail: "carlos.mendoza@email.com",
    customerPhone: "987654321",
    products: [
      { productId: 1, quantity: 2, unitPrice: 4.50 },
      { productId: 5, quantity: 1, unitPrice: 5.50 }
    ],
    total: 14.50,
    status: "Entregado",
    createdAt: "2026-10-01T10:30:00Z"
  }
];

module.exports = orders;