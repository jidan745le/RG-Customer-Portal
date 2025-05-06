import React, { useState } from 'react';
import styles from '../../styles/marketplace/NewsletterSubscribe.module.css';

const NewsletterSubscribe = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // In a real app, we would send this to a backend service
            console.log('Subscribing email:', email);
            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <div className={styles.subscribeContainer}>
            <h3 className={styles.subscribeTitle}>Subscribe</h3>
            <form onSubmit={handleSubmit} className={styles.subscribeForm}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className={styles.emailInput}
                />
                <button type="submit" className={styles.subscribeButton}>
                    ➔
                </button>
            </form>
            <p className={styles.subscribeNote}>
                Sign up for our newsletter to receive the latest product updates,
                industry insights, and exclusive offers straight to your inbox.
                We respect your privacy and will never share your information.
            </p>
            {submitted && (
                <p className={styles.successMessage}>Thanks for subscribing!</p>
            )}
        </div>
    );
};

export default NewsletterSubscribe; 