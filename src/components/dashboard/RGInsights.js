import React from 'react';
import img1 from '../../assets/images/insight1.png';
import img2 from '../../assets/images/insight2.png';
import img3 from '../../assets/images/insight3.png';
import styles from '../../styles/dashboard/RGInsights.module.css';

// 模拟数据
const insightsData = [
    {
        id: 1,
        title: "We're launching a new service",
        description: 'We are offering a variety of predefined service packages to help with business model workshops, Vendor Selection to Health Checks for existing solutions.',
        imageUrl: img1 // 使用占位符图片
    },
    {
        id: 2,
        title: 'Understanding Market Trends',
        description: 'Explore the latest trends in the customer portal industry and how RG Experience is adapting.',
        imageUrl: img2
    },
    {
        id: 3,
        title: 'Enhancing User Experience',
        description: 'Learn about the recent updates and improvements made to the RG Customer Portal for a better UX.',
        imageUrl: img3
    }
];

const RGInsights = () => {
    return (
        <div className={styles.insightsContainer}>
            <h3>RG Insights</h3>
            <div className={styles.insightsList}>
                {insightsData.map(insight => (
                    <div key={insight.id} className={styles.insightItem}>
                        <img src={insight.imageUrl} alt={insight.title} className={styles.insightImage} />
                        <div className={styles.insightContent}>
                            <h4 className={styles.insightTitle}>{insight.title}</h4>
                            <p className={styles.insightDescription}>{insight.description}</p>
                            {/* 可以添加 "Read More" 链接 */}
                            <a href="#" className={styles.readMore}>Read More &rarr;</a>
                        </div>
                    </div>
                ))}
            </div>
            <button className={styles.viewAllButton}>View All Insights</button>
        </div>
    );
};

export default RGInsights; 