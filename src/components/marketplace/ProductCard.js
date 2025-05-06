import React from 'react';
import styles from '../../styles/marketplace/ProductCard.module.css';

const ProductCard = ({ name, logo, description, price }) => {

    return (
        <div className={`${styles.card}`}>
            <div className={styles.cardHeader}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt={name} className={styles.logo} />
                </div>
                <div className={styles.headerInfo}>
                    <span className={styles.appLabel}>DeepL App</span>
                    <span className={`${styles.priceLabel} ${price === 'FREE' ? styles.free : styles.paid}`}>{price}</span>
                </div>
            </div>
            <div className={styles.cardBody}>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.cardFooter}>
                <button className={styles.learnMoreButton}>Learn More</button>
            </div>
        </div>
    );
};

export default ProductCard; 