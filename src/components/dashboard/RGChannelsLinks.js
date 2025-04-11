import React from 'react';
import styles from '../../styles/dashboard/RGChannelsLinks.module.css';

// 模拟数据
const linksData = [
    { id: 'social', name: 'Social Media Ads', icon: 'AD', url: '#' },
    { id: 'linkedin', name: 'Dealer LinkedIn', icon: 'in', url: '#' }, // Assuming 'in' for LinkedIn
    { id: 'fb1', name: 'Facebook', icon: 'f', url: '#' }, // Assuming 'f' for Facebook
    { id: 'fb2', name: 'Facebook', icon: 'f', url: '#' },
    { id: 'fb3', name: 'Facebook', icon: 'f', url: '#' },
];

// 简单的图标组件
const LinkIcon = ({ icon }) => (
    <div className={`${styles.iconCircle} ${styles['icon-' + icon.toLowerCase()]}`}>
        {icon}
    </div>
);

const RGChannelsLinks = () => {
    return (
        <div className={styles.linksContainer}>
            <h3>RG Channels & Links</h3>
            <ul className={styles.linksList}>
                {linksData.map(link => (
                    <li key={link.id} className={styles.linkItem}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkAnchor}>
                            <LinkIcon icon={link.icon} />
                            <span className={styles.linkName}>{link.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RGChannelsLinks; 