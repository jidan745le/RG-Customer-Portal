import React, { useState } from 'react';
import styles from '../../styles/dashboard/FAQ.module.css';

// 模拟数据
const faqData = [
    {
        id: 1,
        question: 'How Soon Will My Order Ship?',
        answer: 'Orders typically ship within 1-2 business days. You will receive a shipping confirmation email with tracking information once your order is on its way.'
    },
    {
        id: 2,
        question: 'Are There Any Return Exclusions?',
        answer: 'Yes, some items like final sale products or custom orders may not be eligible for return. Please refer to our full return policy for details.'
    },
    {
        id: 3,
        question: 'Will I Be Charged For A Replacement Item?',
        answer: 'If the return is due to our error (e.g., wrong item sent, damaged item), we will cover the cost of the replacement. Otherwise, standard charges may apply.'
    },
    {
        id: 4,
        question: 'How Can I Track My Orders & Payment?',
        answer: 'You can track your order status and view payment history directly within your account dashboard under the \"Orders\" section.'
    },
];

const FAQItem = ({ item, isOpen, onClick }) => (
    <div className={styles.faqItem}>
        <button className={styles.questionButton} onClick={onClick} aria-expanded={isOpen}>
            <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
            {item.question}
        </button>
        {isOpen && (
            <div className={styles.answer}>
                {item.answer}
            </div>
        )}
    </div>
);

const FAQ = () => {
    const [openItemId, setOpenItemId] = useState(null); // Track which item is open

    const handleClick = (id) => {
        setOpenItemId(openItemId === id ? null : id); // Toggle open state
    };

    return (
        <div className={styles.faqContainer}>
            <h2>Frequent Ask Questions</h2>
            <div className={styles.faqList}>
                {faqData.map(item => (
                    <FAQItem
                        key={item.id}
                        item={item}
                        isOpen={openItemId === item.id}
                        onClick={() => handleClick(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ; 