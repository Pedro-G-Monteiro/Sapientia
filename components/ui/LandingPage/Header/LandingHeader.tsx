'use client';

import { MenuOutlined, RocketOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from './LandingHeader.module.css';

const { Header } = Layout;

// Define menu items interface for better type checking
interface MenuItem {
  key: string;
  text: string;
  href: string;
}

const LandingHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');
  
  // Effect to detect scrolling - optimized with passive listener for better performance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      
      // Update active section based on scroll position
      const sections = menuItems.map(item => item.href);
      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when user resizes window to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest(`.${styles.mobileMenu}`) && !target.closest(`.${styles.mobileMenuButton}`)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Menu items - removed "Get Started" from the menu
  const menuItems: MenuItem[] = [
    { key: 'knowledge', text: 'Knowledge Hub', href: '#knowledge' },
    { key: 'benefits', text: 'Benefits', href: '#benefits' },
    { key: 'faq', text: 'FAQ', href: '#faq' }
  ];

  // Handle keyboard navigation for menu items
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Smooth scroll to section when clicking on navigation links
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Handle mouse click event
  const handleClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  };

  // Handle keyboard event (Enter key)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>, href: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      scrollToSection(href);
    }
  };

  // Transformed menu items to avoid nested anchor tags
  const desktopMenuItems = menuItems.map(item => {
    return {
      key: item.key,
      label: (
        <span 
          onClick={(e) => handleClick(e, item.href)}
          className={`${styles.menuItemText} ${activeSection === item.href ? styles.activeMenuItem : ''}`}
          tabIndex={0}
          role="link"
          aria-label={item.text}
          onKeyDown={(e) => handleKeyPress(e, item.href)}
        >
          {item.text}
        </span>
      )
    };
  });

  // Mobile menu items - include Get Started for mobile only
  const mobileMenuItems = [
    ...menuItems.map(item => ({
      key: item.key,
      label: (
        <span 
          onClick={(e) => handleClick(e, item.href)}
          className={`${styles.menuItemText} ${activeSection === item.href ? styles.activeMobileItem : ''}`}
          tabIndex={0}
          role="link"
          aria-label={item.text}
          onKeyDown={(e) => handleKeyPress(e, item.href)}
        >
          {item.text}
        </span>
      )
    })),
    {
      key: 'getStarted',
      label: (
        <Button
          type="primary" 
          onClick={() => scrollToSection('#top')}
          className={styles.mobileGetStartedButton}
          aria-label="Get Started"
        >
          Get Started
        </Button>
      )
    }
  ];

  return (
    <>
      <div className={styles.headerSpacer} id="top"/>
      <Header 
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" aria-label="Sapientia - Home">
              <div className={styles.logoWrapper}>
                <div className={styles.logoIcon} aria-hidden="true">
                  <div className={styles.spaceStars}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={styles.star}>●</div>
                    ))}
                  </div>
                  <RocketOutlined className={styles.rocketIcon} />
                  <div className={styles.rocketThrust}></div>
                </div>
                <span className={styles.logoText}>Sapientia</span>
              </div>
            </Link>
          </div>
          
          {/* Right side: Navigation, Get Started button, and mobile menu button */}
          <div className={styles.rightSection}>
            {/* Desktop navigation menu */}
            <nav aria-label="Main Navigation" className={styles.desktopNav}>
              <Menu
                mode="horizontal"
                className={styles.desktopMenu}
                disabledOverflow
                selectedKeys={[]}
                items={desktopMenuItems}
              />
            </nav>
            
            {/* Independent Get Started Button - only visible on desktop */}
            <Button
              type="primary" 
              onClick={() => scrollToSection('#top')}
              className={styles.getStartedButton}
              aria-label="Get Started"
            >
              Get Started
            </Button>
            
            {/* Mobile menu button */}
            <div className={styles.mobileMenuToggle}>
              <Badge dot={mobileMenuOpen} color="var(--primary-color)">
                <button
                  onClick={toggleMobileMenu}
                  className={styles.mobileMenuButton}
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <MenuOutlined />
                </button>
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          aria-hidden={!mobileMenuOpen}
          onKeyDown={handleKeyDown}
          id="mobile-menu"
          role="dialog"
          aria-modal={mobileMenuOpen}
          aria-label="Site Navigation"
        >
          <Menu
            mode="vertical"
            className={styles.mobileMenuItems}
            items={mobileMenuItems}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </Header>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay} 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default LandingHeader;