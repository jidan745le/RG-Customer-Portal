import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/Logo.png';
import styles from '../../styles/marketplace/ProductCard.module.css';

const ProductCard = ({ name, logo, description, price, vendor, id, topic, type, providedBy }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div className={`${styles.card}`}>
            <div className={styles.logoSection}>
                <img src={logo} alt={name} className={styles.logo} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = logoImage;
                }} />
            </div>

            <div className={styles.contentSection}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.productName}>{name}</h3>
                    <span className={styles.price}>{price}</span>
                </div>

                <div className={styles.vendor}>
                    By {providedBy || 'Unknown'}
                </div>

                <div className={styles.tagContainer}>
                    {vendor && <span className={styles.tag}>{vendor}</span>}
                    {topic && <span className={styles.tag}>{topic}</span>}
                    {type && <span className={styles.tag}>{type}</span>}
                </div>

                <div className={styles.cardBody}>
                    <p className={styles.description}>{description}</p>
                </div>

                <div className={styles.cardFooter}>
                    <button
                        className={styles.learnMoreButton}
                        onClick={handleViewDetails}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard; 