const ProductManager = require('./ProductManager');

const productManager = new ProductManager('products.json');

productManager.getProducts()
  .then((emptyProducts) => {
    console.log(emptyProducts);
  })
  .catch((error) => {
    console.log("Error al obtener los productos:", error);
  });

const product = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
};

(async () => {
  try {
    await productManager.addProduct(product);
    const productsAfterAdding = await productManager.getProducts();
    console.log(productsAfterAdding);

    const retrievedProduct = await productManager.getProductById(1);
    console.log(retrievedProduct);

    await productManager.updateProduct(1, { description: 'Este es un producto de prueba actualizado'} , { price: 300 });
    const updatedProduct = await productManager.getProductById(1);
    console.log(updatedProduct);

    await productManager.deleteProduct(1);
    const productsAfterDeletion = await productManager.getProducts();
    console.log(productsAfterDeletion);
  } catch (error) {
    console.log("Error:", error.message);
  }
})();



