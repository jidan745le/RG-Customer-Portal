import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FAQItem from '../components/marketplace/FAQItem';
import ProductCard from '../components/marketplace/ProductCard';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/MarketplacePage.module.css';
import apiClient from '../utils/apiClient';


const MarketplacePage = () => {
    // Get user authentication status
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const [filters, setFilters] = useState({
        vendor: [],
        topic: [],
        type: [],
        providedBy: []
    });

    const [zohoProducts, setZohoProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchZohoProducts = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/zoho/products');
                console.log('Zoho products data structure:', response.data[0]); // Log the first product to see its structure
                setZohoProducts(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch Zoho products:', err);
                setError('Failed to load products from Zoho.');
            } finally {
                setLoading(false);
            }
        };

        fetchZohoProducts();
    }, []);

    // Filter products based on selected filters
    const filteredProducts = zohoProducts.filter(product => {
        // Check if product passes all filter criteria
        if (filters.vendor.length > 0 &&
            !filters.vendor.includes(product?.Software_Vendor) &&
            !filters.vendor.includes(product?.Vendor_Name?.name)) {
            return false;
        }
        if (filters.topic.length > 0 && !filters.topic.includes(product?.Topic)) {
            return false;
        }
        if (filters.type.length > 0 && !filters.type.includes(product?.Type)) {
            return false;
        }
        if (filters.providedBy.length > 0 &&
            !filters.providedBy.includes(product?.Provided_by) &&
            !filters.providedBy.includes(product?.Owner?.name)) {
            return false;
        }
        return true;
    });

    const handleFilterChange = (category, value) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[category].includes(value)) {
                newFilters[category] = newFilters[category].filter(item => item !== value);
            } else {
                newFilters[category] = [...newFilters[category], value];
            }
            return newFilters;
        });
    };

    const faqItems = [
        {
            question: 'How Soon Will My Order Ship?',
            answer: 'Orders typically ship within 1-2 business days after payment confirmation. For expedited shipping options, please contact our customer service team.'
        },
        {
            question: 'Is There Any Warranty Exclusions?',
            answer: 'Warranty exclusions include damage from misuse, unauthorized modifications, natural disasters, and normal wear and tear. Please refer to the product documentation for complete warranty details.'
        },
        {
            question: 'Are There Any Return Exclusions?',
            answer: 'Custom-configured products, digital downloads, and opened software are not eligible for returns. All other items may be returned within 30 days in their original condition with packaging.'
        },
        {
            question: 'Will I Be Charged For A Replacement Item?',
            answer: 'Replacement items are provided free of charge for products under warranty. For items outside warranty period, replacement costs and shipping fees may apply.'
        },
        {
            question: 'How Can I Track My Orders & Payment?',
            answer: 'You can track orders and payment status by logging into your account and navigating to the "My Orders" section. Order tracking information is also sent via email once your order ships.'
        }
    ];

    const products = [
        {
            id: 1,
            name: 'Zendesk',
            logo: '/zendesk-logo.png',
            description: 'The DeepL app is a tool that allows users to translate Akeneo entities such as text & raw area attributes, attribute labels, family options, option labels, and category labels using the DeepL API.',
            price: 'FREE'
        },
        {
            id: 2,
            name: 'Magento',
            logo: '/magento-logo.png',
            description: 'The DeepL app is a tool that allows users to translate Akeneo entities such as text & raw area attributes, attribute labels, family options, option labels, and category labels using the DeepL API.',
            price: 'PAID'
        },
        {
            id: 3,
            name: 'Bynder',
            logo: '/bynder-logo.png',
            description: 'The DeepL app is a tool that allows users to translate Akeneo entities such as text & raw area attributes, attribute labels, family options, option labels, and category labels using the DeepL API.',
            price: 'FREE'
        },
        {
            id: 4,
            name: 'HubSpot',
            logo: '/hubspot-logo.png',
            description: 'The DeepL app is a tool that allows users to translate Akeneo entities such as text & raw area attributes, attribute labels, family options, option labels, and category labels using the DeepL API.',
            price: 'FREE'
        },
        {
            id: 5,
            name: 'Twilio',
            logo: '/twilio-logo.png',
            description: 'The DeepL app is a tool that allows users to translate Akeneo entities such as text & raw area attributes, attribute labels, family options, option labels, and category labels using the DeepL API.',
            price: 'FREE'
        },
        {
            id: 6,
            name: 'Intuit',
            logo: '/intuit-logo.png',
            description: 'The DeepL app is a tool that allows users to translate Akeneo entities such as text & raw area attributes, attribute labels, family options, option labels, and category labels using the DeepL API.',
            price: 'FREE'
        }
    ];

    return (
        <>
            <section className={styles.marketplaceBanner}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerText}>
                        <span className={styles.breadcrumb}>From Tools to Process Excellence</span>
                        <h2 className={styles.bannerTitle}>Marketplace & Expert Network</h2>
                        <p className={styles.bannerDescription}>
                            Find the tools & experts to streamline your product onboarding process getting the most out of your PIM, DAM & CMS investments
                        </p>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Search for..."
                                className={styles.searchInput}
                            />
                        </div>
                        {!isLoggedIn && (
                            <Link to="/" className={styles.loginButton}>LOGIN</Link>
                        )}
                    </div>
                    <div className={styles.bannerImage}>
                        <img src="/marketplace-banner.png" alt="Marketplace" />
                    </div>
                </div>
            </section>

            {!loading && <section className={styles.marketplaceContent}>
                <div className={styles.sidebarFilters}>
                    <h3 className={styles.filterTitle}>Filters</h3>

                    <div className={styles.filterSection}>
                        <h4>Vendor</h4>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('Salsify')}
                                onChange={() => handleFilterChange('vendor', 'Salsify')}
                            />
                            Salsify
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('Informatica')}
                                onChange={() => handleFilterChange('vendor', 'Informatica')}
                            />
                            Informatica
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('Microsoft')}
                                onChange={() => handleFilterChange('vendor', 'Microsoft')}
                            />
                            Microsoft
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('EPICOR')}
                                onChange={() => handleFilterChange('vendor', 'EPICOR')}
                            />
                            EPICOR
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('AKENEO')}
                                onChange={() => handleFilterChange('vendor', 'AKENEO')}
                            />
                            AKENEO
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('Contentserv')}
                                onChange={() => handleFilterChange('vendor', 'Contentserv')}
                            />
                            Contentserv
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.vendor.includes('PIMCORE')}
                                onChange={() => handleFilterChange('vendor', 'PIMCORE')}
                            />
                            PIMCORE
                        </label>
                    </div>

                    <div className={styles.filterSection}>
                        <h4>Topic</h4>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('PIM')}
                                onChange={() => handleFilterChange('topic', 'PIM')}
                            />
                            PIM
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('DAM')}
                                onChange={() => handleFilterChange('topic', 'DAM')}
                            />
                            DAM
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('CMS')}
                                onChange={() => handleFilterChange('topic', 'CMS')}
                            />
                            CMS
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('Portal')}
                                onChange={() => handleFilterChange('topic', 'Portal')}
                            />
                            Portal
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('eCom')}
                                onChange={() => handleFilterChange('topic', 'eCom')}
                            />
                            eCom
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('Print & more')}
                                onChange={() => handleFilterChange('topic', 'Print & more')}
                            />
                            Print & more
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('Syndication')}
                                onChange={() => handleFilterChange('topic', 'Syndication')}
                            />
                            Syndication
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.topic.includes('AI')}
                                onChange={() => handleFilterChange('topic', 'AI')}
                            />
                            AI
                        </label>
                    </div>

                    <div className={styles.filterSection}>
                        <h4>Owner</h4>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.providedBy.includes('RG Experience')}
                                onChange={() => handleFilterChange('providedBy', 'RG Experience')}
                            />
                            RG Experience
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.providedBy.includes('3rd Party')}
                                onChange={() => handleFilterChange('providedBy', '3rd Party')}
                            />
                            3rd Party
                        </label>
                    </div>

                    <div className={styles.filterSection}>
                        <h4>Type</h4>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.type.includes('Accelerator')}
                                onChange={() => handleFilterChange('type', 'Accelerator')}
                            />
                            Accelerator
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.type.includes('SaaS')}
                                onChange={() => handleFilterChange('type', 'SaaS')}
                            />
                            SaaS
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.type.includes('Service')}
                                onChange={() => handleFilterChange('type', 'Service')}
                            />
                            Service
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.type.includes('Data')}
                                onChange={() => handleFilterChange('type', 'Data')}
                            />
                            Data
                        </label>
                        <label className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={filters.type.includes('API')}
                                onChange={() => handleFilterChange('type', 'API')}
                            />
                            API
                        </label>
                    </div>


                </div>

                <div className={styles.productListing}>
                    {/* <h3 className={styles.productListingTitle}>Featured Products</h3>

                    <div className={styles.productGrid}>
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                logo={product.logo}
                                description={product.description}
                                price={product.price}
                            />
                        ))}
                    </div> */}

                    {/* Zoho Products Section */}
                    <h3 className={styles.productListingTitle} >Featured Products</h3>

                    {loading && <div className={styles.loadingMessage}>Loading products from Zoho...</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {!loading && !error && zohoProducts.length > 0 && (
                        <div className={styles.productGrid}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    vendor={product?.Software_Vendor || product?.Vendor_Name?.name}
                                    key={product?.id}
                                    id={product?.id}
                                    name={product?.Title_External}
                                    logo={`/api/zoho/products/${product?.id}/image`}
                                    description={product?.Sub_Title || 'No description available'}
                                    price={product?.Pricing || 'No pricing available'}
                                    topic={product?.Topic}
                                    type={product?.Type}
                                    providedBy={product?.Provided_by || product?.Owner?.name}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && !error && filteredProducts.length === 0 && zohoProducts.length > 0 && (
                        <div className={styles.emptyMessage}>
                            <div>Exciting Accelerators in the making...</div>
                            <div style={{ marginTop: '16px', fontWeight: 'bold' }}>STAY TUNED!</div>
                            <div style={{ marginTop: '16px' }}>
                                You have some great solutions to share? Submit your extension to Sales@rg-experience.com
                            </div>
                        </div>
                    )}

                    {!loading && !error && zohoProducts.length === 0 && (
                        <div className={styles.emptyMessage}>
                            <div>Exciting Accelerators in the making...</div>
                            <div style={{ marginTop: '16px', fontWeight: 'bold' }}>STAY TUNED!</div>
                            <div style={{ marginTop: '16px' }}>
                                You have some great solutions to share? Submit your extension to Sales@rg-experience.com
                            </div>
                        </div>
                    )}

                    <section className={styles.faqSection}>
                        <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
                        {faqItems.map((item, index) => (
                            <FAQItem
                                key={index}
                                question={item.question}
                                answer={item.answer}
                            />
                        ))}
                    </section>
                </div>
            </section>}
            {
                loading && <div className={styles.loadingMessage}>Loading products</div>
            }

            {/* 只有登录用户才显示FAQ部分 */}

        </>
    );
};

export default MarketplacePage;
