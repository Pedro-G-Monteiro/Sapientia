import { RocketOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
	isLanding?: boolean; // optional, defaults to false
	collapsed?: boolean; // optional, defaults to false
}

const Logo: React.FC<LogoProps> = ({ isLanding = false, collapsed = false }) => {
  const navigationPage = isLanding ? '/landing-page' : '/dashboard';

	return (
		<div className={styles.container}>
			<div className={styles.logo}>
				<Link href={navigationPage} aria-label="Sapientia - Home">
					<div className={styles.logoWrapper}>
						<div className={styles.logoIcon} aria-hidden="true">
							<div className={styles.spaceStars}>
								{[...Array(3)].map((_, i) => (
									<div key={i} className={styles.star}>
										●
									</div>
								))}
							</div>
							<RocketOutlined className={styles.rocketIcon} />
							<div className={styles.rocketThrust}></div>
						</div>
						{
							!collapsed && <span className={styles.logoText}>Sapientia</span>
						}
					</div>
				</Link>
			</div>
		</div>
	);
};

export default Logo;
