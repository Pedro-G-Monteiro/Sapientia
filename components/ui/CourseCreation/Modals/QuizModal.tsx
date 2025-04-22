// components/ui/CourseCreation/Modals/QuizModal.tsx
"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Tabs,
  Typography,
  message,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./QuizModal.module.css";

const { TextArea } = Input;

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  lessonInfo: {
    moduleId: string;
    lessonId: string;
    moduleName: string;
    lessonName: string;
  } | null;
  onSave: (quiz: Quiz) => void;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  points: number;
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

interface Quiz {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: QuizQuestion[];
}

const QuizModal: React.FC<QuizModalProps> = ({
  visible,
  onClose,
  lessonInfo,
  onSave
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    timeLimit: 30,
    passingScore: 70,
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [questionForm] = Form.useForm();
  const [questionType, setQuestionType] = useState<string>("multiple_choice");
  const [messageApi, contextHolder] = message.useMessage();

  const addNewQuestion = () => {
    const now = Date.now();
    setCurrentQuestion({
      id: `q-${now}`,
      text: "",
      type: "multiple_choice",
      points: 10,
      answers: [
        { id: `a-${now}-1`, text: "", isCorrect: false },
        { id: `a-${now}-2`, text: "", isCorrect: false },
      ],
    });
    questionForm.resetFields();
    setQuestionType("multiple_choice");
    setActiveTab("2");
  };

  const saveQuestion = () => {
    questionForm.validateFields().then((values) => {
      if (!currentQuestion) return;

      const updatedQuestion: QuizQuestion = {
        ...currentQuestion,
        text: values.questionText,
        type: values.questionType,
        points: values.points,
        answers: values.answers.map((answer: any, index: number) => ({
          ...(currentQuestion.answers[index] || {
            id: `a-${Date.now()}-${index}`,
          }),
          text: answer.text,
          isCorrect: answer.isCorrect || false,
          explanation: answer.explanation,
        })),
      };

      const updatedQuestions = [...quiz.questions];
      const existingIndex = updatedQuestions.findIndex(
        (q) => q.id === updatedQuestion.id
      );
      if (existingIndex >= 0) updatedQuestions[existingIndex] = updatedQuestion;
      else updatedQuestions.push(updatedQuestion);

      setQuiz({ ...quiz, questions: updatedQuestions });
      setCurrentQuestion(null);
      messageApi.success("Question saved");
      setActiveTab("1");
    });
  };

  const editQuestion = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (question) {
      setCurrentQuestion(question);
      setQuestionType(question.type);
      setTimeout(() => {
        questionForm.setFieldsValue({
          questionText: question.text,
          questionType: question.type,
          points: question.points,
          answers: question.answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
            explanation: a.explanation,
          })),
        });
      }, 0);
      setActiveTab("2");
    }
  };

  const deleteQuestion = (questionId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this question?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setQuiz({
          ...quiz,
          questions: quiz.questions.filter((q) => q.id !== questionId),
        });
        messageApi.success("Question deleted");
      },
    });
  };

  const renderAnswerOptions = () => {
    if (questionType === "true_false") {
      return (
        <Form.Item name={["answers", 0, "isCorrect"]} label="Correct Answer">
          <Radio.Group>
            <Radio value={true}>True</Radio>
            <Radio value={false}>False</Radio>
          </Radio.Group>
        </Form.Item>
      );
    }
    if (questionType === "short_answer") {
      return (
        <Form.Item name={["answers", 0, "text"]} label="Correct Answer">
          <Input placeholder="Expected answer" />
        </Form.Item>
      );
    }
    return (
      <Form.List name="answers">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} className={styles.answerItem}>
                <Form.Item name={[field.name, "text"]}>
                  <Input placeholder={`Answer option ${index + 1}`} />
                </Form.Item>
                <Form.Item
                  name={[field.name, "isCorrect"]}
                  valuePropName="checked"
                >
                  <Checkbox>Correct</Checkbox>
                </Form.Item>
                <Form.Item name={[field.name, "explanation"]}>
                  <Input placeholder="Explanation (optional)" />
                </Form.Item>
                <Button danger onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Form.Item>
              <Button onClick={add} icon={<PlusOutlined />}>
                Add Answer
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={lessonInfo?.lessonName}
        open={visible}
        onCancel={onClose}
        width={800}
        footer={null}
        className={styles.quizModal}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "1",
              label: "Quiz Details",
              children: (
                <div className={styles.tabContent}>
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                      title: quiz.title,
                      description: quiz.description,
                      timeLimit: quiz.timeLimit,
                      passingScore: quiz.passingScore,
                    }}
                  >
                    <Form.Item
                      name="title"
                      label="Quiz Title"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                      <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                      name="timeLimit"
                      label="Time Limit (minutes)"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      name="passingScore"
                      label="Passing Score (%)"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} max={100} />
                    </Form.Item>
                  </Form>
                  <Divider>Questions</Divider>
                  {quiz.questions.map((q, i) => (
                    <Card key={q.id} title={`Question ${i + 1}`}>
                      {" "}
                      <p>{q.text}</p>{" "}
                    </Card>
                  ))}
                  <Button onClick={addNewQuestion} icon={<PlusOutlined />}>
                    Add Question
                  </Button>
                  <div className={styles.modalFooter}>
                    <Space>
                      <Button onClick={onClose}>Cancel</Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          form.validateFields().then((values) => {
                            const fullQuiz: Quiz = {
                              ...quiz,
                              ...values, // title, description, timeLimit, passingScore
                            };

                            // envia o quiz para o AssessmentManager
                            onSave(fullQuiz);

                            // limpa o modal
                            setQuiz({
                              title: "",
                              description: "",
                              timeLimit: 30,
                              passingScore: 70,
                              questions: [],
                            });
                            form.resetFields();
                            messageApi.success("Quiz saved successfully");
                            onClose();
                          });
                        }}
                      >
                        Save Quiz
                      </Button>
                    </Space>
                  </div>
                </div>
              ),
            },
            {
              key: "2",
              label: "Question Editor",
              disabled: !currentQuestion,
              children: (
                <div className={styles.tabContent}>
                  <Form
                    form={questionForm}
                    layout="vertical"
                    initialValues={{
                      questionText: currentQuestion?.text,
                      questionType: currentQuestion?.type,
                      points: currentQuestion?.points,
                      answers: currentQuestion?.answers,
                    }}
                  >
                    <Form.Item
                      name="questionText"
                      label="Question Text"
                      rules={[{ required: true }]}
                    >
                      <TextArea />
                    </Form.Item>
                    <Form.Item
                      name="questionType"
                      label="Question Type"
                      rules={[{ required: true }]}
                    >
                      <Select
                        options={[
                          {
                            value: "multiple_choice",
                            label: "Multiple Choice",
                          },
                          { value: "true_false", label: "True/False" },
                          { value: "short_answer", label: "Short Answer" },
                        ]}
                        onChange={(value) => {
                          setQuestionType(value);
                          questionForm.setFieldsValue({ answers: undefined });
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="points"
                      label="Points"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    {renderAnswerOptions()}
                  </Form>
                  <div className={styles.modalFooter}>
                    <Space>
                      <Button
                        onClick={() => {
                          setCurrentQuestion(null);
                          setActiveTab("1");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="primary" onClick={saveQuestion}>
                        Save Question
                      </Button>
                    </Space>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default QuizModal;
