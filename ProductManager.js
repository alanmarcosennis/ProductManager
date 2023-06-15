const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.nextId = 1;
  }

  addProduct(product) {
    return new Promise((resolve, reject) => {
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        reject(new Error("Todos los campos son obligatorios"));
        return;
      }

      this.getProducts()
        .then((products) => {
          const existingProduct = products.find((p) => p.code === product.code);
          if (existingProduct) {
            reject(new Error("Ya existe un producto con el mismo código"));
            return;
          }

          const newProduct = {
            id: this.nextId++,
            ...product
          };

          products.push(newProduct);

          this.saveProducts(products)
            .then(() => {
              resolve(newProduct);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (error, data) => {
        if (error) {
          if (error.code === 'ENOENT') {
            resolve([]);
          } else {
            reject(error);
          }
          return;
        }

        try {
          const products = JSON.parse(data);
          resolve(products);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  getProductById(id) {
    return new Promise((resolve, reject) => {
      this.getProducts()
        .then((products) => {
          const product = products.find((p) => p.id === id);
          if (product) {
            resolve(product);
          } else {
            reject(new Error("Producto no encontrado"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateProduct(id, updatedFields) {
    return new Promise((resolve, reject) => {
      this.getProducts()
        .then((products) => {
          const productIndex = products.findIndex((p) => p.id === id);
          if (productIndex !== -1) {
            const updatedProduct = {
              ...products[productIndex],
              ...updatedFields
            };
            products[productIndex] = updatedProduct;

            this.saveProducts(products)
              .then(() => {
                resolve(updatedProduct);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject(new Error("Producto no encontrado"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      this.getProducts()
        .then((products) => {
          const productIndex = products.findIndex((p) => p.id === id);
          if (productIndex !== -1) {
            products.splice(productIndex, 1);

            this.saveProducts(products)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject(new Error("Producto no encontrado"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  saveProducts(products) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(products, null, 2);
      fs.writeFile(this.filePath, data, 'utf8', (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = ProductManager;


