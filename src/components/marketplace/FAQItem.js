import React, { useState } from 'react';
import styles from '../../styles/marketplace/FAQItem.module.css';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
            <div className={styles.questionRow} onClick={toggleAccordion}>
                <div className={styles.questionContent}>
                    <span className={styles.arrowIcon}>
                        {isOpen ? '▼' : '▶'}
                    </span>
                    <h4 className={styles.question}>{question}</h4>
                </div>
                <span className={styles.expandIcon}>
                    {isOpen ? '−' : '+'}
                </span>
            </div>
            {isOpen && (
                <div className={styles.answerContainer}>
                    <p className={styles.answer}>{answer}</p>
                </div>
            )}
        </div>
    );
};

export default FAQItem; 