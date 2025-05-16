import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles/ProductDetailPage.module.css';
import apiClient from '../utils/apiClient';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/zoho/products/${id}`);
                setProduct(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch product details:', err);
                setError('Failed to load product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    if (loading) {
        return <div className={styles.loadingContainer}>Loading product details...</div>;
    }

    if (error || !product) {
        return <div className={styles.errorContainer}>{error || 'Product not found'}</div>;
    }

    // 处理产品特性列表
    const features = product.Features ?
        product.Features.split('\n').filter(item => item.trim()) :
        ['No features available'];

    return (
        <div className={styles.productDetailContainer}>
            <div className={styles.breadcrumb}>
                <Link to="/marketplace">Marketplace</Link> &gt; {product.Product_Name}
            </div>

            <div className={styles.productHeader}>
                <h1 className={styles.productTitle}>{product.Product_Name}</h1>
            </div>

            <div className={styles.productContent}>
                <div className={styles.productImageSection}>
                    <div className={styles.productImageContainer}>
                        <img
                            src={`/api/zoho/products/${id}/image`}
                            alt={product.Product_Name}
                            className={styles.productImage}

                        />
                    </div>
                    <div className={styles.productActions}>
                        <button className={styles.requestAccessButton}>REQUEST ACCESS</button>
                        <div className={styles.productMeta}>
                            <p>Updated on: {new Date().toLocaleDateString()}</p>
                            <p>Published: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.productDetailsSection}>
                    <div className={styles.tabsContainer}>
                        <div
                            className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </div>
                        <div
                            className={`${styles.tab} ${activeTab === 'documentation' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('documentation')}
                        >
                            Documentation
                        </div>
                        <div
                            className={`${styles.tab} ${activeTab === 'pricing' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('pricing')}
                        >
                            Pricing
                        </div>
                        <div
                            className={`${styles.tab} ${activeTab === 'help' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('help')}
                        >
                            Help
                        </div>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'overview' && (
                            <div className={styles.overviewTab}>
                                <h2>Features</h2>
                                <ul className={styles.featuresList}>
                                    {features.map((feature, index) => (
                                        <li key={index} className={styles.featureItem}>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className={styles.vendorInfo}>
                                    <h3>Third-Party software name: {product.Vendor_Name?.name || 'Unknown'}</h3>
                                    <p>Price: {product.Pricing || 'Contact for pricing'}</p>

                                    <div className={styles.vendorDetails}>
                                        <div className={styles.experienceBox}>
                                            <div className={styles.rgExperience}>
                                                <span>By {product.Vendor_Name?.name || 'Vendor'}</span>
                                                <div className={styles.experienceType}>
                                                    {product.Experience_Type || 'Mixed'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.productDescription}>
                                    <h3>Introduction</h3>
                                    <p>{product.Description || 'No description available.'}</p>

                                    {product.Additional_Info && (
                                        <>
                                            <h3>Additional Information</h3>
                                            <p>{product.Additional_Info}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'documentation' && (
                            <div className={styles.documentationTab}>
                                <h2>Documentation</h2>
                                <p>Documentation for this product will be available soon.</p>
                            </div>
                        )}

                        {activeTab === 'pricing' && (
                            <div className={styles.pricingTab}>
                                <h2>Pricing</h2>
                                <p>Pricing: {product.Pricing || 'Contact for pricing details'}</p>
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <div className={styles.helpTab}>
                                <h2>Help & Support</h2>
                                <p>For support regarding this product, please contact the vendor directly.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage; 