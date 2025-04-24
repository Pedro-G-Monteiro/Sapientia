"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Tag,
  Tabs,
  Progress,
  Tooltip,
  message,
} from "antd";
import {
  EditOutlined,
  SettingOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TrophyOutlined,
  BookOutlined,
  FileProtectOutlined,
  StarOutlined,
  FireOutlined,
  TranslationOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "./page.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  bio: string;
  avatar: string;
  website: string;
  location: string;
  stats: {
    coursesCompleted: number;
    certificatesEarned: number;
    learningHours: number;
    knowledgeContributions: number;
  };
  languages: {
    name: string;
    level: string;
    flag: string;
  }[];
  badges: {
    id: number;
    name: string;
    icon: React.ReactNode;
    date: string;
  }[];
  certificates: {
    id: number;
    name: string;
    date: string;
    course: string;
  }[];
}

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [messageApi, contextHolder] = message.useMessage();

  // Effect to load user data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulation of profile data loading
      const mockUserData: UserProfileData = {
        name: "Pedro Guedes",
        email: "pedro.guedes@example.com",
        phone: "+351 912 345 678",
        organization: "Viseu Polytechnic",
        role: "Student",
        bio: "Computer Engineering student with an interest in web development and artificial intelligence. Currently working on projects with React, Next.js, and TypeScript.",
        avatar: "https://i.pravatar.cc/150?img=3",
        website: "https://pedroguedes.dev",
        location: "Viseu, Portugal",
        stats: {
          coursesCompleted: 7,
          certificatesEarned: 5,
          learningHours: 42,
          knowledgeContributions: 12,
        },
        languages: [
          {
            name: "Portuguese",
            level: "Native",
            flag: "https://flagcdn.com/w20/pt.png",
          },
          {
            name: "English",
            level: "Fluent (C1)",
            flag: "https://flagcdn.com/w20/gb.png",
          },
          {
            name: "Spanish",
            level: "Intermediate (B1)",
            flag: "https://flagcdn.com/w20/es.png",
          },
        ],
        badges: [
          {
            id: 1,
            name: "Rising Star",
            icon: <StarOutlined />,
            date: "03/12/2025",
          },
          {
            id: 2,
            name: "Active Contributor",
            icon: <FireOutlined />,
            date: "02/25/2025",
          },
          {
            id: 3,
            name: "React Expert",
            icon: <TrophyOutlined />,
            date: "01/10/2025",
          },
        ],
        certificates: [
          {
            id: 1,
            name: "Next.js: From Basics to Advanced",
            date: "03/15/2025",
            course: "Modern Web Development",
          },
          {
            id: 2,
            name: "TypeScript for React Developers",
            date: "02/28/2025",
            course: "Frontend Development",
          },
          {
            id: 3,
            name: "UI/UX Design with Ant Design",
            date: "01/10/2025",
            course: "Interface Design",
          },
        ],
      };

      setUserData(mockUserData);
      form.setFieldsValue({
        name: mockUserData.name,
        email: mockUserData.email,
        phone: mockUserData.phone,
        website: mockUserData.website,
        location: mockUserData.location,
        bio: mockUserData.bio,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [form]);

  // Handler to toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      form.resetFields();
    }
    setIsEditMode(!isEditMode);
  };

  // Handler to save form data
  const handleSave = () => {
    form.validateFields().then((values) => {
      // Update user data with form values
      if (userData) {
        const updatedUserData = {
          ...userData,
          ...values,
        };
        setUserData(updatedUserData);
        setIsEditMode(false);
        messageApi.success("Profile updated successfully!");
      }
    });
  };

  // Calculate progress level
  const calculateProgress = (completed: number, total: number): number => {
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className={styles.profilePageContainer}>
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <div style={{ fontSize: 24, marginBottom: 20 }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.profilePageContainer}>
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <div style={{ fontSize: 24, marginBottom: 20 }}>
            Error loading profile. Please try again later.
          </div>
          <Button type="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePageContainer}>
      {contextHolder}
      {/* Header with basic information */}
      <div className={styles.profileHeader}>
        <div className={styles.profileContent}>
          <div className={styles.profileBasicInfo}>
            <Avatar
              size={120}
              src={userData.avatar}
              icon={<UserOutlined />}
              className={styles.userAvatar}
            />
            <div className={styles.userInfo}>
              <Title level={2}>{userData.name}</Title>
              <Text className={styles.userOrgText}>
                {userData.role} · {userData.organization}
              </Text>
            </div>
          </div>

          {/* User statistics */}
          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userData.stats.coursesCompleted}</span>
              <span className={styles.statLabel}>Courses Completed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userData.stats.certificatesEarned}</span>
              <span className={styles.statLabel}>Certificates</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userData.stats.learningHours}</span>
              <span className={styles.statLabel}>Learning Hours</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userData.stats.knowledgeContributions}</span>
              <span className={styles.statLabel}>Contributions</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.profileActionButtons}>
            <Button
              icon={<EditOutlined />}
              className={styles.actionButton}
              onClick={toggleEditMode}
            >
              {isEditMode ? "Cancel Edit" : "Edit Profile"}
            </Button>
            <Button
              icon={<SettingOutlined />}
              className={styles.actionButton}
              onClick={() => {
                /* Future implementation */
              }}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className={styles.contentSections}>
        {/* Personal information section */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <Title level={4} className={styles.sectionTitle}>
              <UserOutlined className={styles.sectionIcon} />
              Personal Information
            </Title>
            {isEditMode && (
              <Button type="primary" className={styles.saveButton} onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </div>

          {isEditMode ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                website: userData.website,
                location: userData.location,
                bio: userData.bio,
              }}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
                className={styles.formItem}
              >
                <Input placeholder="Your full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="your.email@example.com" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
                className={styles.formItem}
              >
                <Input placeholder="+351 912 345 678" prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                name="website"
                label="Website"
                className={styles.formItem}
              >
                <Input placeholder="https://yourwebsite.com" prefix={<GlobalOutlined />} />
              </Form.Item>

              <Form.Item
                name="location"
                label="Location"
                className={styles.formItem}
              >
                <Input placeholder="City, Country" />
              </Form.Item>

              <Form.Item
                name="bio"
                label="Biography"
                className={styles.formItem}
              >
                <TextArea
                  rows={4}
                  placeholder="Tell a bit about yourself..."
                  className={styles.bioTextArea}
                />
              </Form.Item>
            </Form>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <MailOutlined style={{ marginRight: 8 }} /> Email
                </Text>
                <Text>{userData.email}</Text>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <PhoneOutlined style={{ marginRight: 8 }} /> Phone
                </Text>
                <Text>{userData.phone}</Text>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <GlobalOutlined style={{ marginRight: 8 }} /> Website
                </Text>
                <a href={userData.website} target="_blank" rel="noopener noreferrer">
                  {userData.website}
                </a>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <UserOutlined style={{ marginRight: 8 }} /> Location
                </Text>
                <Text>{userData.location}</Text>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Biography
                </Text>
                <Paragraph>{userData.bio}</Paragraph>
              </div>
            </>
          )}
        </div>

        {/* Section with tabs for other content */}
        <div className={styles.contentSection}>
          <Tabs
            defaultActiveKey="badges"
            onChange={setActiveTab}
            items={[
              {
                key: "badges",
                label: (
                  <span>
                    <TrophyOutlined /> Badges
                  </span>
                ),
                children: (
                  <div>
                    <Paragraph>
                      Badges you have earned for your achievements on the platform.
                    </Paragraph>
                    <div className={styles.badgeList}>
                      {userData.badges.map((badge) => (
                        <div key={badge.id} className={styles.badge}>
                          <div className={styles.badgeIcon}>{badge.icon}</div>
                          <div className={styles.badgeName}>{badge.name}</div>
                          <div className={styles.badgeDate}>{badge.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                key: "certificates",
                label: (
                  <span>
                    <FileProtectOutlined /> Certificates
                  </span>
                ),
                children: (
                  <div>
                    <Paragraph>
                      Certificates you have earned upon completing courses.
                    </Paragraph>
                    <div className={styles.certificateList}>
                      {userData.certificates.map((cert) => (
                        <div key={cert.id} className={styles.certificateItem}>
                          <div className={styles.certificateIcon}>
                            <FileProtectOutlined />
                          </div>
                          <div className={styles.certificateInfo}>
                            <Text className={styles.certificateName}>{cert.name}</Text>
                            <Text className={styles.certificateDate}>
                              {cert.course} • {cert.date}
                            </Text>
                          </div>
                          <Button
                            type="link"
                            className={styles.viewButton}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                key: "languages",
                label: (
                  <span>
                    <TranslationOutlined /> Languages
                  </span>
                ),
                children: (
                  <div>
                    <Paragraph>
                      Languages you know and your proficiency level.
                    </Paragraph>
                    <div>
                      {userData.languages.map((lang, index) => (
                        <div key={index} className={styles.languageItem}>
                          <div className={styles.languageInfo}>
                            <img
                              src={lang.flag}
                              alt={`Flag of ${lang.name}`}
                              className={styles.languageFlag}
                            />
                            <div>
                              <div className={styles.languageName}>{lang.name}</div>
                              <div className={styles.languageLevel}>{lang.level}</div>
                              </div>
                          </div>
                          {isEditMode ? (
                            <Select defaultValue="no-change" style={{ width: 120 }} size="small">
                              <Option value="no-change">No change</Option>
                              <Option value="beginner">Beginner</Option>
                              <Option value="intermediate">Intermediate</Option>
                              <Option value="advanced">Advanced</Option>
                              <Option value="fluent">Fluent</Option>
                              <Option value="native">Native</Option>
                            </Select>
                          ) : (
                            <Tag color="blue">{lang.level}</Tag>
                          )}
                        </div>
                      ))}
                      {isEditMode && (
                        <Button type="dashed" style={{ width: "100%", marginTop: 16 }}>
                          + Add language
                        </Button>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: "progress",
                label: (
                  <span>
                    <BookOutlined /> Progress
                  </span>
                ),
                children: (
                  <div>
                    <Paragraph>
                      Your learning progress in different areas.
                    </Paragraph>
                    <div style={{ marginTop: 20 }}>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <Text strong>Web Development</Text>
                          <Text>85%</Text>
                        </div>
                        <Progress percent={85} status="active" />
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <Text strong>Data Science</Text>
                          <Text>60%</Text>
                        </div>
                        <Progress percent={60} status="active" />
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <Text strong>DevOps</Text>
                          <Text>45%</Text>
                        </div>
                        <Progress percent={45} status="active" />
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <Text strong>UX/UI Design</Text>
                          <Text>70%</Text>
                        </div>
                        <Progress percent={70} status="active" />
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;