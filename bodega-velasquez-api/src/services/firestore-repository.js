const { db } = require('../firebase');

const collection = (name) => db.collection(name);

const normalizeValue = (value) => {
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (!value || typeof value !== 'object') return value;
  if (typeof value.path === 'string' && typeof value.id === 'string' && value.firestore) return value.path;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, normalizeValue(nestedValue)]));
};

const serializeDocument = (document) => {
  const data = normalizeValue(document.data());
  return { ...data, id: data.id ?? document.id };
};

const listDocuments = async (name) => {
  const snapshot = await collection(name).get();
  return snapshot.docs.map(serializeDocument);
};

const getDocument = async (name, id) => {
  const document = await collection(name).doc(String(id)).get();
  return document.exists ? serializeDocument(document) : null;
};

const createDocument = async (name, data, id) => {
  const reference = id == null ? collection(name).doc() : collection(name).doc(String(id));
  const record = { ...data, id: reference.id };
  await reference.create(record);
  return record;
};

const setDocument = async (name, id, data) => {
  const reference = collection(name).doc(String(id));
  const record = { ...data, id: String(id) };
  await reference.set(record);
  return record;
};

const updateDocument = async (name, id, data) => {
  const reference = collection(name).doc(String(id));
  const existing = await reference.get();
  if (!existing.exists) return null;
  const record = { ...data, id: String(id) };
  await reference.set(record);
  return record;
};

const deleteDocument = async (name, id) => {
  const reference = collection(name).doc(String(id));
  const existing = await reference.get();
  if (!existing.exists) return null;
  const record = serializeDocument(existing);
  await reference.delete();
  return record;
};

const nextNumericId = async (name) => {
  const snapshot = await collection(name).get();
  return snapshot.docs.reduce((highest, document) => {
    const id = Number(document.data().legacyId ?? document.id);
    return Number.isInteger(id) ? Math.max(highest, id) : highest;
  }, 0) + 1;
};

module.exports = {
  collection,
  normalizeValue,
  serializeDocument,
  listDocuments,
  getDocument,
  createDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  nextNumericId
};
