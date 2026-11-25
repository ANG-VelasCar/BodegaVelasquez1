require('dotenv').config();
const { db } = require('../firebase');
const products = require('../data/products');
const categories = require('../data/categories');
const customers = require('../data/customers');
const orders = require('../data/orders');
const promotions = require('../data/promotions');

const seedCollections = async () => {
  const collections = [
    ['categories', categories.map(category => [String(category.id), category])],
    ['products', products.map(product => [String(product.id), {
      ...product,
      active: true,
      categoryRef: db.collection('categories').doc(String(product.categoryId))
    }])],
    ['customers', customers.map(customer => [String(customer.id), {
      ...customer,
      emailNormalized: customer.email.toLocaleLowerCase(),
      active: true,
      createdAt: new Date().toISOString()
    }])],
    ['promotions', promotions.map(promotion => [String(promotion.id), {
      ...promotion,
      productIds: promotion.productIds.map(String),
      productRefs: promotion.productIds.map(id => db.collection('products').doc(String(id)))
    }])],
    ['orders', orders.map(order => [String(order.id), {
      ...order,
      customerId: String(order.customerId),
      customerRef: db.collection('customers').doc(String(order.customerId)),
      products: order.products.map(item => ({
        ...item,
        productId: String(item.productId),
        productRef: db.collection('products').doc(String(item.productId))
      }))
    }])]
  ];

  for (const [name] of collections) {
    const snapshot = await db.collection(name).limit(1).get();
    if (!snapshot.empty) {
      throw new Error(`La colección "${name}" ya contiene datos. No se modificó ninguna colección.`);
    }
  }

  const batch = db.batch();
  for (const [name, records] of collections) {
    for (const [id, data] of records) {
      batch.create(db.collection(name).doc(id), data);
    }
  }
  await batch.commit();

  return collections.map(([name, records]) => `${name}: ${records.length}`).join('\n');
};

seedCollections()
  .then((result) => {
    console.log(`Datos iniciales guardados en Firestore (${process.env.FIREBASE_PROJECT_ID}):\n${result}`);
    process.exitCode = 0;
  })
  .catch((error) => {
    console.error('No se pudo completar la carga inicial de Firestore:', error);
    process.exitCode = 1;
  });
