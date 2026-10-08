const customers = require('../data/customers');

const getCustomers = (req, res) => {
  res.json({ success: true, count: customers.length, data: customers });
};

const getCustomerById = (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find(c => c.id === id);
  if (!customer) {
    return res.status(404).json({ success: false, message: "Cliente no encontrado" });
  }
  res.json({ success: true, data: customer });
};

module.exports = { getCustomers, getCustomerById };