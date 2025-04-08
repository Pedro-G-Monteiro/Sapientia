'use client';

import { CourseCardProps } from '@/components/ui/Cards/Courses/CourseCard';
import AppHeader from '@/components/ui/Layout/Header/AppHeader';
import AppSidebar from '@/components/ui/Layout/Sider/AppSidebar';
import {
  BookOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  FileTextOutlined,
  HomeFilled,
  InfoCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined,
  SortAscendingOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Menu,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './course-create.module.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

// Define types for course structure
interface Attachment {
  id: string;
  title: string;
  fileType: string;
  url: string;
  file?: File;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  attachments: Attachment[];
  isPublished: boolean;
  videoFile?: File;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isPublished: boolean;
}

interface CourseFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  tags: string[];
  thumbnailUrl: string;
  durationHours: number;
  isPublished: boolean;
  isFree: boolean;
  startDate: Date | null;
  endDate: Date | null;
  modules: Module[];
  prerequisites: string[];
  outcomes: string[];
  instructors: { id: string; name: string }[];
  thumbnail?: File;
}

// Drag and Drop component for module reordering
const type = 'DraggableItem';

interface DraggableItemProps {
  id: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  index,
  moveItem,
  children,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));
  
  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {children}
    </div>
  );
};

// Main component for course creation
const CourseCreationPage: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [currentCourse, setCurrentCourse] = useState<CourseFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    level: 'All Levels',
    tags: [],
    thumbnailUrl: '',
    durationHours: 0,
    isPublished: false,
    isFree: true,
    startDate: null,
    endDate: null,
    modules: [],
    prerequisites: [],
    outcomes: [],
    instructors: [],
  });
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [isAddModuleModalVisible, setIsAddModuleModalVisible] = useState(false);
  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  // Form for adding/editing modules
  const [moduleForm] = Form.useForm();
  
  // Form for adding/editing lessons
  const [lessonForm] = Form.useForm();
  
  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Initialize form with current course data
  useEffect(() => {
    form.setFieldsValue({
      title: currentCourse.title,
      description: currentCourse.description,
      shortDescription: currentCourse.shortDescription,
      category: currentCourse.category,
      level: currentCourse.level,
      durationHours: currentCourse.durationHours,
      isPublished: currentCourse.isPublished,
      isFree: currentCourse.isFree,
      startDate: currentCourse.startDate,
      endDate: currentCourse.endDate,
    });
  }, [currentCourse, form]);
  
  // Generate unique ID for new items
  const generateId = () => {
    return Date.now().toString();
  };
  
  // Handle form submission
  const handleFormSubmit = (values: any) => {
    const updatedCourse = {
      ...currentCourse,
      ...values,
    };
    
    console.log('Course data to be submitted:', updatedCourse);
    
    // Here you would typically send the data to your API
    setTimeout(() => {
      messageApi.success('Course saved successfully!');
    }, 0);
  };
  
  // Handle tag actions
  const handleAddTag = () => {
    if (newTag && !currentCourse.tags.includes(newTag)) {
      setCurrentCourse({
        ...currentCourse,
        tags: [...currentCourse.tags, newTag],
      });
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setCurrentCourse({
      ...currentCourse,
      tags: currentCourse.tags.filter((t) => t !== tag),
    });
  };
  
  // Handle prerequisite actions
  const handleAddPrerequisite = () => {
    if (newPrerequisite && !currentCourse.prerequisites.includes(newPrerequisite)) {
      setCurrentCourse({
        ...currentCourse,
        prerequisites: [...currentCourse.prerequisites, newPrerequisite],
      });
      setNewPrerequisite('');
    }
  };
  
  const handleRemovePrerequisite = (prerequisite: string) => {
    setCurrentCourse({
      ...currentCourse,
      prerequisites: currentCourse.prerequisites.filter((p) => p !== prerequisite),
    });
  };
  
  // Handle learning outcome actions
  const handleAddOutcome = () => {
    if (newOutcome && !currentCourse.outcomes.includes(newOutcome)) {
      setCurrentCourse({
        ...currentCourse,
        outcomes: [...currentCourse.outcomes, newOutcome],
      });
      setNewOutcome('');
    }
  };
  
  const handleRemoveOutcome = (outcome: string) => {
    setCurrentCourse({
      ...currentCourse,
      outcomes: currentCourse.outcomes.filter((o) => o !== outcome),
    });
  };
  
  // Handle module actions
  const handleAddModuleClick = () => {
    setIsEditingModule(false);
    setCurrentModule(null);
    moduleForm.resetFields();
    setIsAddModuleModalVisible(true);
  };
  
  const handleEditModule = (module: Module) => {
    setIsEditingModule(true);
    setCurrentModule(module);
    moduleForm.setFieldsValue({
      title: module.title,
      description: module.description,
      isPublished: module.isPublished,
    });
    setIsAddModuleModalVisible(true);
  };
  
  const handleModuleSubmit = () => {
    moduleForm.validateFields().then((values) => {
      if (isEditingModule && currentModule) {
        // Update existing module
        const updatedModules = currentCourse.modules.map((module) =>
          module.id === currentModule.id
            ? { ...module, ...values }
            : module
        );
        
        setCurrentCourse({
          ...currentCourse,
          modules: updatedModules,
        });
      } else {
        // Add new module
        const newModule: Module = {
          id: generateId(),
          title: values.title,
          description: values.description,
          lessons: [],
          isPublished: values.isPublished,
        };
        
        setCurrentCourse({
          ...currentCourse,
          modules: [...currentCourse.modules, newModule],
        });
      }
      
      moduleForm.resetFields();
      setIsAddModuleModalVisible(false);
      setTimeout(() => {
        messageApi.success(
          isEditingModule ? 'Module updated successfully!' : 'Module added successfully!'
        );
      }, 0);
    });
  };
  
  const handleDeleteModule = (moduleId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this module?',
      content: 'This action cannot be undone. All lessons in this module will also be deleted.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedModules = currentCourse.modules.filter(
          (module) => module.id !== moduleId
        );
        
        setCurrentCourse({
          ...currentCourse,
          modules: updatedModules,
        });
        
        setTimeout(() => {
          messageApi.success('Module deleted successfully!');
        }, 0);
      },
    });
  };
  
  // Handle lesson actions
  const handleAddLessonClick = (moduleId: string, moduleIndex: number) => {
    setIsEditingLesson(false);
    setCurrentLesson(null);
    setCurrentModuleIndex(moduleIndex);
    lessonForm.resetFields();
    
    // Find the module
    const module = currentCourse.modules.find((m) => m.id === moduleId);
    setCurrentModule(module || null);
    
    setIsAddLessonModalVisible(true);
  };
  
  const handleEditLesson = (moduleId: string, lesson: Lesson, moduleIndex: number) => {
    setIsEditingLesson(true);
    setCurrentLesson(lesson);
    setCurrentModuleIndex(moduleIndex);
    
    // Find the module
    const module = currentCourse.modules.find((m) => m.id === moduleId);
    setCurrentModule(module || null);
    
    lessonForm.setFieldsValue({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      isPublished: lesson.isPublished,
    });
    
    setIsAddLessonModalVisible(true);
  };
  
  const handleLessonSubmit = () => {
    lessonForm.validateFields().then((values) => {
      if (currentModule) {
        const updatedModules = [...currentCourse.modules];
        const moduleIndex = updatedModules.findIndex(
          (m) => m.id === currentModule.id
        );
        
        if (moduleIndex !== -1) {
          if (isEditingLesson && currentLesson) {
            // Update existing lesson
            const updatedLessons = updatedModules[moduleIndex].lessons.map(
              (lesson) =>
                lesson.id === currentLesson.id
                  ? {
                      ...lesson,
                      ...values,
                      // Keep existing attachments
                      attachments: currentLesson.attachments,
                    }
                  : lesson
            );
            
            updatedModules[moduleIndex].lessons = updatedLessons;
          } else {
            // Add new lesson
            const newLesson: Lesson = {
              id: generateId(),
              title: values.title,
              description: values.description,
              duration: values.duration || 0,
              videoUrl: values.videoUrl || '',
              attachments: [],
              isPublished: values.isPublished,
            };
            
            updatedModules[moduleIndex].lessons = [
              ...updatedModules[moduleIndex].lessons,
              newLesson,
            ];
          }
          
          setCurrentCourse({
            ...currentCourse,
            modules: updatedModules,
          });
        }
      }
      
      lessonForm.resetFields();
      setIsAddLessonModalVisible(false);
      setTimeout(() => {
        messageApi.success(
          isEditingLesson ? 'Lesson updated successfully!' : 'Lesson added successfully!'
        );
      }, 0);
    });
  };
  
  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this lesson?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedModules = currentCourse.modules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
            };
          }
          return module;
        });
        
        setCurrentCourse({
          ...currentCourse,
          modules: updatedModules,
        });
        
        setTimeout(() => {
          messageApi.success('Lesson deleted successfully!');
        }, 0);
      },
    });
  };
  
  // Handle file uploads
  const handleThumbnailUpload = (file: File) => {
    setCurrentCourse({
      ...currentCourse,
      thumbnail: file,
    });
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent auto upload
  };
  
  // Move modules with drag and drop
  const moveModule = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = currentCourse.modules[dragIndex];
      const newModules = [...currentCourse.modules];
      newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, dragItem);
      
      setCurrentCourse({
        ...currentCourse,
        modules: newModules,
      });
    },
    [currentCourse]
  );
  
  // Move lessons with drag and drop
  const moveLesson = useCallback(
    (moduleIndex: number, dragIndex: number, hoverIndex: number) => {
      const newModules = [...currentCourse.modules];
      const dragItem = newModules[moduleIndex].lessons[dragIndex];
      
      newModules[moduleIndex].lessons.splice(dragIndex, 1);
      newModules[moduleIndex].lessons.splice(hoverIndex, 0, dragItem);
      
      setCurrentCourse({
        ...currentCourse,
        modules: newModules,
      });
    },
    [currentCourse]
  );
  
  // Preview modal content
  const renderPreview = () => {
    // Create a preview version of the course for modal display
    const previewCourse: CourseCardProps = {
      courseId: 0,
      title: currentCourse.title || 'Course Title',
      description: currentCourse.shortDescription || 'Course description...',
      thumbnailUrl: thumbnailPreview || '/placeholder-image.jpg',
      level: currentCourse.level,
      durationHours: currentCourse.durationHours || 0,
      isPublished: currentCourse.isPublished,
      isFree: currentCourse.isFree,
    };
    
    return (
      <div className={styles.previewContainer}>
        <div className={styles.previewCard}>
          <div 
            className={styles.previewThumbnail}
            style={{ backgroundImage: `url(${previewCourse.thumbnailUrl})` }}
          >
            {!thumbnailPreview && <BookOutlined />}
          </div>
          <div className={styles.previewContent}>
            <Title level={4}>{previewCourse.title}</Title>
            <Paragraph>{previewCourse.description}</Paragraph>
            <div className={styles.previewMeta}>
              <Tag color={
                previewCourse.level === 'Beginner' ? 'green' : 
                previewCourse.level === 'Intermediate' ? 'blue' : 
                previewCourse.level === 'Advanced' ? 'purple' : 
                'default'
              }>
                {previewCourse.level}
              </Tag>
              <Text>{previewCourse.durationHours} hours</Text>
              {previewCourse.isFree ? (
                <Tag color="green">Free</Tag>
              ) : (
                <Tag color="volcano">Premium</Tag>
              )}
              {!previewCourse.isPublished && (
                <Tag color="orange">Draft</Tag>
              )}
            </div>
          </div>
        </div>
        
        <Title level={4} style={{ marginTop: '24px' }}>Modules</Title>
        {currentCourse.modules.length > 0 ? (
          <Collapse defaultActiveKey={selectedModule ? [selectedModule] : undefined}>
            {currentCourse.modules.map((module) => (
              <Panel 
                header={
                  <div className={styles.previewModuleHeader}>
                    <span>{module.title}</span>
                    {!module.isPublished && <Tag color="orange" className={styles.draftTag}>Draft</Tag>}
                  </div>
                } 
                key={module.id}
              >
                <Paragraph>{module.description}</Paragraph>
                <List
                  dataSource={module.lessons}
                  renderItem={(lesson) => (
                    <List.Item className={styles.previewLessonItem}>
                      <div className={styles.previewLessonContent}>
                        <VideoCameraOutlined className={styles.previewLessonIcon} />
                        <div>
                          <Text strong>{lesson.title}</Text>
                          <div>
                            <Text type="secondary">{lesson.duration} minutes</Text>
                            {!lesson.isPublished && <Tag color="orange" style={{ marginLeft: '8px' }}>Draft</Tag>}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Paragraph>No modules have been added yet.</Paragraph>
        )}
      </div>
    );
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout className={styles.mainLayout}>
        {contextHolder}
        
        <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <Layout className={styles.contentLayout}>
          <AppHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            userData={{ name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=3' }}
            mobileView={mobileView}
          />
          
          <Content className={styles.siteContent}>
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderContent}>
                <Title level={2}>Create New Course</Title>
                <Space>
                  <Button 
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => setIsPreviewModalVisible(true)}
                  >
                    Preview
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                  >
                    Save Course
                  </Button>
                </Space>
              </div>
            </div>
            
            <div className={styles.courseFormContainer}>
              <Card className={styles.formCard}>
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className={styles.formTabs}
                  items={[
                    {
                      key: 'basic',
                      label: 'Basic Information',
                      children: (
                        <Form
                          form={form}
                          layout="vertical"
                          onFinish={handleFormSubmit}
                          initialValues={{
                            title: currentCourse.title,
                            description: currentCourse.description,
                            shortDescription: currentCourse.shortDescription,
                            category: currentCourse.category,
                            level: currentCourse.level,
                            durationHours: currentCourse.durationHours,
                            isPublished: currentCourse.isPublished,
                            isFree: currentCourse.isFree,
                          }}
                        >
                          <Row gutter={[24, 0]}>
                            <Col xs={24} md={16}>
                              <Form.Item
                                name="title"
                                label="Course Title"
                                rules={[{ required: true, message: 'Please enter course title' }]}
                              >
                                <Input placeholder="e.g., Introduction to JavaScript" />
                              </Form.Item>
                              
                              <Form.Item
                                name="shortDescription"
                                label="Short Description"
                                rules={[{ required: true, message: 'Please enter a short description' }]}
                              >
                                <Input.TextArea
                                  placeholder="Brief overview of the course (shown in course cards)"
                                  rows={2}
                                  maxLength={150}
                                  showCount
                                />
                              </Form.Item>
                              
                              <Form.Item
                                name="description"
                                label="Full Description"
                                rules={[{ required: true, message: 'Please enter a description' }]}
                              >
                                <Input.TextArea
                                  placeholder="Detailed description of the course"
                                  rows={6}
                                />
                              </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                              <Form.Item label="Course Thumbnail">
                                <div className={styles.thumbnailUploader}>
                                  {thumbnailPreview ? (
                                    <div 
                                      className={styles.thumbnailPreview} 
                                      style={{ backgroundImage: `url(${thumbnailPreview})` }}
                                    >
                                      <div className={styles.thumbnailActions}>
                                        <Button
                                          icon={<DeleteOutlined />}
                                          onClick={() => {
                                            setThumbnailPreview(null);
                                            setCurrentCourse({
                                              ...currentCourse,
                                              thumbnail: undefined,
                                              thumbnailUrl: '',
                                            });
                                          }}
                                          danger
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <Upload.Dragger
                                      name="thumbnail"
                                      beforeUpload={handleThumbnailUpload}
                                      showUploadList={false}
                                      accept="image/*"
                                    >
                                      <p className="ant-upload-drag-icon">
                                        <CloudUploadOutlined />
                                      </p>
                                      <p className="ant-upload-text">
                                        Click or drag an image to upload
                                      </p>
                                      <p className="ant-upload-hint">
                                        Recommended size: 1280x720px
                                      </p>
                                    </Upload.Dragger>
                                  )}
                                </div>
                              </Form.Item>
                              
                              <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                              >
                                <Select placeholder="Select a category">
                                  <Option value="programming">Programming</Option>
                                  <Option value="design">Design</Option>
                                  <Option value="business">Business</Option>
                                  <Option value="marketing">Marketing</Option>
                                  <Option value="photography">Photography</Option>
                                  <Option value="music">Music</Option>
                                  <Option value="other">Other</Option>
                                </Select>
                              </Form.Item>
                              
                              <Form.Item
                                name="level"
                                label="Difficulty Level"
                                rules={[{ required: true, message: 'Please select a level' }]}
                              >
                                <Select placeholder="Select difficulty level">
                                  <Option value="Beginner">Beginner</Option>
                                  <Option value="Intermediate">Intermediate</Option>
                                  <Option value="Advanced">Advanced</Option>
                                  <Option value="All Levels">All Levels</Option>
                                </Select>
                              </Form.Item>
                              
                              <Form.Item
                                name="durationHours"
                                label="Estimated Duration (hours)"
                                rules={[{ required: true, message: 'Please enter duration' }]}
                              >
                                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
                              </Form.Item>
                              
                              <Row gutter={[16, 0]}>
                                <Col span={12}>
                                  <Form.Item
                                    name="isFree"
                                    label="Free Course"
                                    valuePropName="checked"
                                  >
                                    <Switch />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    name="isPublished"
                                    label="Published"
                                    valuePropName="checked"
                                  >
                                    <Switch />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          
                          <Divider orientation="left">Tags</Divider>
                          <div className={styles.tagsContainer}>
                            {currentCourse.tags.map((tag) => (
                              <Tag
                                key={tag}
                                closable
                                onClose={() => handleRemoveTag(tag)}
                                className={styles.tag}
                              >
                                {tag}
                              </Tag>
                            ))}
                            <div className={styles.addTagInput}>
                              <Input
                                placeholder="Add tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onPressEnter={handleAddTag}
                              />
                              <Button type="primary" onClick={handleAddTag}>
                                Add
                              </Button>
                            </div>
                          </div>
                        </Form>
                      )
                    },
                    {
                      key: 'modules',
                      label: 'Course Content',
                      children: (
                        <div className={styles.moduleContainer}>
                          <div className={styles.modulesHeader}>
                            <Title level={4}>Modules and Lessons</Title>
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={handleAddModuleClick}
                            >
                              Add Module
                            </Button>
                          </div>
                          
                          {currentCourse.modules.length > 0 ? (
                            <div className={styles.modulesList}>
                              {currentCourse.modules.map((module, index) => (
                                <DraggableItem
                                  key={module.id}
                                  id={module.id}
                                  index={index}
                                  moveItem={moveModule}
                                >
                                  <Card 
                                    className={styles.moduleCard}
                                    title={
                                      <div className={styles.moduleCardHeader}>
                                        <DragOutlined className={styles.dragHandle} />
                                        <span>{module.title}</span>
                                        {!module.isPublished && <Tag color="orange">Draft</Tag>}
                                      </div>
                                    }
                                    extra={
                                      <Space>
                                        <Button
                                          type="text"
                                          icon={<PlusOutlined />}
                                          onClick={() => handleAddLessonClick(module.id, index)}
                                        >
                                          Add Lesson
                                        </Button>
                                        <Button
                                          type="text"
                                          icon={<EditOutlined />}
                                          onClick={() => handleEditModule(module)}
                                        />
                                        <Button
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleDeleteModule(module.id)}
                                        />
                                      </Space>
                                    }
                                  >
                                    <Paragraph className={styles.moduleDescription}>
                                      {module.description}
                                    </Paragraph>
                                    
                                    {module.lessons.length > 0 ? (
                                      <div className={styles.lessonsList}>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                          <DraggableItem
                                            key={lesson.id}
                                            id={lesson.id}
                                            index={lessonIndex}
                                            moveItem={(dragIndex, hoverIndex) => 
                                              moveLesson(index, dragIndex, hoverIndex)
                                            }
                                          >
                                            <div className={styles.lessonItem}>
                                              <div className={styles.lessonItemContent}>
                                                <DragOutlined className={styles.dragHandle} />
                                                <div className={styles.lessonInfo}>
                                                  <div className={styles.lessonTitle}>
                                                    <Text strong>{lesson.title}</Text>
                                                    {!lesson.isPublished && <Tag color="orange">Draft</Tag>}
                                                  </div>
                                                  <div className={styles.lessonMeta}>
                                                    <Text type="secondary">{lesson.duration} minutes</Text>
                                                    <Text type="secondary">{lesson.attachments.length} resources</Text>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className={styles.lessonActions}>
                                                <Button
                                                  type="text"
                                                  icon={<EditOutlined />}
                                                  onClick={() => handleEditLesson(module.id, lesson, index)}
                                                />
                                                <Button
                                                  type="text"
                                                  danger
                                                  icon={<DeleteOutlined />}
                                                  onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                />
                                              </div>
                                            </div>
                                          </DraggableItem>
                                        ))}
                                      </div>
                                    ) : (
                                      <Empty
                                        description="No lessons in this module"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                      />
                                    )}
                                  </Card>
                                </DraggableItem>
                              ))}
                            </div>
                          ) : (
                            <Empty description="No modules have been added yet" />
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'requirements',
                      label: 'Requirements & Outcomes',
                      children: (
                        <div className={styles.requirementsContainer}>
                          <Row gutter={[32, 32]}>
                            <Col xs={24} md={12}>
                              <div className={styles.sectionContainer}>
                                <Title level={4}>Prerequisites</Title>
                                <Paragraph type="secondary">
                                  What should students know before taking this course?
                                </Paragraph>
                                
                                <div className={styles.listContainer}>
                                  {currentCourse.prerequisites.map((prerequisite, index) => (
                                    <div key={index} className={styles.listItem}>
                                      <Text>{prerequisite}</Text>
                                      <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemovePrerequisite(prerequisite)}
                                      />
                                    </div>
                                  ))}
                                  
                                  <div className={styles.addItemInput}>
                                    <Input
                                      placeholder="Add prerequisite"
                                      value={newPrerequisite}
                                      onChange={(e) => setNewPrerequisite(e.target.value)}
                                      onPressEnter={handleAddPrerequisite}
                                    />
                                    <Button type="primary" onClick={handleAddPrerequisite}>
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Col>
                            
                            <Col xs={24} md={12}>
                              <div className={styles.sectionContainer}>
                                <Title level={4}>Learning Outcomes</Title>
                                <Paragraph type="secondary">
                                  What will students be able to do after taking this course?
                                </Paragraph>
                                
                                <div className={styles.listContainer}>
                                  {currentCourse.outcomes.map((outcome, index) => (
                                    <div key={index} className={styles.listItem}>
                                      <Text>{outcome}</Text>
                                      <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveOutcome(outcome)}
                                      />
                                    </div>
                                  ))}
                                  
                                  <div className={styles.addItemInput}>
                                    <Input
                                      placeholder="Add learning outcome"
                                      value={newOutcome}
                                      onChange={(e) => setNewOutcome(e.target.value)}
                                      onPressEnter={handleAddOutcome}
                                    />
                                    <Button type="primary" onClick={handleAddOutcome}>
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )
                    },
                    {
                      key: 'settings',
                      label: 'Settings',
                      children: (
                        <div className={styles.settingsContainer}>
                          <Row gutter={[32, 32]}>
                            <Col xs={24} md={12}>
                              <Card title="Publication Settings" className={styles.settingsCard}>
                                <Form
                                  layout="vertical"
                                  initialValues={{
                                    isPublished: currentCourse.isPublished,
                                    startDate: currentCourse.startDate,
                                    endDate: currentCourse.endDate,
                                  }}
                                >
                                  <Form.Item
                                    name="isPublished"
                                    label="Course Status"
                                    valuePropName="checked"
                                  >
                                    <Checkbox>Publish this course</Checkbox>
                                  </Form.Item>
                                  <Paragraph type="secondary">
                                    When published, this course will be visible to all users.
                                    If unpublished, it will be saved as a draft.
                                  </Paragraph>
                                  
                                  <Form.Item
                                    name="startDate"
                                    label="Enrollment Start Date"
                                  >
                                    <DatePicker style={{ width: '100%' }} />
                                  </Form.Item>
                                  
                                  <Form.Item
                                    name="endDate"
                                    label="Enrollment End Date"
                                  >
                                    <DatePicker style={{ width: '100%' }} />
                                  </Form.Item>
                                  <Paragraph type="secondary">
                                    Leave dates empty for permanent enrollment availability.
                                  </Paragraph>
                                </Form>
                              </Card>
                            </Col>
                            
                            <Col xs={24} md={12}>
                              <Card title="Access Settings" className={styles.settingsCard}>
                                <Form
                                  layout="vertical"
                                  initialValues={{
                                    isFree: currentCourse.isFree,
                                  }}
                                >
                                  <Form.Item
                                    name="isFree"
                                    label="Course Pricing"
                                    valuePropName="checked"
                                  >
                                    <Checkbox>Make this course free</Checkbox>
                                  </Form.Item>
                                  <Paragraph type="secondary">
                                    Free courses are available to all users. Premium courses
                                    require a subscription or purchase.
                                  </Paragraph>
                                  
                                  <Divider />
                                  
                                  <Title level={5}>Course Instructors</Title>
                                  <Paragraph type="secondary">
                                    Instructors who will be able to manage this course.
                                  </Paragraph>
                                  
                                  <div className={styles.listContainer}>
                                    {currentCourse.instructors.length > 0 ? (
                                      currentCourse.instructors.map((instructor) => (
                                        <div key={instructor.id} className={styles.listItem}>
                                          <Text>{instructor.name}</Text>
                                          <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                              setCurrentCourse({
                                                ...currentCourse,
                                                instructors: currentCourse.instructors.filter(
                                                  (i) => i.id !== instructor.id
                                                ),
                                              });
                                            }}
                                          />
                                        </div>
                                      ))
                                    ) : (
                                      <Paragraph>No additional instructors assigned.</Paragraph>
                                    )}
                                  </div>
                                </Form>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
      
      {/* Add Module Modal */}
      <Modal
        title={isEditingModule ? 'Edit Module' : 'Add New Module'}
        open={isAddModuleModalVisible}
        onCancel={() => setIsAddModuleModalVisible(false)}
        onOk={handleModuleSubmit}
        okText={isEditingModule ? 'Save Changes' : 'Add Module'}
        width={600}
      >
        <Form
          form={moduleForm}
          layout="vertical"
          initialValues={{
            title: '',
            description: '',
            isPublished: true,
          }}
        >
          <Form.Item
            name="title"
            label="Module Title"
            rules={[{ required: true, message: 'Please enter module title' }]}
          >
            <Input placeholder="e.g., Introduction to JavaScript Basics" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Module Description"
            rules={[{ required: true, message: 'Please enter module description' }]}
          >
            <Input.TextArea
              placeholder="What will students learn in this module?"
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="isPublished"
            label="Status"
            valuePropName="checked"
          >
            <Checkbox>Publish this module</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Add Lesson Modal */}
      <Modal
        title={isEditingLesson ? 'Edit Lesson' : 'Add New Lesson'}
        open={isAddLessonModalVisible}
        onCancel={() => setIsAddLessonModalVisible(false)}
        onOk={handleLessonSubmit}
        okText={isEditingLesson ? 'Save Changes' : 'Add Lesson'}
        width={700}
      >
        <Form
          form={lessonForm}
          layout="vertical"
          initialValues={{
            title: '',
            description: '',
            duration: 10,
            videoUrl: '',
            isPublished: true,
          }}
        >
          <Form.Item
            name="title"
            label="Lesson Title"
            rules={[{ required: true, message: 'Please enter lesson title' }]}
          >
            <Input placeholder="e.g., Variables and Data Types" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Lesson Description"
            rules={[{ required: true, message: 'Please enter lesson description' }]}
          >
            <Input.TextArea
              placeholder="What will students learn in this lesson?"
              rows={4}
            />
          </Form.Item>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPublished"
                label="Status"
                valuePropName="checked"
              >
                <Checkbox>Publish this lesson</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="videoUrl"
            label="Video URL"
            tooltip="YouTube or Vimeo embed URL"
          >
            <Input placeholder="e.g., https://www.youtube.com/embed/dQw4w9WgXcQ" />
          </Form.Item>
          
          {isEditingLesson && currentLesson && (
            <div className={styles.attachmentsSection}>
              <Title level={5}>Attachments</Title>
              <Paragraph type="secondary">
                Provide additional resources for this lesson.
              </Paragraph>
              
              {currentLesson.attachments.length > 0 ? (
                <List
                  dataSource={currentLesson.attachments}
                  renderItem={(attachment) => (
                    <List.Item
                      actions={[
                        <Button
                          key="delete"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            if (currentLesson) {
                              const updatedAttachments = currentLesson.attachments.filter(
                                (a) => a.id !== attachment.id
                              );
                              setCurrentLesson({
                                ...currentLesson,
                                attachments: updatedAttachments,
                              });
                            }
                          }}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileTextOutlined />}
                        title={attachment.title}
                        description={`${attachment.fileType.toUpperCase()} file`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="No attachments added yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
              
              <Button
                type="dashed"
                icon={<FileAddOutlined />}
                onClick={() => {
                  if (currentLesson) {
                    const newAttachment: Attachment = {
                      id: generateId(),
                      title: 'Sample Attachment',
                      fileType: 'pdf',
                      url: '#',
                    };
                    setCurrentLesson({
                      ...currentLesson,
                      attachments: [...currentLesson.attachments, newAttachment],
                    });
                  }
                }}
                style={{ width: '100%', marginTop: '16px' }}
              >
                Add Attachment
              </Button>
            </div>
          )}
        </Form>
      </Modal>
      
      {/* Preview Modal */}
      <Modal
        title="Course Preview"
        open={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {renderPreview()}
      </Modal>
    </DndProvider>
  );
};

export default CourseCreationPage;