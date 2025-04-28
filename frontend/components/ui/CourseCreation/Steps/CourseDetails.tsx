// components/ui/CourseCreation/Steps/CourseDetails.tsx
"use client";

import React from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Statistic,
  Typography,
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import styles from "./CourseDetails.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface CourseDetails {
  aboutCourse: string;
  whatYoullLearn: string[];
  requirements: string[];
}

interface CourseDetailsProps {
  data: CourseDetails;
  courseInfo: {
    title: string;
    description: string;
    thumbnailUrl?: string;
    level?: string;
    durationHours?: number;
    price?: number;
    isFree?: boolean;
    isPublic?: boolean;
    enrollmentType?: "open" | "invite_only" | "paid";
  };
  moduleCount: number;
  onSave: (data: CourseDetails) => void;
}

const CourseDetailsComponent: React.FC<CourseDetailsProps> = ({
  data,
  courseInfo,
  moduleCount,
  onSave,
}) => {
  const [form] = Form.useForm();

  const handleFormChange = (changedValues: any, allValues: any) => {
    onSave(allValues);
  };

  // Contar o número de lições
  const countLessons = () => {
    // Na implementação real, isso seria feito a partir dos dados do curso
    return 12; // Valor de exemplo
  };

  // Calcular a pontuação de completude do curso
  const calculateCompletionScore = () => {
    let score = 0;

    // Título e descrição
    if (courseInfo.title) score += 15;
    if (courseInfo.description && courseInfo.description.length > 50)
      score += 10;

    // Thumbnail
    if (courseInfo.thumbnailUrl) score += 10;

    // Informações de nível e duração
    if (courseInfo.level) score += 5;
    if (courseInfo.durationHours && courseInfo.durationHours > 0) score += 5;

    // Módulos e lições
    if (moduleCount > 0) score += 15;
    if (countLessons() > 0) score += 15;

    // Detalhes do curso
    if (data.aboutCourse && data.aboutCourse.length > 20) score += 10;
    if (data.whatYoullLearn && data.whatYoullLearn.length > 0) score += 10;
    if (data.requirements && data.requirements.length > 0) score += 5;

    return Math.min(score, 100);
  };

  return (
    <div className={styles.courseDetailsContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            initialValues={data}
            onValuesChange={handleFormChange}
            requiredMark="optional"
            className={styles.detailsForm}
          >
            <Title level={4}>Course Details</Title>
            <Paragraph className={styles.sectionDescription}>
              Add information to help students understand what they'll learn in
              this course.
            </Paragraph>

            <Form.Item
              name="aboutCourse"
              label="About this course"
              tooltip="Provide a brief overview of what the course is about"
            >
              <TextArea
                rows={4}
                placeholder="Describe what your course is about"
                className={styles.textArea}
              />
            </Form.Item>

            <Title level={5} className={styles.sectionTitle}>
              What you'll learn
            </Title>
            <Paragraph className={styles.itemDescription}>
              List the key learning outcomes students will achieve by taking
              this course.
            </Paragraph>

            <Form.List name="whatYoullLearn">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      key={field.key}
                      className={styles.listItem}
                    >
                      <Input
                        placeholder={`Learning outcome ${index + 1}`}
                        prefix="• "
                        onPressEnter={() => add()}
                        style={{ flex: 1 }}
                        addonAfter={
                          <Button
                            type="link"
                            onClick={() => remove(index)}
                            style={{ padding: 0 }}
                          >
                            Remove
                          </Button>
                        }
                      />
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button
                      type={fields.length === 0 ? "primary" : "dashed"}
                      onClick={() => add()}
                      block
                    >
                      + Add Outcome
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Title level={5} className={styles.sectionTitle}>
              Requirements
            </Title>
            <Paragraph className={styles.itemDescription}>
              List any prerequisites or requirements students should have before
              taking this course.
            </Paragraph>

            <Form.List name="requirements">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      key={field.key}
                      className={styles.listItem}
                    >
                      <Input
                        placeholder={`Requirement ${index + 1}`}
                        prefix="• "
                        onPressEnter={() => add()}
                        style={{ flex: 1 }}
                        addonAfter={
                          <Button
                            type="link"
                            onClick={() => remove(index)}
                            style={{ padding: 0 }}
                          >
                            Remove
                          </Button>
                        }
                      />
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button
                      type={fields.length === 0 ? "primary" : "dashed"}
                      onClick={() => add()}
                      block
                    >
                      + Add Requirement
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Col>

        <Col xs={24} lg={8}>
          <div className={styles.summaryContainer}>
            <Card className={styles.summaryCard}>
              <Title level={4}>Course Summary</Title>

              <div className={styles.completionScore}>
                <Statistic
                  title="Completion Score"
                  value={calculateCompletionScore()}
                  suffix="%"
                  valueStyle={{
                    color:
                      calculateCompletionScore() >= 80
                        ? "var(--success-color)"
                        : calculateCompletionScore() >= 50
                        ? "var(--warning-color)"
                        : "var(--error-color)",
                  }}
                />

                {calculateCompletionScore() < 80 && (
                  <Alert
                    message="Your course could use more details"
                    type="warning"
                    showIcon
                    className={styles.completionAlert}
                  />
                )}

                {calculateCompletionScore() >= 80 && (
                  <Alert
                    message="Your course is ready to publish"
                    type="success"
                    showIcon
                    className={styles.completionAlert}
                  />
                )}
              </div>

              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <BookOutlined className={styles.metaIcon} />
                  <Text>{moduleCount} modules</Text>
                </div>

                <div className={styles.metaItem}>
                  <FileTextOutlined className={styles.metaIcon} />
                  <Text>{countLessons()} lessons</Text>
                </div>

                {courseInfo.durationHours && (
                  <div className={styles.metaItem}>
                    <ClockCircleOutlined className={styles.metaIcon} />
                    <Text>{courseInfo.durationHours} hours</Text>
                  </div>
                )}

                <div className={styles.metaItem}>
                  <GlobalOutlined className={styles.metaIcon} />
                  <Text>{courseInfo.isPublic ? "Public" : "Private"}</Text>
                </div>

                {courseInfo.isFree ? (
                  <div className={styles.metaItem}>
                    <CheckCircleOutlined className={styles.metaIcon} />
                    <Text>Free course</Text>
                  </div>
                ) : (
                  <div className={styles.metaItem}>
                    <DollarOutlined className={styles.metaIcon} />
                    <Text>${courseInfo.price || 0}</Text>
                  </div>
                )}

                <div className={styles.metaItem}>
                  <TeamOutlined className={styles.metaIcon} />
                  <Text>
                    {courseInfo.enrollmentType === "invite_only"
                      ? "Invite only"
                      : courseInfo.enrollmentType === "paid"
                      ? "Paid enrollment"
                      : "Open enrollment"}
                  </Text>
                </div>
              </div>
            </Card>

            <div className={styles.courseDetailsTips}>
              <Title level={5}>Course Detail Tips</Title>
              <ul className={styles.tipsList}>
                <li>
                  Be specific about what students will learn to set clear
                  expectations
                </li>
                <li>
                  Include 4-6 clear learning outcomes to attract the right
                  students
                </li>
                <li>
                  List any prerequisites so students know if they're ready for
                  the course
                </li>
                <li>
                  Highlight practical skills students will gain from your course
                </li>
                <li>
                  Consider what makes your course unique compared to similar
                  offerings
                </li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CourseDetailsComponent;
