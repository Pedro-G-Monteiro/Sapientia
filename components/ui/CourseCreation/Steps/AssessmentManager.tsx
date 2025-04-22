"use client";

import React, { useState } from "react";
import { Tabs, Typography, Empty, Card, Button, Collapse } from "antd";
import { FormOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import QuizModal from "../Modals/QuizModal";
import AssignmentModal from "../Modals/AssignmentModal";
import styles from "./AssessmentManager.module.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: Array<{
    id: string;
    title: string;
    content: string;
    durationMinutes: number;
    position: number;
    resources: any[];
    quizzes: any[];
    assignments: any[];
  }>;
}

interface AssessmentManagerProps {
  modules: Module[];
  onSave: (updatedModules: Module[]) => void;
}

const AssessmentManager: React.FC<AssessmentManagerProps> = ({ modules, onSave }) => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    moduleId: string;
    lessonId: string;
    moduleName: string;
    lessonName: string;
  } | null>(null);

  const showQuizModal = (
    moduleId: string,
    lessonId: string,
    moduleName: string,
    lessonName: string
  ) => {
    setSelectedLesson({ moduleId, lessonId, moduleName, lessonName });
    setQuizModalVisible(true);
  };

  const handleQuizSave = (quiz: any) => {
    if (!selectedLesson) return;
  
    const updatedModules = modules.map((mod) => {
      if (mod.id !== selectedLesson.moduleId) return mod;
  
      return {
        ...mod,
        lessons: mod.lessons.map((lesson) => {
          if (lesson.id !== selectedLesson.lessonId) return lesson;
  
          return {
            ...lesson,
            quizzes: [...(lesson.quizzes || []), quiz],
          };
        }),
      };
    });
  
    setQuizModalVisible(false);
    onSave(updatedModules);
  };
  
  const handleAssignmentSave = (assignment: any) => {
    if (!selectedLesson) return;
  
    const updatedModules = modules.map((mod) => {
      if (mod.id !== selectedLesson.moduleId) return mod;
  
      return {
        ...mod,
        lessons: mod.lessons.map((lesson) => {
          if (lesson.id !== selectedLesson.lessonId) return lesson;
  
          return {
            ...lesson,
            assignments: [...(lesson.assignments || []), assignment],
          };
        }),
      };
    });
  
    setAssignmentModalVisible(false);
    onSave(updatedModules);
  };

  const showAssignmentModal = (
    moduleId: string,
    lessonId: string,
    moduleName: string,
    lessonName: string
  ) => {
    setSelectedLesson({ moduleId, lessonId, moduleName, lessonName });
    setAssignmentModalVisible(true);
  };

  if (modules.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Empty
          description="You need to create modules and lessons before adding assessments"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className={styles.emptyStateAction}>
          <Button type="primary" onClick={() => setActiveTab("quizzes")}>
            Create Course Content First
          </Button>
        </div>
      </div>
    );
  }

  const hasLessons = modules.some((module) => module.lessons.length > 0);
  if (!hasLessons) {
    return (
      <div className={styles.emptyState}>
        <Empty
          description="You need to add lessons to your modules before creating assessments"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className={styles.emptyStateAction}>
          <Button type="primary" onClick={() => setActiveTab("quizzes")}>
            Add Lessons First
          </Button>
        </div>
      </div>
    );
  }

  const quizzesTabContent = (
    <div className={styles.tabContent}>
      <div className={styles.tabDescription}>
        <Text>
          Create quizzes to test knowledge with multiple-choice, true/false, and
          short answer questions.
        </Text>
      </div>
      <Collapse
        className={styles.modulesCollapse}
        items={modules.map((module, moduleIndex) => ({
          key: module.id,
          label: (
            <span>
              Module {moduleIndex + 1}: {module.title}
            </span>
          ),
          children:
            module.lessons.length === 0 ? (
              <Empty
                description="No lessons in this module"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className={styles.lessonEmpty}
              />
            ) : (
              <div className={styles.lessonsList}>
                {module.lessons.map((lesson, lessonIndex) => (
                  <Card
                    key={lesson.id}
                    title={
                      <span>
                        Lesson {lessonIndex + 1}: {lesson.title}
                      </span>
                    }
                    className={styles.lessonAssessmentCard}
                  >
                    <div className={styles.quizzesSection}>
                      <div className={styles.sectionHeader}>
                        <Title level={5}>Quizzes</Title>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            showQuizModal(
                              module.id,
                              lesson.id,
                              `Module ${moduleIndex + 1}: ${module.title}`,
                              `Lesson ${lessonIndex + 1}: ${lesson.title}`
                            )
                          }
                        >
                          Add Quiz
                        </Button>
                      </div>
                      {lesson.quizzes && lesson.quizzes.length > 0 ? (
                        <div className={styles.quizList}>
                          {lesson.quizzes.map((quiz, index) => (
                            <div key={index} className={styles.quizItem}>
                              <div className={styles.quizInfo}>
                                <Text strong>{quiz.title}</Text>
                                <Text type="secondary">
                                  {quiz.questions?.length || 0} questions
                                </Text>
                              </div>
                              <Button type="link">Edit</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty
                          description="No quizzes for this lesson"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className={styles.assessmentEmpty}
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ),
        }))}
      />
    </div>
  );

  const assignmentsTabContent = (
    <div className={styles.tabContent}>
      <div className={styles.tabDescription}>
        <Text>
          Create assignments that require students to submit detailed work for
          evaluation.
        </Text>
      </div>
      <Collapse
        className={styles.modulesCollapse}
        items={modules.map((module, moduleIndex) => ({
          key: module.id,
          label: (
            <span>
              Module {moduleIndex + 1}: {module.title}
            </span>
          ),
          children:
            module.lessons.length === 0 ? (
              <Empty
                description="No lessons in this module"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className={styles.lessonEmpty}
              />
            ) : (
              <div className={styles.lessonsList}>
                {module.lessons.map((lesson, lessonIndex) => (
                  <Card
                    key={lesson.id}
                    title={
                      <span>
                        Lesson {lessonIndex + 1}: {lesson.title}
                      </span>
                    }
                    className={styles.lessonAssessmentCard}
                  >
                    <div className={styles.assignmentsSection}>
                      <div className={styles.sectionHeader}>
                        <Title level={5}>Assignments</Title>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            showAssignmentModal(
                              module.id,
                              lesson.id,
                              `Module ${moduleIndex + 1}: ${module.title}`,
                              `Lesson ${lessonIndex + 1}: ${lesson.title}`
                            )
                          }
                        >
                          Add Assignment
                        </Button>
                      </div>
                      {lesson.assignments && lesson.assignments.length > 0 ? (
                        <div className={styles.assignmentList}>
                          {lesson.assignments.map((assignment, index) => (
                            <div key={index} className={styles.assignmentItem}>
                              <div className={styles.assignmentInfo}>
                                <Text strong>{assignment.title}</Text>
                                <Text type="secondary">
                                  Due date:{" "}
                                  {assignment.dueDate
                                    ? new Date(
                                        assignment.dueDate
                                      ).toLocaleDateString()
                                    : "No due date"}
                                </Text>
                              </div>
                              <Button type="link">Edit</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty
                          description="No assignments for this lesson"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className={styles.assessmentEmpty}
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ),
        }))}
      />
    </div>
  );

  return (
    <div className={styles.assessmentManagerContainer}>
      <div className={styles.managerHeader}>
        <Title level={4}>Course Assessments</Title>
        <Text type="secondary" className={styles.headerDescription}>
          Create quizzes and assignments to evaluate student understanding
        </Text>
      </div>

      <Tabs
        defaultActiveKey="quizzes"
        onChange={setActiveTab}
        className={styles.assessmentTabs}
        items={[
          {
            key: "quizzes",
            label: (
              <span>
                <QuestionCircleOutlined /> Quizzes
              </span>
            ),
            children: quizzesTabContent,
          },
          {
            key: "assignments",
            label: (
              <span>
                <FormOutlined /> Assignments
              </span>
            ),
            children: assignmentsTabContent,
          },
        ]}
      />

      {quizModalVisible && (
        <QuizModal
          visible={quizModalVisible}
          onClose={() => setQuizModalVisible(false)}
          lessonInfo={selectedLesson}
          onSave={handleQuizSave}
        />
      )}

      {assignmentModalVisible && (
        <AssignmentModal
          visible={assignmentModalVisible}
          onClose={() => setAssignmentModalVisible(false)}
          lessonInfo={selectedLesson}
          onSave={handleAssignmentSave}
        />
      )}
    </div>
  );
};

export default AssessmentManager;
