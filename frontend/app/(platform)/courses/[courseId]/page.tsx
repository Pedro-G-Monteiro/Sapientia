"use client";

import { getMockCourseById } from "@/services/coursesService";
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  message as antdMessage,
  Avatar,
  Button,
  Card,
  Collapse,
  Divider,
  Layout,
  List,
  Progress,
  Skeleton,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./course-details.module.css";

const { Title, Text, Paragraph } = Typography;

interface CourseDetailsProps {}

const CourseDetails: React.FC<CourseDetailsProps> = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [messageApi, contextHolder] = antdMessage.useMessage();

  // Verifica se está em visualização mobile
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize(); // Verificação inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carrega os dados do curso
  useEffect(() => {
    const courseId = params?.courseId;

    if (courseId) {
      const fetchCourse = async () => {
        try {
          // Use a função getMockCourseById para obter os detalhes do curso pelo ID
          // Você precisará implementar essa função no seu serviço
          const courseData = await getMockCourseById(Number(courseId));

          if (courseData) {
            setCourse(courseData);
            setFavorite(courseData.isFavorite || false);
          } else {
            // Se o curso não for encontrado, redireciona para a página de cursos
            antdMessage.error("Course not found");
            router.push("/courses");
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching course:", error);
          antdMessage.error("Failed to load course details");
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [params, router]);

  const handleBack = () => {
    router.back();
  };

  const toggleFavorite = () => {
    // Primeiro, atualize o estado
    setFavorite((prevFavorite) => {
      // Em seguida, use setTimeout para adiar a exibição da mensagem
      // para depois da fase de renderização
      setTimeout(() => {
        messageApi.success(
          !prevFavorite ? "Added to favorites" : "Removed from favorites"
        );
      }, 0);

      // Retorna o novo estado
      return !prevFavorite;
    });
  };
  const handleEnroll = () => {
    setTimeout(() => {
      messageApi.success("Successfully enrolled in the course");
    }, 0);
  };

  const handleContinue = () => {
    // Logic to continue the course
    router.push(`/courses/${params.courseId}/learn`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.courseContainer}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  // If course isn't loaded after loading is done, show error
  if (!course) {
    return (
      <div className={styles.courseContainer}>
        <div className={styles.notFoundMessage}>
          <Title level={3}>Course not found</Title>
          <Button type="primary" onClick={() => router.push("/courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  // Conteúdo do curso em módulos
  const modules = [
    {
      title: "Getting Started",
      lessons: [
        {
          title: "Introduction to the Course",
          duration: "10:25",
          completed: true,
        },
        {
          title: "Setting Up Your Environment",
          duration: "15:45",
          completed: true,
        },
        {
          title: "Your First Project",
          duration: "20:12",
          completed: course.progress >= 25,
        },
      ],
    },
    {
      title: "Core Concepts",
      lessons: [
        {
          title: "Understanding the Basics",
          duration: "18:30",
          completed: course.progress >= 40,
        },
        {
          title: "Advanced Techniques",
          duration: "22:15",
          completed: course.progress >= 50,
        },
        {
          title: "Best Practices",
          duration: "16:48",
          completed: course.progress >= 60,
        },
      ],
    },
    {
      title: "Practical Applications",
      lessons: [
        {
          title: "Building a Real-World Project",
          duration: "25:10",
          completed: course.progress >= 70,
        },
        {
          title: "Troubleshooting Common Issues",
          duration: "14:22",
          completed: course.progress >= 80,
        },
        {
          title: "Optimization Strategies",
          duration: "19:55",
          completed: course.progress >= 90,
        },
      ],
    },
    {
      title: "Final Project",
      lessons: [
        {
          title: "Project Planning",
          duration: "12:40",
          completed: course.progress >= 95,
        },
        {
          title: "Implementation",
          duration: "28:15",
          completed: course.progress === 100,
        },
        {
          title: "Deployment and Next Steps",
          duration: "15:30",
          completed: course.progress === 100,
        },
      ],
    },
  ];

  // Requirements for the course
  const requirements = [
    "Basic understanding of programming concepts",
    "Familiarity with web development",
    "Computer with internet connection",
    "Desire to learn and practice",
  ];

  // What you'll learn
  const learningOutcomes = [
    "Master the core concepts of the subject",
    "Build real-world applications",
    "Understand best practices and optimization techniques",
    "Troubleshoot common issues effectively",
    "Deploy your applications to production",
  ];

  return (
    <>
      {/* Back button */}
      <div className={styles.backButtonContainer}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          Back to Courses
        </Button>
      </div>

      <div className={styles.courseContainer}>
        <div className={styles.courseDetailsLayout}>
          {/* Main Course Content */}
          <div className={styles.mainContent}>
            {/* Course Title & Actions */}
            <div className={styles.courseHeader}>
              <Title level={2} className={styles.courseTitle}>
                {course.title}
              </Title>

              <div className={styles.courseActions}>
                <Button
                  type="text"
                  icon={
                    favorite ? (
                      <HeartFilled className={styles.favoriteIcon} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={toggleFavorite}
                  className={styles.actionButton}
                >
                  {favorite ? "Favorited" : "Favorite"}
                </Button>

                <Button
                  type="text"
                  icon={<ShareAltOutlined />}
                  className={styles.actionButton}
                >
                  Share
                </Button>
              </div>
            </div>

            {/* Course metadata */}
            <div className={styles.courseMetadata}>
              <Tag
                color={
                  course.level === "Beginner"
                    ? "green"
                    : course.level === "Intermediate"
                    ? "blue"
                    : "purple"
                }
              >
                {course.level}
              </Tag>

              <div className={styles.metaItem}>
                <ClockCircleOutlined />
                <Text>{course.durationHours} hours</Text>
              </div>

              {course.organization && (
                <div className={styles.metaItem}>
                  <TeamOutlined />
                  <Text>{course.organization.name}</Text>
                </div>
              )}

              {course.createdBy && (
                <div className={styles.metaItem}>
                  <UserOutlined />
                  <Text>
                    Instructor: {course.createdBy.firstName}{" "}
                    {course.createdBy.lastName}
                  </Text>
                </div>
              )}
            </div>

            {/* Course thumbnail */}
            <div className={styles.courseThumbnail}>
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className={styles.thumbnailImage}
                />
              ) : (
                <div className={styles.thumbnailPlaceholder}>
                  <BookOutlined />
                </div>
              )}

              {course.isEnrolled && !course.isCompleted && (
                <div className={styles.progressOverlay}>
                  <Progress
                    type="circle"
                    percent={course.progress || 0}
                    size={80}
                    strokeColor={{
                      "0%": "var(--primary-color)",
                      "100%": "var(--primary-color-light)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tabs for course content */}
            <Tabs
              defaultActiveKey="overview"
              className={styles.courseTabs}
              items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: (
                    <div className={styles.overviewTab}>
                      <Title level={4}>About this course</Title>
                      <Paragraph className={styles.courseDescription}>
                        {course.description ||
                          "No description available for this course."}
                      </Paragraph>

                      <Title level={4}>What you'll learn</Title>
                      <List
                        dataSource={learningOutcomes}
                        renderItem={(item) => (
                          <List.Item className={styles.learningItem}>
                            <CheckCircleOutlined className={styles.checkIcon} />
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />

                      <Title level={4}>Requirements</Title>
                      <List
                        dataSource={requirements}
                        renderItem={(item) => (
                          <List.Item className={styles.requirementItem}>
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />
                    </div>
                  ),
                },
                {
                  key: "curriculum",
                  label: "Curriculum",
                  children: (
                    <div className={styles.curriculumTab}>
                      <div className={styles.curriculumHeader}>
                        <Title level={4}>Course Content</Title>
                        <Text className={styles.moduleCount}>
                          {modules.length} modules •{" "}
                          {modules.reduce(
                            (acc, module) => acc + module.lessons.length,
                            0
                          )}{" "}
                          lessons
                        </Text>
                      </div>

                      <Collapse
                        defaultActiveKey={["0"]}
                        className={styles.modulesCollapse}
                        items={modules.map((module, index) => ({
                          key: index.toString(),
                          label: (
                            <div className={styles.moduleHeader}>
                              <Text strong>{module.title}</Text>
                              <Text className={styles.lessonCount}>
                                {module.lessons.length} lessons
                              </Text>
                            </div>
                          ),
                          children: (
                            <List
                              dataSource={module.lessons}
                              renderItem={(lesson, i) => (
                                <List.Item className={styles.lessonItem}>
                                  <div className={styles.lessonInfo}>
                                    {lesson.completed ? (
                                      <CheckCircleOutlined
                                        className={styles.completedIcon}
                                      />
                                    ) : (
                                      <PlayCircleOutlined
                                        className={styles.playIcon}
                                      />
                                    )}
                                    <Text className={styles.lessonTitle}>
                                      {lesson.title}
                                    </Text>
                                  </div>
                                  <Text className={styles.lessonDuration}>
                                    {lesson.duration}
                                  </Text>
                                </List.Item>
                              )}
                            />
                          ),
                        }))}
                      />
                    </div>
                  ),
                },
                {
                  key: "reviews",
                  label: "Reviews",
                  children: (
                    <div className={styles.reviewsTab}>
                      <Title level={4}>Student Reviews</Title>
                      <Paragraph>Reviews coming soon!</Paragraph>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/* Sidebar with enrollment card */}
          <div className={styles.sidebar}>
            <Card className={styles.enrollmentCard}>
              {course.isEnrolled ? (
                <>
                  {course.isCompleted ? (
                    <div className={styles.completedCourse}>
                      <TrophyOutlined className={styles.trophyIcon} />
                      <Title level={4}>Course Completed!</Title>
                      <Paragraph>
                        Congratulations on completing this course!
                      </Paragraph>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        className={styles.reviewButton}
                        onClick={() =>
                          router.push(`/courses/${course.courseId}/learn`)
                        }
                      >
                        Review Materials
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.enrolledCourse}>
                      <Title level={4}>Continue Learning</Title>
                      <div className={styles.progressInfo}>
                        <Progress
                          percent={course.progress || 0}
                          strokeColor={{
                            "0%": "var(--primary-color)",
                            "100%": "var(--primary-color-light)",
                          }}
                        />
                        <Text>{course.progress || 0}% complete</Text>
                      </div>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        size="large"
                        className={styles.continueButton}
                        onClick={handleContinue}
                      >
                        Continue Course
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.notEnrolledCourse}>
                  <Title level={4}>Enroll in this Course</Title>
                  {course.isFree ? (
                    <Title level={3} className={styles.freeTag}>
                      Free
                    </Title>
                  ) : (
                    <Title level={3} className={styles.priceTag}>
                      Premium
                    </Title>
                  )}
                  <Button
                    type="primary"
                    size="large"
                    className={styles.enrollButton}
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                  <Text className={styles.enrollmentNote}>
                    Get immediate access to this course and all its materials.
                  </Text>
                </div>
              )}
            </Card>

            {/* Instructor card */}
            {course.createdBy && (
              <Card className={styles.instructorCard}>
                <Title level={4}>Instructor</Title>
                <div className={styles.instructorInfo}>
                  <Avatar
                    size={64}
                    src={course.createdBy.avatarUrl}
                    icon={!course.createdBy.avatarUrl && <UserOutlined />}
                  />
                  <div className={styles.instructorDetails}>
                    <Text strong>
                      {course.createdBy.firstName} {course.createdBy.lastName}
                    </Text>
                    <Text type="secondary">
                      {course.organization?.name || "Independent Instructor"}
                    </Text>
                  </div>
                </div>
                <Divider />
                <Paragraph className={styles.instructorBio}>
                  Experienced instructor with a passion for teaching.
                </Paragraph>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
