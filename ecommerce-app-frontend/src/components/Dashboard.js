import React, { useState, useEffect, useContext } from 'react';
import ProductService from '../services/product.service';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext);
    
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', description: '', price: '', imageUrl: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        ProductService.getProducts().then(
            response => setProducts(response.data),
            error => console.error(error)
        );
    };

    const isAdmin = user && user.role === 'ROLE_ADMIN';

    const handleDelete = (id) => {
        if(window.confirm('Delete this product?')) {
            ProductService.deleteProduct(id).then(() => {
                fetchProducts();
            });
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing && currentProduct.id) {
            ProductService.updateProduct(currentProduct.id, currentProduct).then(() => {
                setIsEditing(false);
                setCurrentProduct({ id: null, name: '', description: '', price: '', imageUrl: '' });
                fetchProducts();
            });
        } else {
            ProductService.createProduct(currentProduct).then(() => {
                setCurrentProduct({ id: null, name: '', description: '', price: '', imageUrl: '' });
                fetchProducts();
            });
        }
    };

    return (
        <div className="ama-dashboard">
            {isAdmin && (
                <div className="ama-admin-panel">
                    <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="ama-admin-form-group">
                            <input type="text" className="ama-admin-input" placeholder="Name" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} required />
                            <input type="text" className="ama-admin-input" placeholder="Description" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} />
                        </div>
                        <div className="ama-admin-form-group">
                            <input type="number" step="0.01" className="ama-admin-input" placeholder="Price" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} required />
                            <input type="url" className="ama-admin-input" placeholder="Image URL (optional)" value={currentProduct.imageUrl || ''} onChange={e => setCurrentProduct({...currentProduct, imageUrl: e.target.value})} />
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button type="submit" className="ama-admin-submit">{isEditing ? 'Update' : 'Add'}</button>
                            {isEditing && <button type="button" className="ama-admin-btn" style={{flex: 0, padding: '8px 20px'}} onClick={() => {setIsEditing(false); setCurrentProduct({id:null, name:'', description:'', price:'', imageUrl:''})}}>Cancel</button>}
                        </div>
                    </form>
                </div>
            )}

            <div className="ama-product-grid">
                {products.length === 0 ? <p>No products available.</p> : products.map(product => (
                    <div className="ama-product-card" key={product.id}>
                        <div className="ama-product-image">
                            <img
                              src={product.imageUrl || `https://placehold.co/400x400/ffffff/0f172a?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/400x400/ffffff/0f172a?text=Error`;
                              }}
                            />
                        </div>
                        <div className="ama-product-info">
                            <h3 className="ama-product-title">{product.name}</h3>
                            
                            <div className="ama-rating">
                                <span className="ama-stars">★★★★☆</span>
                                <span>{Math.floor(Math.random() * 500) + 50}</span>
                            </div>

                            <div className="ama-price-block">
                                <span className="ama-symbol">$</span>
                                <span className="ama-whole">{Math.floor(product.price)}</span>
                                <span className="ama-fraction">{((product.price % 1) * 100).toFixed(0).padStart(2,'0')}</span>
                            </div>

                            <div className="ama-prime">
                                <span className="ama-prime-check">✓</span> Next-Day Delivery
                            </div>
                            
                            <button className="ama-add-cart">Add to Cart</button>

                            {isAdmin && (
                                <div className="ama-admin-actions">
                                    <button onClick={() => handleEdit(product)} className="ama-admin-btn">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="ama-admin-btn delete">Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
