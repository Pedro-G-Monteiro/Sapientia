'use client';

import { getMockCourseById } from '@/services/coursesService';
import {
  BookOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeFilled,
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Collapse,
  Divider,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  Progress,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './course-learn.module.css';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface LessonType {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  description?: string;
  attachments?: Array<{
    id: number;
    title: string;
    fileType: string;
    fileUrl: string;
  }>;
}

interface ModuleType {
  id: number;
  title: string;
  lessons: LessonType[];
}

const CourseLearningPage = () => {
  const router = useRouter();
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonType | null>(null);
  const [previousLesson, setPreviousLesson] = useState<LessonType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Array<{id: number, text: string, timestamp: string}>>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<{id: number, text: string, timestamp: string} | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Processar os dados do curso para criar a estrutura de módulos e lições
  const processModules = useCallback(() => {
    // Este é um exemplo. Em uma aplicação real, você buscaria esses dados da API
    const mockModules: ModuleType[] = [
      {
        id: 1,
        title: 'Getting Started',
        lessons: [
          { 
            id: 101, 
            title: 'Introduction to the Course', 
            duration: '10:25', 
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Welcome to the course! In this lesson, we\'ll go over what you\'ll learn and how to get the most out of this course.',
            attachments: [
              { id: 1, title: 'Course Syllabus', fileType: 'pdf', fileUrl: '#' },
              { id: 2, title: 'Introduction Slides', fileType: 'ppt', fileUrl: '#' },
            ]
          },
          { 
            id: 102, 
            title: 'Setting Up Your Environment', 
            duration: '15:45', 
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/GUDAEzGaa8Q',
            description: 'Learn how to set up your development environment for the course.'
          },
          { 
            id: 103, 
            title: 'Your First Project', 
            duration: '20:12', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/axL59Dc5rZA'
          },
        ]
      },
      {
        id: 2,
        title: 'Core Concepts',
        lessons: [
          { 
            id: 201, 
            title: 'Understanding the Basics', 
            duration: '18:30', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/WV0UUcSPk-0'
          },
          { 
            id: 202, 
            title: 'Advanced Techniques', 
            duration: '22:15', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/hKXQmCFayCc'
          },
          { 
            id: 203, 
            title: 'Best Practices', 
            duration: '16:48', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/wmEWSQDPVOw'
          },
        ]
      },
      {
        id: 3,
        title: 'Practical Applications',
        lessons: [
          { 
            id: 301, 
            title: 'Building a Real-World Project', 
            duration: '25:10', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          { 
            id: 302, 
            title: 'Troubleshooting Common Issues', 
            duration: '14:22', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          { 
            id: 303, 
            title: 'Optimization Strategies', 
            duration: '19:55', 
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
        ]
      },
    ];

    setModules(mockModules);

    // Set initial lesson (first incomplete lesson or first lesson)
    let found = false;
    for (const module of mockModules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          setCurrentLesson(lesson);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    // If all lessons are completed, set the first lesson
    if (!found && mockModules.length > 0 && mockModules[0].lessons.length > 0) {
      setCurrentLesson(mockModules[0].lessons[0]);
    }
  }, []);

  // Detect screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize(); // Check initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch the course and set up modules
  useEffect(() => {
    const courseId = params?.courseId;
    
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const courseData = await getMockCourseById(Number(courseId));
          
          if (courseData) {
            setCourse(courseData);
            processModules();
          } else {
            setTimeout(() => {
              messageApi.error('Course not found');
            }, 0);
            router.push('/courses');
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching course:', error);
          setTimeout(() => {
            messageApi.error('Failed to load course');
          }, 0);
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [params, router, processModules, messageApi]);

  // Find previous and next lessons whenever current lesson changes
  useEffect(() => {
    if (!currentLesson || !modules.length) return;
    
    let allLessons: LessonType[] = [];
    modules.forEach(module => {
      allLessons = [...allLessons, ...module.lessons];
    });
    
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
    
    if (currentIndex > 0) {
      setPreviousLesson(allLessons[currentIndex - 1]);
    } else {
      setPreviousLesson(null);
    }
    
    if (currentIndex < allLessons.length - 1) {
      setNextLesson(allLessons[currentIndex + 1]);
    } else {
      setNextLesson(null);
    }
  }, [currentLesson, modules]);

  // Function to change the current lesson
  const changeLesson = useCallback((lesson: LessonType) => {
    setCurrentLesson(lesson);
  }, []);

  // Mark lesson as completed
  const markAsCompleted = useCallback(() => {
    if (!currentLesson) return;
    
    setModules(prevModules => {
      const newModules = [...prevModules];
      
      for (const module of newModules) {
        for (let i = 0; i < module.lessons.length; i++) {
          if (module.lessons[i].id === currentLesson.id) {
            module.lessons[i] = { ...module.lessons[i], completed: true };
            
            // Update current lesson state
            setCurrentLesson({ ...currentLesson, completed: true });
            
            setTimeout(() => {
              messageApi.success('Lesson marked as completed!');
            }, 0);
            
            return newModules;
          }
        }
      }
      
      return prevModules;
    });
  }, [currentLesson, messageApi]);

  // Navigate to next lesson
  const goToNextLesson = useCallback(() => {
    if (nextLesson) {
      setCurrentLesson(nextLesson);
      
      // Auto-mark current lesson as completed
      if (currentLesson && !currentLesson.completed) {
        markAsCompleted();
      }
    }
  }, [nextLesson, currentLesson, markAsCompleted]);

  // Navigate to previous lesson
  const goToPreviousLesson = useCallback(() => {
    if (previousLesson) {
      setCurrentLesson(previousLesson);
    }
  }, [previousLesson]);

  // Handle note creation and editing
  const addNote = useCallback(() => {
    if (!noteText.trim()) return;
    
    if (currentNote) {
      // Edit existing note
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === currentNote.id 
            ? { ...note, text: noteText } 
            : note
        )
      );
      
      setTimeout(() => {
        messageApi.success('Note updated!');
      }, 0);
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toLocaleString()
      };
      
      setNotes(prevNotes => [...prevNotes, newNote]);
      
      setTimeout(() => {
        messageApi.success('Note added!');
      }, 0);
    }
    
    setNoteText('');
    setCurrentNote(null);
    setIsNoteModalOpen(false);
  }, [noteText, currentNote, messageApi]);

  const editNote = useCallback((note: {id: number, text: string, timestamp: string}) => {
    setCurrentNote(note);
    setNoteText(note.text);
    setIsNoteModalOpen(true);
  }, []);

  const deleteNote = useCallback((noteId: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    
    setTimeout(() => {
      messageApi.success('Note deleted!');
    }, 0);
  }, [messageApi]);

  const openNoteModal = useCallback(() => {
    setNoteText('');
    setCurrentNote(null);
    setIsNoteModalOpen(true);
  }, []);

  // Calculate overall progress
  const calculateProgress = useCallback(() => {
    if (!modules.length) return 0;
    
    let totalLessons = 0;
    let completedLessons = 0;
    
    modules.forEach(module => {
      totalLessons += module.lessons.length;
      completedLessons += module.lessons.filter(lesson => lesson.completed).length;
    });
    
    return Math.round((completedLessons / totalLessons) * 100);
  }, [modules]);

  // Generate sidebar menu items for course navigation
  const generateMenuItems = useCallback(() => {
    return modules.map(module => ({
      key: `module-${module.id}`,
      label: (
        <div className={styles.moduleItem}>
          <span>{module.title}</span>
          <Text className={styles.lessonCount}>
            {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
          </Text>
        </div>
      ),
      children: module.lessons.map(lesson => ({
        key: `lesson-${lesson.id}`,
        label: (
          <div 
            className={`${styles.lessonMenuItem} ${currentLesson?.id === lesson.id ? styles.activeLesson : ''}`}
            onClick={() => changeLesson(lesson)}
          >
            <div className={styles.lessonMenuItemContent}>
              {lesson.completed ? (
                <CheckCircleOutlined className={styles.lessonCompletedIcon} />
              ) : (
                <PlayCircleOutlined className={styles.lessonPlayIcon} />
              )}
              <span className={styles.lessonMenuItemTitle}>{lesson.title}</span>
            </div>
            <Text className={styles.lessonDuration}>{lesson.duration}</Text>
          </div>
        )
      }))
    }));
  }, [modules, currentLesson, changeLesson]);

  // If still loading
  if (loading) {
    return (
      <Layout className={styles.mainLayout}>
        <Content className={styles.loadingContent}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className={styles.mainLayout}>
      {contextHolder}
      
      <Sider
        width={300}
        collapsed={sidebarCollapsed}
        collapsedWidth={0}
        className={styles.sidebar}
        trigger={null}
      >
        <div className={styles.sidebarHeader}>
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={() => router.push(`/courses/${params.courseId}`)}
            className={styles.backButton}
          >
            Back to Course
          </Button>
        </div>
        
        <div className={styles.courseProgress}>
          <div className={styles.progressInfo}>
            <Text strong>Your Progress</Text>
            <Text>{calculateProgress()}% Complete</Text>
          </div>
          <Progress percent={calculateProgress()} size="small" strokeColor={{
            '0%': 'var(--primary-color)',
            '100%': 'var(--primary-color-light)',
          }} />
        </div>
        
        <div className={styles.sidebarContent}>
          <Menu
            mode="inline"
            defaultOpenKeys={modules.map(m => `module-${m.id}`)}
            selectedKeys={currentLesson ? [`lesson-${currentLesson.id}`] : []}
            items={generateMenuItems()}
            className={styles.courseMenu}
          />
        </div>
      </Sider>
      
      <Layout className={styles.contentArea}>
        <div className={styles.courseContentHeader}>
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={styles.collapseButton}
          />
          
          <div className={styles.lessonNavigation}>
            <Button
              type="text"
              icon={<HomeFilled />}
              onClick={() => router.push('/dashboard')}
              className={styles.homeButton}
            >
              Dashboard
            </Button>
            
            {!isMobileView && course && (
              <Text ellipsis className={styles.courseBreadcrumb}>
                {course.title} / {currentLesson?.title}
              </Text>
            )}
          </div>
        </div>
        
        <Content className={styles.lessonContent}>
          {currentLesson ? (
            <>
              <div className={styles.videoContainer}>
                {currentLesson.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.videoPlayer}
                  ></iframe>
                ) : (
                  <div className={styles.noVideoPlaceholder}>
                    <PlayCircleOutlined />
                    <Text>No video available for this lesson</Text>
                  </div>
                )}
              </div>
              
              <div className={styles.lessonDetails}>
                <Tabs
                  defaultActiveKey="content"
                  items={[
                    {
                      key: 'content',
                      label: 'Lesson Content',
                      children: (
                        <div className={styles.contentTab}>
                          <Title level={3}>{currentLesson.title}</Title>
                          
                          {currentLesson.description ? (
                            <Paragraph className={styles.lessonDescription}>
                              {currentLesson.description}
                            </Paragraph>
                          ) : (
                            <Paragraph className={styles.lessonDescription}>
                              This lesson doesn't have a detailed description yet.
                            </Paragraph>
                          )}
                          
                          {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                            <>
                              <Divider />
                              <Title level={4}>Lesson Resources</Title>
                              <List
                                className={styles.attachmentsList}
                                dataSource={currentLesson.attachments}
                                renderItem={attachment => (
                                  <List.Item
                                    actions={[
                                      <Button
                                        key="download"
                                        type="link"
                                        icon={<DownloadOutlined />}
                                        onClick={() => window.open(attachment.fileUrl, '_blank')}
                                      >
                                        Download
                                      </Button>
                                    ]}
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        attachment.fileType === 'pdf' ? (
                                          <FileTextOutlined className={styles.attachmentIcon} />
                                        ) : (
                                          <FileTextOutlined className={styles.attachmentIcon} />
                                        )
                                      }
                                      title={attachment.title}
                                      description={`${attachment.fileType.toUpperCase()} file`}
                                    />
                                  </List.Item>
                                )}
                              />
                            </>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'notes',
                      label: 'My Notes',
                      children: (
                        <div className={styles.notesTab}>
                          <div className={styles.notesHeader}>
                            <Title level={4}>Your Notes</Title>
                            <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={openNoteModal}
                            >
                              Add Note
                            </Button>
                          </div>
                          
                          {notes.length > 0 ? (
                            <List
                              className={styles.notesList}
                              dataSource={notes}
                              renderItem={note => (
                                <Card className={styles.noteCard} key={note.id}>
                                  <div className={styles.noteContent}>
                                    <Paragraph>{note.text}</Paragraph>
                                    <div className={styles.noteFooter}>
                                      <Text type="secondary">{note.timestamp}</Text>
                                      <Space>
                                        <Button
                                          type="text"
                                          size="small"
                                          onClick={() => editNote(note)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          type="text"
                                          size="small"
                                          danger
                                          onClick={() => deleteNote(note.id)}
                                        >
                                          Delete
                                        </Button>
                                      </Space>
                                    </div>
                                  </div>
                                </Card>
                              )}
                            />
                          ) : (
                            <div className={styles.emptyNotes}>
                              <MessageOutlined className={styles.emptyNotesIcon} />
                              <Paragraph>You haven't added any notes yet.</Paragraph>
                              <Paragraph type="secondary">
                                Notes can help you remember important points from the lesson.
                              </Paragraph>
                            </div>
                          )}
                        </div>
                      )
                    }
                  ]}
                />
              </div>
              
              <div className={styles.lessonNavButtons}>
                <div>
                  {previousLesson && (
                    <Tooltip title={previousLesson.title}>
                      <Button
                        icon={<LeftOutlined />}
                        onClick={goToPreviousLesson}
                        className={styles.navButton}
                      >
                        Previous
                      </Button>
                    </Tooltip>
                  )}
                </div>
                
                <div className={styles.centerButtons}>
                  {!currentLesson.completed && (
                    <Button
                      type="primary"
                      onClick={markAsCompleted}
                      className={styles.completeButton}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
                
                <div>
                  {nextLesson && (
                    <Tooltip title={nextLesson.title}>
                      <Button
                        type="primary"
                        onClick={goToNextLesson}
                        className={styles.navButton}
                      >
                        Next <RightOutlined />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noLessonSelected}>
              <BookOutlined className={styles.noLessonIcon} />
              <Title level={3}>No lesson selected</Title>
              <Paragraph>Please select a lesson from the course menu to start learning.</Paragraph>
            </div>
          )}
        </Content>
      </Layout>
      
      <Modal
        title={currentNote ? "Edit Note" : "Add New Note"}
        open={isNoteModalOpen}
        onOk={addNote}
        onCancel={() => setIsNoteModalOpen(false)}
        okText={currentNote ? "Update" : "Add"}
      >
        <TextArea
          rows={6}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type your notes here..."
        />
      </Modal>
    </Layout>
  );
};

export default CourseLearningPage;