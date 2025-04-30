"use client";

import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SearchOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Layout,
  MenuProps,
  Popover,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./AppHeader.module.css";
import LogoutButton from "./LogoutButton";

const { Header } = Layout;

interface UserData {
  avatar: string;
  name: string;
}

interface AppHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userData: UserData | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  collapsed,
  setCollapsed,
  userData,
}) => {
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Componente para o popover de notificações
  const NotificationsPopover = () => {
    const notifications = [
      {
        id: 1,
        type: "message",
        content: "John commented your post",
        time: "5 minutes ago",
        read: false,
        icon: <MessageOutlined style={{ color: "#3e73cc" }} />,
      },
      {
        id: 2,
        type: "course",
        content: "New course available: Introduction to Next.js",
        time: "1 hour ago",
        read: false,
        icon: <BookOutlined style={{ color: "#3a9c74" }} />,
      },
      {
        id: 3,
        type: "deadline",
        content: "You have 1 task due soon",
        time: "3 hours ago",
        read: false,
        icon: <CalendarOutlined style={{ color: "#faad14" }} />,
      },
      {
        id: 4,
        type: "achievement",
        content: "You earned a new badge: React Master",
        time: "2 days ago",
        read: true,
        icon: <TrophyOutlined style={{ color: "#faad14" }} />,
      },
    ];

    return (
      <div className={styles.notificationsContainer}>
        <div className={styles.notificationsHeader}>
          <span className={styles.notificationsTitle}>Notifications</span>
          <Button type="link" size="small">
            Mark all as read
          </Button>
        </div>

        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                notification.read ? styles.notificationRead : ""
              }`}
            >
              <div className={styles.notificationIcon}>{notification.icon}</div>
              <div className={styles.notificationContent}>
                <div className={styles.notificationText}>
                  {notification.content}
                </div>
                <div className={styles.notificationTime}>
                  {notification.time}
                </div>
              </div>
              {!notification.read && (
                <div className={styles.notificationDot}></div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.notificationsFooter}>
          <Button
            type="link"
            block
            onClick={() => router.push("/notifications")}
          >
            See all notifications
          </Button>
        </div>
      </div>
    );
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "My Profile",
      onClick: () => router.push("/profile"),
    },
    {
      key: "2",
      label: "Settings",
      onClick: () => router.push("/settings"),
    },
    {
      key: "3",
      label: "Help",
      onClick: () => router.push("/help"),
    },
    {
      type: "divider",
      key: "divider-1",
    },
    {
      key: "4",
      label: (
        <LogoutButton
          buttonText="Logout"
          buttonType="link"
          showIcon={false}
          className={styles.logoutButton}
        />
      ),
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setSearchVisible(false);
    }
  };

  return (
    <Header className={styles.header}>
      <div className={styles.leftSection}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.mobileMenuButton}
        />
      </div>

      <div className={styles.headerActions}>
        <div className={styles.searchContainer}>
          {searchVisible ? (
            <Input
              placeholder="Search for courses, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              suffix={
                <Button
                  type="text"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                />
              }
              autoFocus
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setSearchVisible(false);
                }
              }}
              className={styles.searchInput}
            />
          ) : (
            <Button
              type="text"
              icon={<SearchOutlined />}
              className={styles.headerButton}
              onClick={() => setSearchVisible(true)}
            />
          )}
        </div>

        <Popover
          content={<NotificationsPopover />}
          trigger="click"
          placement="bottomRight"
          classNames={{ root: styles.notificationsPopover }}
          arrow={{ pointAtCenter: true }}
        >
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              className={styles.headerButton}
            />
          </Badge>
        </Popover>

        <Dropdown
          menu={{ items: userMenuItems, className: styles.userDropdown }}
          placement="bottomRight"
          trigger={["click"]}
          arrow={{ pointAtCenter: true }}
        >
          <Avatar
            src={userData?.avatar}
            size="default"
            className={styles.headerAvatar}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
