import api from './api';

class ProductService {
    getProducts() {
        return api.get('/products');
    }

    createProduct(product) {
        return api.post('/products', product);
    }

    updateProduct(id, product) {
        return api.put(`/products/${id}`, product);
    }

    deleteProduct(id) {
        return api.delete(`/products/${id}`);
    }
}

const productService = new ProductService();
export default productService;
