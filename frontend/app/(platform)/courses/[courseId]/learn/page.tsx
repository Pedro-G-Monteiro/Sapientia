"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Layout,
  Menu,
  Button,
  Progress,
  Typography,
  Drawer,
  Space,
  Badge,
  Tabs,
  Spin,
  message,
  Modal,
  List,
  Input,
  Form,
  notification,
  Empty,
  Alert,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  BookOutlined,
  DownloadOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  FullscreenOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  CommentOutlined,
  FileTextTwoTone,
  VideoCameraTwoTone,
  QuestionCircleTwoTone,
  FormOutlined as FormTwoTone,
  PushpinOutlined,
  PushpinFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { getMockCourseById } from "@/services/coursesService";
import styles from "./course-learn.module.css";
import QuizComponent from "@/components/ui/Quiz/QuizComponent";
import VideoPlayer from "@/components/ui/VideoPlayer/VideoPlayer";
import AssignmentComponent from "@/components/ui/Assignment/AssignmentComponent";

const { Title, Text, Paragraph } = Typography;
const { Sider, Content } = Layout;
const { TabPane } = Tabs;

// Definindo tipos baseados na estrutura do banco de dados
interface Resource {
  id: string;
  title: string;
  type: "Video" | "PDF" | "Link" | "Quiz" | "Assignment";
  contentUrl: string;
  contentText?: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: "Multiple Choice" | "True/False" | "Short Answer";
  points: number;
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit: number; // em minutos
  passingScore: number;
  questions: QuizQuestion[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  pointsPossible: number;
  submission?: {
    text?: string;
    fileUrl?: string;
    submittedAt?: string;
    grade?: number;
    feedback?: string;
  };
}

interface Note {
  id: string;
  text: string;
  timestamp: string;
  lessonId: string;
  isPinned: boolean;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: string;
  duration: number; // em segundos
  videoUrl?: string;
  resources: Resource[];
  quiz?: Quiz;
  assignment?: Assignment;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  level?: string;
  progress: number;
  modules: Module[];
  isFavorite?: boolean;
}

const LearningPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados para gerenciar o curso e a navegação
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("content");
  const [favorite, setFavorite] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [quizStartModalVisible, setQuizStartModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [form] = Form.useForm();

  // Estados para quiz
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizTimeRemaining, setQuizTimeRemaining] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Estado para assignment
  const [assignmentText, setAssignmentText] = useState("");
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);

  // Conteúdo do curso simulado (baseado na estrutura do DB)
  const mockModules: Module[] = [
    {
      id: "module-1",
      title: "Getting Started",
      description: "Introduction to the course and setup",
      position: 0,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Introduction to the Course",
          type: "video",
          duration: 625, // segundos
          videoUrl:
            "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          content:
            "Welcome to the course! In this introduction, we'll cover what you'll learn throughout this course. The main objectives are to help you understand the fundamentals and build a solid foundation for more advanced concepts.",
          resources: [
            {
              id: "res-1",
              title: "Course Syllabus",
              type: "PDF",
              contentUrl: "#",
            },
            { id: "res-2", title: "Setup Guide", type: "PDF", contentUrl: "#" },
          ],
          quiz: {
            id: "quiz-1",
            title: "Introduction Quiz",
            description: "Test your understanding of the course introduction",
            timeLimit: 10,
            passingScore: 70,
            questions: [
              {
                id: "q-1",
                text: "What is the primary objective of this course?",
                type: "Multiple Choice",
                points: 10,
                answers: [
                  {
                    id: "a-1",
                    text: "To teach advanced concepts only",
                    isCorrect: false,
                  },
                  {
                    id: "a-2",
                    text: "To build a solid foundation of fundamentals",
                    isCorrect: true,
                  },
                  {
                    id: "a-3",
                    text: "To prepare for certification exams",
                    isCorrect: false,
                  },
                  { id: "a-4", text: "None of the above", isCorrect: false },
                ],
              },
              {
                id: "q-2",
                text: "Is prior knowledge required for this course?",
                type: "True/False",
                points: 5,
                answers: [
                  { id: "a-5", text: "True", isCorrect: false },
                  {
                    id: "a-6",
                    text: "False",
                    isCorrect: true,
                    explanation:
                      "This course is designed for beginners and assumes no prior knowledge.",
                  },
                ],
              },
            ],
          },
          completed: false,
        },
        {
          id: "lesson-1-2",
          title: "Setting Up Your Environment",
          type: "video",
          duration: 945, // segundos
          videoUrl:
            "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          content:
            "Learn how to set up your development environment for optimal learning. We'll install necessary software, configure your workspace, and ensure you're ready to follow along with the hands-on examples in the upcoming lessons.",
          resources: [
            {
              id: "res-3",
              title: "Environment Checklist",
              type: "PDF",
              contentUrl: "#",
            },
            {
              id: "res-4",
              title: "Troubleshooting Guide",
              type: "Link",
              contentUrl: "#",
            },
          ],
          completed: false,
        },
        {
          id: "lesson-1-3",
          title: "Your First Project",
          type: "video",
          duration: 1212, // segundos
          videoUrl:
            "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          content:
            "Create your first project and understand the basics of the technology. In this lesson, you'll build a simple application that demonstrates the core concepts you've learned so far.",
          resources: [
            {
              id: "res-5",
              title: "Project Starter Files",
              type: "Link",
              contentUrl: "#",
            },
            {
              id: "res-6",
              title: "Quick Reference Guide",
              type: "PDF",
              contentUrl: "#",
            },
          ],
          assignment: {
            id: "assignment-1",
            title: "Build Your First Application",
            description:
              "Create a simple application following the guide provided in the lesson. Submit your code and a screenshot of the running application.",
            pointsPossible: 100,
            dueDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // 7 days from now
          },
          completed: false,
        },
      ],
    },
    {
      id: "module-2",
      title: "Core Concepts",
      description: "Fundamental principles and patterns",
      position: 1,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Understanding the Basics",
          type: "text",
          duration: 1110, // segundos
          content: `
            <h2>Understanding the Basics</h2>
            <p>In this lesson, we will explore the fundamental concepts that power the technology we're studying. These concepts form the foundation of everything we'll build throughout this course.</p>
            <h3>Key Principles</h3>
            <ul>
              <li><strong>Principle 1:</strong> Description of the first key principle with examples.</li>
              <li><strong>Principle 2:</strong> Description of the second key principle with examples.</li>
              <li><strong>Principle 3:</strong> Description of the third key principle with examples.</li>
            </ul>
            <p>Understanding these principles will help you make better design decisions and troubleshoot problems more effectively.</p>
            <h3>Core Components</h3>
            <p>Let's examine the core components that make up the system:</p>
            <ol>
              <li>Component A - Responsible for handling user input</li>
              <li>Component B - Processes the data</li>
              <li>Component C - Renders output to the user</li>
            </ol>
            <p>Each component plays a crucial role in the overall system architecture.</p>
          `,
          resources: [
            { id: "res-7", title: "Concept Map", type: "PDF", contentUrl: "#" },
            {
              id: "res-8",
              title: "Interactive Demo",
              type: "Link",
              contentUrl: "#",
            },
          ],
          quiz: {
            id: "quiz-2",
            title: "Core Concepts Quiz",
            description: "Test your understanding of the core concepts",
            timeLimit: 15,
            passingScore: 70,
            questions: [
              {
                id: "q-3",
                text: "Which component is responsible for handling user input?",
                type: "Multiple Choice",
                points: 10,
                answers: [
                  { id: "a-7", text: "Component A", isCorrect: true },
                  { id: "a-8", text: "Component B", isCorrect: false },
                  { id: "a-9", text: "Component C", isCorrect: false },
                  { id: "a-10", text: "None of the above", isCorrect: false },
                ],
              },
              {
                id: "q-4",
                text: "Explain the relationship between the three core components.",
                type: "Short Answer",
                points: 15,
                answers: [
                  {
                    id: "a-11",
                    text: "Component A handles input, Component B processes data, and Component C renders output to the user.",
                    isCorrect: true,
                  },
                ],
              },
            ],
          },
          completed: false,
        },
        {
          id: "lesson-2-2",
          title: "Advanced Techniques",
          type: "video",
          duration: 1335, // segundos
          videoUrl:
            "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          content:
            "Dive deeper into advanced techniques that build upon the core concepts. This lesson explores optimization strategies, design patterns, and best practices for real-world applications.",
          resources: [
            {
              id: "res-9",
              title: "Advanced Techniques PDF",
              type: "PDF",
              contentUrl: "#",
            },
            {
              id: "res-10",
              title: "Code Examples",
              type: "Link",
              contentUrl: "#",
            },
          ],
          completed: false,
        },
      ],
    },
    {
      id: "module-3",
      title: "Practical Applications",
      description: "Real-world projects and case studies",
      position: 2,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Building a Complete Project",
          type: "video",
          duration: 1510, // segundos
          videoUrl:
            "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          content:
            "In this comprehensive lesson, we'll build a complete project from start to finish, applying all the concepts learned so far.",
          resources: [
            {
              id: "res-11",
              title: "Project Requirements",
              type: "PDF",
              contentUrl: "#",
            },
            {
              id: "res-12",
              title: "Solution Repository",
              type: "Link",
              contentUrl: "#",
            },
          ],
          assignment: {
            id: "assignment-2",
            title: "Final Project Implementation",
            description:
              "Implement your own version of the project discussed in this lesson, adding at least two unique features not covered in the instruction.",
            pointsPossible: 100,
            dueDate: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000
            ).toISOString(), // 14 days from now
          },
          completed: false,
        },
      ],
    },
  ];

  // Simula o fetch do curso com base no ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Buscar o curso pelo ID
        const courseId = params?.courseId;
        if (!courseId) {
          router.push("/courses");
          return;
        }

        // Aqui simularemos o curso com os dados estáticos
        // No futuro, isso seria substituído pelo fetch real do banco de dados
        const courseData = await getMockCourseById(Number(courseId));
        if (!courseData) {
          messageApi.error("Course not found");
          router.push("/courses");
          return;
        }

        // Criar um objeto de curso completo com os módulos simulados
        const fullCourse: Course = {
          id: courseData.courseId,
          title: courseData.title,
          description: courseData.description || "",
          level: courseData.level,
          progress: courseData.progress || 0,
          modules: mockModules,
          isFavorite: courseData.isFavorite,
        };

        setCourse(fullCourse);
        setFavorite(courseData.isFavorite || false);

        // Inicializa o primeiro módulo e lição
        if (mockModules.length > 0) {
          setCurrentModule(mockModules[0]);
          if (mockModules[0].lessons.length > 0) {
            setCurrentLesson(mockModules[0].lessons[0]);
          }
        }

        // Carregar notas do localStorage
        const savedNotes = localStorage.getItem(`course_${courseId}_notes`);
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }

        // Carregar lições completadas do localStorage
        const savedCompletedLessons = localStorage.getItem(
          `course_${courseId}_completed_lessons`
        );
        if (savedCompletedLessons) {
          setCompletedLessons(JSON.parse(savedCompletedLessons));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        messageApi.error("Failed to load course");
        setLoading(false);
      }
    };

    fetchCourse();

    // Detecta tamanho da tela para modo mobile
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileMode(isMobile);
      setCollapsed(isMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [params, router, messageApi]);

  // Salvar notas no localStorage quando atualizar
  useEffect(() => {
    if (course?.id && notes.length > 0) {
      localStorage.setItem(`course_${course.id}_notes`, JSON.stringify(notes));
    }
  }, [notes, course?.id]);

  useEffect(() => {
    if (course?.id && completedLessons.length > 0) {
      localStorage.setItem(
        `course_${course.id}_completed_lessons`,
        JSON.stringify(completedLessons)
      );
    }
  }, [completedLessons, course?.id]);

  useEffect(() => {
    if (course && completedLessons.length > 0) {
      const totalLessons = course.modules.reduce(
        (total, module) => total + module.lessons.length,
        0
      );
      const progress = Math.round(
        (completedLessons.length / totalLessons) * 100
      );

      // Evita loops: só atualiza se o valor mudar
      if (course.progress !== progress) {
        setCourse((prevCourse) => {
          if (prevCourse) {
            return {
              ...prevCourse,
              progress,
            };
          }
          return prevCourse;
        });
      }
    }
  }, [completedLessons, course]);

  const handleBack = () => {
    router.push(`/courses/${params?.courseId}`);
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
    messageApi.success(
      !favorite ? "Added to favorites" : "Removed from favorites"
    );
  };

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    const module = course?.modules.find((m) => m.id === moduleId);
    if (module) {
      setCurrentModule(module);

      const lesson = module.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setActiveTabKey("content");

        // Fechar o drawer no modo mobile
        if (mobileMode) {
          setDrawerVisible(false);
        }
      }
    }
  };

  const handleMarkAsCompleted = () => {
    if (currentLesson) {
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
        messageApi.success(
          `Lesson "${currentLesson.title}" marked as completed`
        );

        // Atualizar o objeto de lição atual para refletir a conclusão
        setCurrentLesson({
          ...currentLesson,
          completed: true,
        });

        // Verificar se todas as lições no curso estão completas
        if (course) {
          const totalLessons = course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0
          );
          if (completedLessons.length + 1 >= totalLessons) {
            setCompletionModalVisible(true);
          }
        }
      } else {
        // Remover da lista de completados
        setCompletedLessons(
          completedLessons.filter((id) => id !== currentLesson.id)
        );
        messageApi.info(`Lesson "${currentLesson.title}" marked as incomplete`);

        // Atualizar o objeto de lição atual
        setCurrentLesson({
          ...currentLesson,
          completed: false,
        });
      }
    }
  };

  const navigateToPreviousLesson = () => {
    if (!course || !currentModule || !currentLesson) return;

    // Encontrar o índice do módulo e lição atual
    const moduleIndex = course.modules.findIndex(
      (m) => m.id === currentModule.id
    );
    const lessonIndex = currentModule.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );

    if (lessonIndex > 0) {
      // Navegar para a lição anterior no mesmo módulo
      handleLessonClick(
        currentModule.id,
        currentModule.lessons[lessonIndex - 1].id
      );
    } else if (moduleIndex > 0) {
      // Navegar para a última lição do módulo anterior
      const prevModule = course.modules[moduleIndex - 1];
      const lastLessonIndex = prevModule.lessons.length - 1;
      if (lastLessonIndex >= 0) {
        handleLessonClick(
          prevModule.id,
          prevModule.lessons[lastLessonIndex].id
        );
      }
    }
  };

  const navigateToNextLesson = () => {
    if (!course || !currentModule || !currentLesson) return;

    // Encontrar o índice do módulo e lição atual
    const moduleIndex = course.modules.findIndex(
      (m) => m.id === currentModule.id
    );
    const lessonIndex = currentModule.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );

    if (lessonIndex < currentModule.lessons.length - 1) {
      // Navegar para a próxima lição no mesmo módulo
      handleLessonClick(
        currentModule.id,
        currentModule.lessons[lessonIndex + 1].id
      );
    } else if (moduleIndex < course.modules.length - 1) {
      // Navegar para a primeira lição do próximo módulo
      const nextModule = course.modules[moduleIndex + 1];
      if (nextModule.lessons.length > 0) {
        handleLessonClick(nextModule.id, nextModule.lessons[0].id);
      }
    }
  };

  const startQuiz = () => {
    if (currentLesson?.quiz) {
      setCurrentQuiz(currentLesson.quiz);
      setQuizTimeRemaining(currentLesson.quiz.timeLimit * 60); // Converter para segundos
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizStartModalVisible(false);
      setQuizActive(true);
    }
  };

  const submitQuiz = () => {
    if (!currentQuiz) return;

    // Calcular pontuação
    let earnedPoints = 0;
    let totalPoints = 0;

    currentQuiz.questions.forEach((question) => {
      totalPoints += question.points;

      // Verificar resposta baseada no tipo de questão
      if (
        question.type === "Multiple Choice" ||
        question.type === "True/False"
      ) {
        const selectedAnswerId = quizAnswers[question.id];
        const correctAnswer = question.answers.find(
          (answer) => answer.isCorrect
        );

        if (
          selectedAnswerId &&
          correctAnswer &&
          selectedAnswerId === correctAnswer.id
        ) {
          earnedPoints += question.points;
        }
      } else if (question.type === "Short Answer") {
        const userAnswer = quizAnswers[question.id]?.toLowerCase().trim();
        const correctAnswer = question.answers[0].text.toLowerCase().trim();

        // Verificação simples para respostas curtas
        // Na vida real, você provavelmente usaria um algoritmo mais sofisticado
        if (userAnswer && userAnswer === correctAnswer) {
          earnedPoints += question.points;
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= currentQuiz.passingScore;

    // Se passou, marcar a lição como concluída
    if (passed && currentLesson) {
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
        setCurrentLesson({
          ...currentLesson,
          completed: true,
        });
      }
    }

    // Mostrar resultado
    notificationApi.open({
      message: passed ? "Quiz Passed!" : "Quiz Failed",
      description: `You scored ${percentage}% (${earnedPoints}/${totalPoints} points). ${
        passed
          ? "Congratulations!"
          : "Please review the material and try again."
      }`,
      icon: passed ? (
        <CheckCircleOutlined style={{ color: "#52c41a" }} />
      ) : (
        <QuestionCircleOutlined style={{ color: "#f5222d" }} />
      ),
      duration: 0,
    });

    setQuizSubmitted(true);
  };

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerId,
    });
  };

  const handleShortAnswerChange = (questionId: string, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer,
    });
  };

  const handleAssignmentSubmit = () => {
    // Simular envio do trabalho
    if (currentLesson?.assignment) {
      messageApi.success("Assignment submitted successfully!");
      setAssignmentModalVisible(false);

      // Marcar lição como concluída após envio
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
        setCurrentLesson({
          ...currentLesson,
          completed: true,
        });
      }
    }
  };

  const addNote = () => {
    if (currentNote.trim() && currentLesson) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        text: currentNote.trim(),
        timestamp: new Date().toISOString(),
        lessonId: currentLesson.id,
        isPinned: false,
      };

      setNotes([newNote, ...notes]);
      setCurrentNote("");
      setNoteModalVisible(false);
      messageApi.success("Note added successfully");
    }
  };

  const togglePinNote = (noteId: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    );

    // Reordenar para que as notas fixadas apareçam primeiro
    const pinnedNotes = updatedNotes.filter((note) => note.isPinned);
    const unpinnedNotes = updatedNotes.filter((note) => !note.isPinned);

    setNotes([...pinnedNotes, ...unpinnedNotes]);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    messageApi.success("Note deleted successfully");
  };

  // Renderizar o menu de navegação do curso
  const renderCourseMenu = () => {
    if (!course) return null;

    return (
      <Menu
        mode="inline"
        className={styles.courseMenu}
        selectedKeys={[currentLesson?.id || ""]}
        defaultOpenKeys={[currentModule?.id || ""]}
        items={course.modules.map((module) => ({
          key: module.id,
          label: <span className={styles.moduleTitle}>{module.title}</span>,
          children: module.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isActive = currentLesson?.id === lesson.id;

            return {
              key: lesson.id,
              label: (
                <div className={styles.lessonItemContent}>
                  <div className={styles.lessonItemIcon}>
                    {isCompleted ? (
                      <CheckCircleOutlined className={styles.completedIcon} />
                    ) : lesson.type === "video" ? (
                      <PlayCircleOutlined />
                    ) : lesson.type === "text" ? (
                      <FileTextOutlined />
                    ) : (
                      <FileTextOutlined />
                    )}
                  </div>
                  <div className={styles.lessonItemTexts}>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    <span className={styles.lessonDuration}>
                      {Math.floor(lesson.duration / 60)}:
                      {(lesson.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  {(lesson.quiz || lesson.assignment) && (
                    <div className={styles.lessonItemBadges}>
                      {lesson.quiz && <Badge status="processing" text="" />}
                      {lesson.assignment && <Badge status="warning" text="" />}
                    </div>
                  )}
                </div>
              ),
              onClick: () => handleLessonClick(module.id, lesson.id),
              className: `${styles.lessonItem} ${
                isActive ? styles.activeLesson : ""
              }`,
            };
          }),
        }))}
      />
    );
  };

  // Renderizar os detalhes da lição atual
  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <div className={styles.emptyLesson}>
          <FileTextTwoTone style={{ fontSize: 48, marginBottom: 16 }} />
          <Text>Select a lesson to start learning</Text>
        </div>
      );
    }

    if (quizActive && currentLesson.quiz) {
      return (
        <QuizComponent
          quiz={currentLesson.quiz}
          onComplete={(score, passed) => {
            setQuizActive(false);
            if (passed) {
              handleMarkAsCompleted();
              messageApi.success(
                `Quiz completed with ${score}% score. You've passed!`
              );
            } else {
              messageApi.error(
                `Quiz completed with ${score}% score. You need ${currentLesson.quiz?.passingScore}% to pass.`
              );
            }
          }}
          onCancel={() => setQuizActive(false)}
        />
      );
    }

    // Renderizar conteúdo com base no tipo de lição
    switch (currentLesson.type) {
      case "video":
        return (
          <div className={styles.videoContainer}>
            <VideoPlayer
              src={currentLesson.videoUrl || ""}
              title={currentLesson.title}
              onComplete={() => {
                if (!completedLessons.includes(currentLesson.id)) {
                  handleMarkAsCompleted();
                }
              }}
            />
            <div className={styles.videoDescription}>
              <Title level={4}>{currentLesson.title}</Title>
              <Paragraph>{currentLesson.content}</Paragraph>
            </div>

            {/* Ações da lição */}
            {renderLessonActions()}
          </div>
        );

      case "text":
        return (
          <div className={styles.textContainer}>
            <div
              className={styles.textContent}
              dangerouslySetInnerHTML={{ __html: currentLesson.content }}
            />

            {/* Ações da lição */}
            {renderLessonActions()}
          </div>
        );

      default:
        return (
          <div className={styles.genericContent}>
            <Title level={4}>{currentLesson.title}</Title>
            <Paragraph>{currentLesson.content}</Paragraph>

            {/* Ações da lição */}
            {renderLessonActions()}
          </div>
        );
    }
  };

  // Renderizar as ações disponíveis para a lição atual
  const renderLessonActions = () => {
    if (!currentLesson) return null;

    return (
      <div className={styles.lessonActions}>
        {currentLesson.quiz && (
          <Button
            type="primary"
            icon={<FormOutlined />}
            className={styles.quizButton}
            onClick={() => setQuizStartModalVisible(true)}
          >
            Take Quiz
          </Button>
        )}

        {currentLesson.assignment && (
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            className={styles.assignmentButton}
            onClick={() => setAssignmentModalVisible(true)}
          >
            View Assignment
          </Button>
        )}

        <Button
          className={styles.quizButton}
          type={
            completedLessons.includes(currentLesson.id) ? "default" : "primary"
          }
          icon={
            completedLessons.includes(currentLesson.id) ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
          onClick={handleMarkAsCompleted}
        >
          {completedLessons.includes(currentLesson.id)
            ? "Completed"
            : "Mark as Completed"}
        </Button>

        <Button
          className={styles.quizButton}
          icon={<FormOutlined />}
          onClick={() => setNoteModalVisible(true)}
        >
          Add Note
        </Button>
      </div>
    );
  };

  // Renderizar recursos da lição
  const renderLessonResources = () => {
    if (
      !currentLesson ||
      !currentLesson.resources ||
      currentLesson.resources.length === 0
    ) {
      return (
        <Empty
          description="No resources available for this lesson"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <List
        className={styles.resourcesList}
        itemLayout="horizontal"
        dataSource={currentLesson.resources}
        renderItem={(resource) => {
          // Ícone baseado no tipo de recurso
          let icon;
          switch (resource.type) {
            case "PDF":
              icon = <FileTextTwoTone />;
              break;
            case "Video":
              icon = <VideoCameraTwoTone />;
              break;
            case "Quiz":
              icon = <QuestionCircleTwoTone />;
              break;
            case "Assignment":
              icon = <FormTwoTone />;
              break;
            default:
              icon = <FileTextTwoTone />;
          }

          return (
            <List.Item
              actions={[
                <Button
                  key="download"
                  type="link"
                  icon={<DownloadOutlined />}
                  href={resource.contentUrl}
                  target="_blank"
                >
                  Download
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={icon}
                title={resource.title}
                description={`${resource.type} resource`}
              />
            </List.Item>
          );
        }}
      />
    );
  };

  // Renderizar notas da lição
  const renderLessonNotes = () => {
    // Filtrar notas da lição atual
    const currentLessonNotes = currentLesson
      ? notes.filter((note) => note.lessonId === currentLesson.id)
      : [];

    if (currentLessonNotes.length === 0) {
      return (
        <div className={styles.emptyNotes}>
          <FileTextOutlined style={{ fontSize: 40, color: "#d9d9d9" }} />
          <Text type="secondary">No notes for this lesson yet</Text>
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => setNoteModalVisible(true)}
            className={styles.addNoteButton}
          >
            Add Note
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className={styles.notesHeader}>
          <Title level={5}>Your Notes</Title>
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => setNoteModalVisible(true)}
          >
            Add Note
          </Button>
        </div>

        <List
          className={styles.notesList}
          itemLayout="vertical"
          dataSource={currentLessonNotes}
          renderItem={(note) => (
            <div
              key={note.id}
              className={`${styles.noteItem} ${
                note.isPinned ? styles.pinnedNote : ""
              }`}
            >
              <div className={styles.noteContent}>
                <Paragraph>{note.text}</Paragraph>
                <Text type="secondary" className={styles.noteTimestamp}>
                  {new Date(note.timestamp).toLocaleString()}
                </Text>
              </div>
              <Space>
                <Button
                  type="text"
                  icon={note.isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                  onClick={() => togglePinNote(note.id)}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteNote(note.id)}
                />
              </Space>
            </div>
          )}
        />
      </>
    );
  };

  // Se estiver carregando, mostrar spinner
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text className={styles.loadingText}>Loading course content...</Text>
      </div>
    );
  }

  // Se não encontrou o curso
  if (!course) {
    return (
      <div className={styles.notFoundMessage}>
        <Title level={3}>Course Not Found</Title>
        <Text>
          The course you're looking for doesn't exist or has been removed.
        </Text>
        <Button type="primary" onClick={handleBack}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <Layout className={styles.learningLayout}>
      {contextHolder}
      {notificationContextHolder}

      {/* Sidebar com navegação do curso - escondido no modo mobile */}
      {!mobileMode && (
        <Sider
          width={280}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          className={styles.courseSidebar}
        >
          <div className={styles.courseNavHeader}>
            <div className={styles.courseInfo}>
              <Button
                type="link"
                icon={<LeftOutlined />}
                onClick={handleBack}
                style={{ paddingLeft: 0 }}
              >
                Back to Course
              </Button>
              <br />
              <Title level={4} className={styles.courseTitle}>
                {course.title}
              </Title>
              <Progress percent={course.progress} size="small" />
            </div>
          </div>

          <div className={styles.courseNavContent}>{renderCourseMenu()}</div>
        </Sider>
      )}

      {/* Drawer para navegação em modo mobile */}
      <Drawer
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {course.title}
            </Title>
          </div>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerProgress}>
            <Text>Course Progress</Text>
            <Progress percent={course.progress} size="small" />
          </div>
          {renderCourseMenu()}
        </div>
      </Drawer>

      {/* Layout principal */}
      <Layout className={styles.mainContentLayout}>
        <div className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            {mobileMode && (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerVisible(true)}
                className={styles.collapseButton}
              />
            )}

            <Button
              icon={<LeftOutlined />}
              onClick={handleBack}
              className={styles.backButton}
            >
              <span>Back</span>
            </Button>
          </div>

          <div className={styles.headerCenter}>
            <div className={styles.lessonNavigation}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={navigateToPreviousLesson}
              />

              <span className={styles.lessonPosition}>
                Lesson{" "}
                {currentModule?.lessons.findIndex(
                  (l) => l.id === currentLesson?.id
                ) ?? 0 + 1}{" "}
                of {currentModule?.lessons.length}
              </span>

              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                onClick={navigateToNextLesson}
              />
            </div>
          </div>

          <div className={styles.headerRight}>
            <Button
              type="text"
              icon={
                favorite ? (
                  <HeartFilled style={{ color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={toggleFavorite}
              className={styles.actionButton}
            />

            <Button
              type="text"
              icon={<FullscreenOutlined />}
              className={styles.actionButton}
            />

            <Button
              type="text"
              icon={<ShareAltOutlined />}
              className={styles.actionButton}
            />
          </div>
        </div>

        <Content className={styles.lessonContent}>
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            className={styles.contentTabs}
          >
            <TabPane
              tab={
                <span>
                  <ReadOutlined /> Content
                </span>
              }
              key="content"
            >
              {renderLessonContent()}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <BookOutlined /> Resources
                </span>
              }
              key="resources"
            >
              {renderLessonResources()}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CommentOutlined /> Notes
                </span>
              }
              key="notes"
            >
              {renderLessonNotes()}
            </TabPane>
          </Tabs>
        </Content>
      </Layout>

      {/* Modal para adicionar notas */}
      <Modal
        title="Add Note"
        open={noteModalVisible}
        onCancel={() => setNoteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setNoteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={addNote}>
            Save Note
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={6}
          placeholder="Write your note here..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
        />
      </Modal>

      {/* Modal para conclusão do curso */}
      <Modal
        title="Congratulations!"
        open={completionModalVisible}
        onCancel={() => setCompletionModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setCompletionModalVisible(false)}>
            Continue Learning
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setCompletionModalVisible(false);
              router.push("/courses");
            }}
          >
            Back to Courses
          </Button>,
        ]}
      >
        <div className={styles.completionModalContent}>
          <CheckCircleOutlined
            className={styles.completionIcon}
            style={{ color: "#52c41a" }}
          />
          <Title level={4}>Course Completed!</Title>
          <Paragraph>
            You have successfully completed all lessons in this course.
            Congratulations on your achievement!
          </Paragraph>
        </div>
      </Modal>

      {/* Modal para iniciar quiz */}
      <Modal
        title="Ready to take the quiz?"
        open={quizStartModalVisible}
        onCancel={() => setQuizStartModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setQuizStartModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="start" type="primary" onClick={startQuiz}>
            Start Quiz
          </Button>,
        ]}
      >
        <div className={styles.quizModalContent}>
          <Title level={5}>{currentLesson?.quiz?.title}</Title>
          <Paragraph>{currentLesson?.quiz?.description}</Paragraph>

          <div className={styles.quizInfo}>
            <div className={styles.quizInfoItem}>
              <ClockCircleOutlined /> Time Limit:{" "}
              {currentLesson?.quiz?.timeLimit} minutes
            </div>
            <div className={styles.quizInfoItem}>
              <QuestionCircleOutlined /> Questions:{" "}
              {currentLesson?.quiz?.questions.length}
            </div>
            <div className={styles.quizInfoItem}>
              <CheckCircleOutlined /> Passing Score:{" "}
              {currentLesson?.quiz?.passingScore}%
            </div>
          </div>

          <Alert
            message="Important"
            description="Once you start the quiz, the timer will begin and you must complete it. Make sure you have enough time available."
            type="warning"
            showIcon
          />

          <div className={styles.quizModalNote}>
            You can mark questions to review later and navigate between
            questions freely during the quiz.
          </div>
        </div>
      </Modal>

      {/* Modal para visualizar/submeter trabalho */}
      <Modal
        title="Assignment"
        open={assignmentModalVisible}
        onCancel={() => setAssignmentModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className={styles.assignmentModalContent}>
          {currentLesson?.assignment && (
            <AssignmentComponent
              assignment={{
                id: currentLesson.assignment.id,
                title: currentLesson.assignment.title,
                description: currentLesson.assignment.description,
                dueDate: currentLesson.assignment.dueDate,
                pointsPossible: currentLesson.assignment.pointsPossible,
                submission: currentLesson.assignment.submission
                  ? {
                      ...currentLesson.assignment.submission,
                      // Adicionar a propriedade status obrigatória que estava faltando
                      status: currentLesson.assignment.submission.grade
                        ? "graded"
                        : currentLesson.assignment.submission.submittedAt
                        ? "submitted"
                        : new Date() >
                          new Date(currentLesson.assignment.dueDate || "")
                        ? "late"
                        : "not_submitted",
                      // Converter fileUrl para o formato files[] esperado, se existir
                      files: currentLesson.assignment.submission.fileUrl
                        ? [
                            {
                              uid: "-1",
                              name: "Submitted file",
                              status: "done",
                              url: currentLesson.assignment.submission.fileUrl,
                            },
                          ]
                        : undefined,
                    }
                  : { status: "not_submitted" },
              }}
              onSubmit={handleAssignmentSubmit}
              onCancel={() => setAssignmentModalVisible(false)}
            />
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default LearningPage;
