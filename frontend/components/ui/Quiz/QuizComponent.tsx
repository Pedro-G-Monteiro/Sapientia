"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Radio,
  Input,
  Button,
  Space,
  Progress,
  Divider,
  Badge,
  Alert,
  Result,
  Statistic,
  Popconfirm,
  notification,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
  FlagOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import styles from "./QuizComponent.module.css";

const { Title, Paragraph, Text } = Typography;
const { Countdown } = Statistic;

interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: "Multiple Choice" | "True/False" | "Short Answer";
  points: number;
  answers: QuizAnswer[];
  flagged?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit: number; // em minutos
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, passed: boolean) => void;
  onCancel?: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  quiz,
  onComplete,
  onCancel,
}) => {
  // Estado para controlar as respostas do usuário
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    quiz.timeLimit * 60 * 1000
  ); // Converter minutos para milissegundos
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [questionsFeedback, setQuestionsFeedback] = useState<
    Record<string, { correct: boolean; points: number }>
  >({});
  const [isTimerWarning, setIsTimerWarning] = useState(false);

  // Effect para alertar quando estiver acabando o tempo
  useEffect(() => {
    if (timeRemaining <= 60000 && !isTimerWarning && !quizSubmitted) {
      // Menos de 1 minuto
      setIsTimerWarning(true);
      notification.warning({
        message: "Time is running out!",
        description:
          "You have less than 1 minute remaining to complete the quiz.",
        duration: 5,
        icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
      });
    }
  }, [timeRemaining, isTimerWarning, quizSubmitted]);

  // Função para calcular o progresso do quiz
  const calculateProgress = () => {
    const answeredCount = Object.keys(userAnswers).length;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  };

  // Navegar para a próxima pergunta
  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navegar para a pergunta anterior
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Salvar resposta do usuário
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerId,
    });
  };

  // Salvar resposta para perguntas de resposta curta
  const handleShortAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    });
  };

  // Marcar/desmarcar questão
  const toggleFlagQuestion = (questionId: string) => {
    if (flaggedQuestions.includes(questionId)) {
      setFlaggedQuestions(flaggedQuestions.filter((id) => id !== questionId));
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionId]);
    }
  };

  // Submeter o quiz para avaliação
  const submitQuiz = () => {
    // Calcular pontuação
    let earnedPoints = 0;
    let totalPoints = 0;
    const feedback: Record<string, { correct: boolean; points: number }> = {};

    quiz.questions.forEach((question) => {
      totalPoints += question.points;

      // Verificar resposta com base no tipo de questão
      if (
        question.type === "Multiple Choice" ||
        question.type === "True/False"
      ) {
        const selectedAnswerId = userAnswers[question.id];
        const correctAnswer = question.answers.find(
          (answer) => answer.isCorrect
        );

        if (
          selectedAnswerId &&
          correctAnswer &&
          selectedAnswerId === correctAnswer.id
        ) {
          earnedPoints += question.points;
          feedback[question.id] = { correct: true, points: question.points };
        } else {
          feedback[question.id] = { correct: false, points: 0 };
        }
      } else if (question.type === "Short Answer") {
        const userAnswer = userAnswers[question.id]?.toLowerCase().trim();
        const correctAnswer = question.answers[0].text.toLowerCase().trim();

        // Verificação básica para respostas curtas
        if (userAnswer && userAnswer === correctAnswer) {
          earnedPoints += question.points;
          feedback[question.id] = { correct: true, points: question.points };
        } else {
          feedback[question.id] = { correct: false, points: 0 };
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    // Atualizar estados
    setQuizScore(percentage);
    setQuizPassed(passed);
    setQuestionsFeedback(feedback);
    setQuizSubmitted(true);
    setShowResults(true);

    // Notificar o componente pai
    onComplete(percentage, passed);
  };

  // Quando o timer expirar
  const handleTimeFinish = () => {
    if (!quizSubmitted) {
      notification.error({
        message: "Time's up!",
        description:
          "The time limit for this quiz has been reached. Your answers have been automatically submitted.",
        duration: 0,
      });

      submitQuiz();
    }
  };

  // Navegação para uma questão específica
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Pergunta atual
  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Renderizar a revisão do quiz
  const renderQuizReview = () => {
    return (
      <div className={styles.quizReview}>
        <Result
          status={quizPassed ? "success" : "error"}
          title={quizPassed ? "Quiz Passed!" : "Quiz Failed"}
          subTitle={`You scored ${quizScore}%. ${
            quizPassed
              ? "Great job!"
              : "You need " + quiz.passingScore + "% to pass."
          }`}
          extra={[
            <Button key="back" onClick={() => setShowResults(false)}>
              Review Answers
            </Button>,
            <Button key="again" type="primary" onClick={onCancel}>
              Exit Quiz
            </Button>,
          ]}
        />

        <Divider />

        <Title level={4}>Questions Review</Title>

        {quiz.questions.map((question, index) => {
          const feedback = questionsFeedback[question.id];
          const isCorrect = feedback?.correct;

          return (
            <Card
              key={question.id}
              className={`${styles.reviewCard} ${
                isCorrect ? styles.correctAnswer : styles.incorrectAnswer
              }`}
              title={
                <div className={styles.reviewCardTitle}>
                  <span>Question {index + 1}</span>
                  {isCorrect ? (
                    <Badge status="success" text="Correct" />
                  ) : (
                    <Badge status="error" text="Incorrect" />
                  )}
                </div>
              }
            >
              <div className={styles.reviewQuestion}>
                <Paragraph strong>{question.text}</Paragraph>

                {question.type === "Multiple Choice" && (
                  <div className={styles.reviewAnswers}>
                    {question.answers.map((answer) => {
                      const isSelected = userAnswers[question.id] === answer.id;
                      const isCorrectAnswer = answer.isCorrect;

                      return (
                        <div
                          key={answer.id}
                          className={`${styles.reviewAnswer} ${
                            isSelected ? styles.selectedAnswer : ""
                          } ${
                            isCorrectAnswer ? styles.correctAnswerOption : ""
                          }`}
                        >
                          {isSelected && isCorrectAnswer && (
                            <CheckCircleOutlined
                              className={styles.correctIcon}
                            />
                          )}
                          {isSelected && !isCorrectAnswer && (
                            <CloseCircleOutlined
                              className={styles.incorrectIcon}
                            />
                          )}
                          {!isSelected && isCorrectAnswer && (
                            <CheckOutlined className={styles.correctIcon} />
                          )}

                          <span>{answer.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === "True/False" && (
                  <div className={styles.reviewAnswers}>
                    {question.answers.map((answer) => {
                      const isSelected = userAnswers[question.id] === answer.id;
                      const isCorrectAnswer = answer.isCorrect;

                      return (
                        <div
                          key={answer.id}
                          className={`${styles.reviewAnswer} ${
                            isSelected ? styles.selectedAnswer : ""
                          } ${
                            isCorrectAnswer ? styles.correctAnswerOption : ""
                          }`}
                        >
                          {isSelected && isCorrectAnswer && (
                            <CheckCircleOutlined
                              className={styles.correctIcon}
                            />
                          )}
                          {isSelected && !isCorrectAnswer && (
                            <CloseCircleOutlined
                              className={styles.incorrectIcon}
                            />
                          )}
                          {!isSelected && isCorrectAnswer && (
                            <CheckOutlined className={styles.correctIcon} />
                          )}

                          <span>{answer.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === "Short Answer" && (
                  <div className={styles.reviewAnswers}>
                    <div className={styles.userShortAnswer}>
                      <Text strong>Your answer:</Text>
                      <Text
                        className={
                          isCorrect ? styles.correctText : styles.incorrectText
                        }
                      >
                        {userAnswers[question.id] || "No answer provided"}
                      </Text>
                    </div>

                    <div className={styles.correctShortAnswer}>
                      <Text strong>Correct answer:</Text>
                      <Text className={styles.correctText}>
                        {question.answers[0].text}
                      </Text>
                    </div>
                  </div>
                )}

                {question.answers.find((a) => a.explanation) && (
                  <div className={styles.answerExplanation}>
                    <Text strong>Explanation:</Text>
                    <Paragraph>
                      {question.answers.find((a) => a.explanation)?.explanation}
                    </Paragraph>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  // Renderizar a pergunta atual
  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null;

    const isFlagged = flaggedQuestions.includes(currentQuestion.id);

    return (
      <>
        <div className={styles.quizHeader}>
          <div className={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>

          <div className={styles.quizTimer}>
            <ClockCircleOutlined />
            <Countdown
              value={Date.now() + timeRemaining}
              format="mm:ss"
              onFinish={handleTimeFinish}
              onChange={(val) => {
                if (typeof val === "number") {
                  setTimeRemaining(val);
                }
              }}
            />
          </div>
        </div>

        <div className={styles.questionProgress}>
          <Progress percent={calculateProgress()} size="small" />
        </div>

        <Card
          className={styles.questionCard}
          title={
            <div className={styles.questionTitle}>
              <span>{currentQuestion.text}</span>
              <div className={styles.questionPoints}>
                <Badge
                  count={`${currentQuestion.points} pts`}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </div>
            </div>
          }
          extra={
            <Button
              type={isFlagged ? "primary" : "text"}
              icon={<FlagOutlined />}
              onClick={() => toggleFlagQuestion(currentQuestion.id)}
              className={isFlagged ? styles.flaggedButton : ""}
            >
              {isFlagged ? "Flagged" : "Flag"}
            </Button>
          }
        >
          {currentQuestion.type === "Multiple Choice" && (
            <Radio.Group
              className={styles.answerGroup}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              value={userAnswers[currentQuestion.id]}
            >
              <Space direction="vertical" className={styles.answerSpace}>
                {currentQuestion.answers.map((answer) => (
                  <Radio
                    key={answer.id}
                    value={answer.id}
                    className={styles.answerOption}
                  >
                    {answer.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}

          {currentQuestion.type === "True/False" && (
            <Radio.Group
              className={styles.answerGroup}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              value={userAnswers[currentQuestion.id]}
            >
              <Space direction="vertical" className={styles.answerSpace}>
                {currentQuestion.answers.map((answer) => (
                  <Radio
                    key={answer.id}
                    value={answer.id}
                    className={styles.answerOption}
                  >
                    {answer.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}

          {currentQuestion.type === "Short Answer" && (
            <div className={styles.shortAnswerContainer}>
              <Input.TextArea
                placeholder="Type your answer here..."
                value={userAnswers[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleShortAnswerChange(currentQuestion.id, e.target.value)
                }
                className={styles.shortAnswerInput}
                rows={4}
              />
            </div>
          )}

          {currentQuestion.type === "Short Answer" && (
            <div className={styles.shortAnswerHint}>
              <InfoCircleOutlined /> Enter your answer in the text field above.
            </div>
          )}
        </Card>

        <div className={styles.navigationButtons}>
          <Button
            type="default"
            icon={<LeftCircleOutlined />}
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className={styles.questionDots}>
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`
                  ${styles.questionDot} 
                  ${index === currentQuestionIndex ? styles.activeDot : ""}
                  ${
                    userAnswers[quiz.questions[index].id]
                      ? styles.answeredDot
                      : ""
                  }
                  ${
                    flaggedQuestions.includes(quiz.questions[index].id)
                      ? styles.flaggedDot
                      : ""
                  }
                `}
                onClick={() => goToQuestion(index)}
                title={`Question ${index + 1}`}
              />
            ))}
          </div>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              type="primary"
              icon={<RightCircleOutlined />}
              onClick={nextQuestion}
            >
              Next
            </Button>
          ) : (
            <Popconfirm
              title="Submit Quiz"
              description="Are you sure you want to submit your answers? You won't be able to change them after submission."
              onConfirm={submitQuiz}
              okText="Yes, Submit"
              cancelText="No, Review"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button type="primary" icon={<CheckOutlined />}>
                Submit Quiz
              </Button>
            </Popconfirm>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.quizContainer}>
      {!quizSubmitted && (
        <Alert
          message={`${quiz.title} - Time Limit: ${quiz.timeLimit} minutes`}
          description={quiz.description}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className={styles.quizInfoAlert}
        />
      )}

      {showResults ? renderQuizReview() : renderCurrentQuestion()}

      {!showResults && quizSubmitted && (
        <div className={styles.quizSubmittedActions}>
          <Button type="primary" onClick={() => setShowResults(true)}>
            View Results
          </Button>
        </div>
      )}

      {!quizSubmitted && (
        <div className={styles.quizFooter}>
          <Text type="secondary">
            <InfoCircleOutlined /> Passing score: {quiz.passingScore}%
          </Text>

          {onCancel && (
            <Popconfirm
              title="Exit Quiz"
              description="Are you sure you want to exit? Your progress will be lost."
              onConfirm={onCancel}
              okText="Yes, Exit"
              cancelText="No, Continue"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button danger>Exit Quiz</Button>
            </Popconfirm>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
