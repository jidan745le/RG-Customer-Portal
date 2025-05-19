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

    // 从产品描述中提取Features
    const extractFeatures = (text) => {
        if (!text) return [];

        // 尝试定位Features部分
        const featuresIndex = text.indexOf('Features');
        if (featuresIndex === -1) return [];

        // 提取Features部分后的文本
        const featuresText = text.substring(featuresIndex);
        // 找到下一个主要部分（如果有）
        const nextSectionIndex = featuresText.substring(10).search(/\n[A-Za-z]+\n/);

        // 提取Features列表
        const featuresSection = nextSectionIndex !== -1
            ? featuresText.substring(0, nextSectionIndex + 10)
            : featuresText;

        // 分割成列表项
        return featuresSection
            .split('•\t')
            .slice(1) // 跳过第一项（标题）
            .map(item => item.trim())
            .filter(item => item); // 移除空项
    };

    // 解析Benefits字段
    const parseBenefits = (benefitsText) => {
        if (!benefitsText) return [];

        // 处理可能的格式：以"•\t"或"-"开头的列表
        if (benefitsText.includes('•\t')) {
            return benefitsText
                .split('•\t')
                .map(item => item.trim())
                .filter(item => item);
        } else if (benefitsText.includes('- ')) {
            return benefitsText
                .split('- ')
                .map(item => item.trim())
                .filter(item => item);
        } else if (benefitsText.includes('\n')) {
            // 如果包含换行符但没有特定的列表标记，尝试按行分割
            return benefitsText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('Benefits'));
        }

        // 如果没有明确的分隔符，将整个文本作为一个项目返回
        return [benefitsText.trim()];
    };

    // 处理产品特性列表
    const features = extractFeatures(product.Description);
    const benefits = parseBenefits(product.Benefits);

    // 整合所有特性
    const allFeatures = [...benefits, ...features].filter(f => f);

    return (
        <div className={styles.productDetailContainer}>
            <div className={styles.breadcrumb}>
                <Link to="/marketplace">Marketplace</Link> &gt; {product.Product_Name}
            </div>

            <div className={styles.productHeader}>
                <img style={{ width: '32px', height: '32px' }} src={`/api/zoho/products/${id}/image`} alt={product.Product_Name} className={styles.productImage} />
                <h1 className={styles.productTitle}>{product.Product_Name}</h1>
            </div>

            <div className={styles.productContent}>
                <div className={styles.mainContent}>
                    <div className={styles.productImageContainer}>
                        <img
                            src={`/api/zoho/products/${id}/image`}
                            alt={product.Product_Name}
                            className={styles.productImage}

                        />
                    </div>
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
                                <div className={styles.productDescription}>
                                    <h3>Introduction</h3>
                                    <p>{product.Description ? product.Description.split('Features')[0].trim() : 'No description available.'}</p>

                                    {product.Sub_Title && (
                                        <div className={styles.subTitle}>
                                            <p>{product.Sub_Title}</p>
                                        </div>
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
                                <p>Type: {product.Type || 'Not specified'}</p>
                                <p>Pricing Model: {product.Pricing || 'Contact for pricing details'}</p>
                                {product.Unit_Price !== undefined && product.Unit_Price !== null && (
                                    <p>Unit Price: ${product.Unit_Price}</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <div className={styles.helpTab}>
                                <h2>Help & Support</h2>
                                <p>For support regarding this product, please contact the vendor directly.</p>
                                {product.Owner && product.Owner.email && (
                                    <p>Contact: <a href={`mailto:${product.Owner.email}`}>{product.Owner.email}</a></p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧侧边栏 */}
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarBlock}>
                        <button className={styles.requestAccessButton}>REQUEST ACCESS</button>

                        <div className={styles.productMeta}>
                            <p>Updated on: {product.Modified_Time ? new Date(product.Modified_Time).toLocaleDateString() : ''}</p>
                            <p>Published: {product.Created_Time ? new Date(product.Created_Time).toLocaleDateString() : ''}</p>
                        </div>
                    </div>

                    <div className={styles.sidebarBlock}>
                        <h2 className={styles.sidebarTitle}>Features</h2>
                        <ul className={styles.featuresList}>
                            {allFeatures.length > 0 ? (
                                allFeatures.map((feature, index) => (
                                    <li key={index} className={styles.featureItem}>
                                        {feature}
                                    </li>
                                ))
                            ) : (
                                <li className={styles.featureItem}>
                                    No features available
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className={styles.sidebarBlock}>
                        <div className={styles.vendorInfo}>
                            <h3>Third-Party software name: {product.Software_Vendor || product.Vendor_Name?.name || ''}</h3>
                            <p>Price: {product.Unit_Price === 0 ? 'Free' : (product.Pricing || '')}</p>
                        </div>

                        <div className={styles.vendorDetails}>
                            <div className={styles.experienceBox}>
                                <div className={styles.rgLogo}>
                                    <span>rg</span>
                                </div>
                                <div className={styles.experienceText}>experience</div>
                            </div>

                            <div className={styles.vendorName}>By {product.Provided_by || product.Vendor_Name?.name || ''}</div>

                            <div className={styles.tagContainer}>
                                {product.Topic && <span className={styles.tag}>{product.Topic}</span>}
                                {product.Type && <span className={styles.tag}>{product.Type}</span>}
                                {product.Product_Category && <span className={styles.tag}>{product.Product_Category}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage; 