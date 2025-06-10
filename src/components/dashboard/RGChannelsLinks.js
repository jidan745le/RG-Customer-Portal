import React from 'react';
import styles from '../../styles/dashboard/RGChannelsLinks.module.css';

// 模拟数据
const linksData = [
    { id: 'linkedin', name: 'LinkedIn', icon: 'in', url: 'https://www.linkedin.com/company/rg-experience/?viewAsMember=true' },
    { id: 'website', name: 'Website', icon: 'W', url: 'https://rg-experience.com/' },
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