// Temporary in-memory database
let productsDB = [
  {
    id: "1",
    name: "iPhone 15",
    price: 1200,
    stock: 10,
  },
  {
    id: "2",
    name: "Samsung S24",
    price: 999,
    stock: 5,
  },
];

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const ProductsService = {
  async getAll() {
    await delay(300);
    return productsDB;
  },

  async create(product) {
    await delay(300);
    const newProduct = { id: Date.now().toString(), ...product };
    productsDB.push(newProduct);
    return newProduct;
  },

  async update(id, updated) {
    await delay(300);
    productsDB = productsDB.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    return productsDB.find((p) => p.id === id);
  },

  async delete(id) {
    await delay(300);
    productsDB = productsDB.filter((p) => p.id !== id);
    return true;
  },
};
