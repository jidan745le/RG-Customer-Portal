import { Carousel } from 'antd';
import 'antd/dist/reset.css';
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentModalImage, setCurrentModalImage] = useState(null);
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

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

    const nextImage = () => {
        if (product?.Teaser_Images && product.Teaser_Images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === product.Teaser_Images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product?.Teaser_Images && product.Teaser_Images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.Teaser_Images.length - 1 : prev - 1
            );
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    // Modal functions for screenshot viewing
    const openModal = (screenshot, index) => {
        setCurrentModalImage(screenshot);
        setCurrentModalIndex(index);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentModalImage(null);
    };

    const nextModalImage = () => {
        if (product?.App_Screenshots && product.App_Screenshots.length > 0) {
            const nextIndex = currentModalIndex === product.App_Screenshots.length - 1 ? 0 : currentModalIndex + 1;
            setCurrentModalIndex(nextIndex);
            setCurrentModalImage(product.App_Screenshots[nextIndex]);
        }
    };

    const prevModalImage = () => {
        if (product?.App_Screenshots && product.App_Screenshots.length > 0) {
            const prevIndex = currentModalIndex === 0 ? product.App_Screenshots.length - 1 : currentModalIndex - 1;
            setCurrentModalIndex(prevIndex);
            setCurrentModalImage(product.App_Screenshots[prevIndex]);
        }
    };

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
    const allFeatures = [...benefits].filter(f => f);

    return (
        <div className={styles.productDetailContainer}>
            <div className={styles.breadcrumb}>
                <Link to="/marketplace">Marketplace</Link> &gt; {product.Title_External}
            </div>

            <div className={styles.productHeader}>
                <img style={{ width: '32px', height: '32px' }} src={`/api/zoho/products/${id}/image`} alt={product.Product_Name} className={styles.productImage} />
                <h1 className={styles.productTitle}>{product.Title_External}</h1>
            </div>

            <div className={styles.productContent}>
                <div className={styles.mainContent}>
                    <div className={styles.productImageContainer}>
                        {product.Teaser_Images && product.Teaser_Images.length > 0 ? (
                            <Carousel
                                afterChange={goToImage}
                                effect="scrollx"
                                dots={true}
                                autoplay={true}
                            >
                                {product.Teaser_Images.map((image, index) => (
                                    <div key={index} className={styles.carouselItem}>
                                        <img
                                            src={`/api${image.attachment_url}`}
                                            alt={image.File_Name__s || product.Title_External || 'Product Image'}
                                            className={styles.productImage}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <img
                                src={`/api/zoho/products/${id}/image`}
                                alt={product.Title_External}
                                className={styles.productImage}
                            />
                        )}
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
                                <h2>Introduction</h2>

                                <div className={styles.productDescription}>
                                    <div dangerouslySetInnerHTML={{ __html: product?.Rich_Text_Introduction }}></div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'documentation' && (
                            <div className={styles.documentationTab}>
                                <h2>Documentation</h2>

                                {/* Product Screenshots & Video Section */}
                                {/* <div className={styles.documentationSection}>
                                    <h3>Product Screenshots & Video</h3>
                                    <p>Link to Video / Screenshots</p>
                                </div> */}

                                {/* Demo URL Section */}
                                {product.Demo_URL && (
                                    <div className={styles.documentationSection}>
                                        <h3>Demo URL</h3>
                                        <a href={`https://${product.Demo_URL}`} target="_blank" rel="noopener noreferrer" className={styles.documentationLink}>
                                            {product.Demo_URL}
                                        </a>
                                    </div>
                                )}

                                {/* Introduction PDF Section */}
                                {product.Introduction_PDF && (
                                    <div className={styles.documentationSection}>
                                        <h3>Introduction PDF</h3>
                                        <a href={`https://${product.Introduction_PDF}`} target="_blank" rel="noopener noreferrer" className={styles.documentationLink}>
                                            {product.Introduction_PDF}
                                        </a>
                                    </div>
                                )}

                                {/* App Screenshots Section */}
                                {product.App_Screenshots && product.App_Screenshots.length > 0 && (
                                    <div className={styles.documentationSection}>
                                        <h3>App Screenshots</h3>
                                        <div className={styles.screenshotsGrid}>
                                            {product.App_Screenshots.map((screenshot, index) => (
                                                <div key={index} className={styles.screenshotItem}>
                                                    <img
                                                        src={`/api${screenshot.attachment_url}`}
                                                        alt={screenshot.File_Name__s || `Screenshot ${index + 1}`}
                                                        className={styles.screenshotImage}
                                                        onClick={() => openModal(screenshot, index)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    <p className={styles.screenshotName}>{screenshot.File_Name__s}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'pricing' && (
                            <div className={styles.pricingTab}>
                                <h2>Pricing</h2>
                                <p>Contact Sales for an individual Quote <a href="mailto:Sales@rg-experience.com">Sales@rg-experience.com</a></p>
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <div className={styles.helpTab}>
                                <h2>Help</h2>
                                <p style={{
                                    lineHeight: "1.6",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "normal",
                                    margin: 0,
                                    color: "#555"
                                }}>The KB will be available within the Application. For Detailed Requests please contact
                                    <a style={{ whiteSpace: "nowrap" }}
                                        href="mailto:Support@rg-experience.com"> Support@rg-experience.com</a></p>
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
                            {/* <div className={styles.experienceBox}>
                                <div className={styles.rgLogo}>
                                    <span>rg</span>
                                </div>
                                <div className={styles.experienceText}>experience</div>
                            </div> */}

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

            {/* Modal for screenshot viewing */}
            {currentModalImage && (
                <div
                    className={styles.modal}
                    style={{
                        display: modalVisible ? 'flex' : 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 1000,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '20px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                zIndex: 1001
                            }}
                        >
                            ×
                        </button>

                        {product.App_Screenshots.length > 1 && (
                            <button
                                onClick={prevModalImage}
                                style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                            >
                                ‹
                            </button>
                        )}

                        <img
                            src={`/api${currentModalImage.attachment_url}`}
                            alt={currentModalImage.File_Name__s}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain'
                            }}
                        />

                        {product.App_Screenshots.length > 1 && (
                            <button
                                onClick={nextModalImage}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                            >
                                ›
                            </button>
                        )}

                        <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
                            {currentModalImage.File_Name__s}
                        </p>

                        {product.App_Screenshots.length > 1 && (
                            <p style={{ textAlign: 'center', margin: '5px 0', color: '#999', fontSize: '0.9rem' }}>
                                {currentModalIndex + 1} / {product.App_Screenshots.length}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div >
    );
};

export default ProductDetailPage; 