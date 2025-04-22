// components/ui/CourseCreation/CourseForm/CourseForm.tsx
"use client";

import React, { useState } from "react";
import { Button, message, Steps } from "antd";
import { useRouter } from "next/navigation";
import styles from "./CourseForm.module.css";

// Importação dos componentes de etapas
import BasicInfoForm from "../Steps/BasicInfoForm";
import ModuleManager from "../Steps/ModuleManager";
import LessonManager from "../Steps/LessonManager";
import AssessmentManager from "../Steps/AssessmentManager";
import PublishingOptions from "../Steps/PublishingOptions";

const steps = [
  {
    title: "Basic Info",
    description: "Course details",
    content: "BasicInfoForm",
  },
  {
    title: "Modules",
    description: "Course structure",
    content: "ModuleManager",
  },
  {
    title: "Lessons",
    description: "Content creation",
    content: "LessonManager",
  },
  {
    title: "Assessments",
    description: "Quizzes & assignments",
    content: "AssessmentManager",
  },
  {
    title: "Publish",
    description: "Review & publish",
    content: "PublishingOptions",
  },
];

// Interface para os dados do curso
interface CourseData {
  basicInfo: {
    title: string;
    description: string;
    thumbnailUrl: string;
    level: string;
    durationHours: number;
    price: number;
    isFree: boolean;
    organizationId?: number;
  };
  modules: Array<{
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
  }>;
  publishSettings: {
    isPublished: boolean;
    isPublic: boolean;
  };
}

const CourseForm: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    basicInfo: {
      title: "",
      description: "",
      thumbnailUrl: "",
      level: "Beginner",
      durationHours: 0,
      price: 0,
      isFree: true,
    },
    modules: [],
    publishSettings: {
      isPublished: false,
      isPublic: false,
    },
  });
  const [loading, setLoading] = useState(false);

  // Salvar dados de uma etapa específica
  const saveStepData = (stepData: any, step: number) => {
    setCourseData((prevData) => {
      const newData = { ...prevData };

      switch (step) {
        case 0:
          newData.basicInfo = { ...stepData };
          break;
        case 1:
          newData.modules = [...stepData];
          break;
        case 2:
          // Este caso é mais complexo porque estamos atualizando lições dentro de módulos
          // A implementação dependerá da estrutura exata que você decidir
          break;
        case 3:
          newData.modules = [...stepData]; // Atualiza módulos com quizzes/assignments
          break;

        case 4:
          newData.publishSettings = { ...stepData };
          break;
      }

      return newData;
    });
  };

  // Função para verificar se podemos avançar para a próxima etapa
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          !!courseData.basicInfo.title && !!courseData.basicInfo.description
        );
      case 1:
        return courseData.modules.length > 0;
      default:
        return true;
    }
  };

  // Função para salvar rascunho
  const saveDraft = async () => {
    setLoading(true);
    messageApi.loading("Saving draft...");

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      messageApi.success("Draft saved successfully!");
    } catch (error) {
      messageApi.error("Failed to save draft");
      console.error("Error saving draft:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para publicar o curso
  const publishCourse = async () => {
    setLoading(true);
    messageApi.loading("Publishing course...");

    console.log("Publishing course data:", courseData);

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      messageApi.success("Course published successfully!");
      router.push("/courses"); // Redireciona para a página de cursos
    } catch (error) {
      messageApi.error("Failed to publish course");
      console.error("Error publishing course:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para avançar para a próxima etapa
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Função para voltar para a etapa anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Renderiza o conteúdo da etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm
            data={courseData.basicInfo}
            onSave={(data) => saveStepData(data, 0)}
          />
        );
      case 1:
        return (
          <ModuleManager
            modules={courseData.modules}
            onSave={(data) => saveStepData(data, 1)}
          />
        );
      case 2:
        return (
          <LessonManager
            modules={courseData.modules}
            onSave={(data) => saveStepData(data, 2)}
          />
        );
      case 3:
        return (
          <AssessmentManager
            modules={courseData.modules}
            onSave={(updatedModules) => saveStepData(updatedModules, 3)}
          />
        );
      case 4:
        return (
          <PublishingOptions
            data={courseData.publishSettings}
            courseInfo={courseData.basicInfo}
            moduleCount={courseData.modules.length}
            onSave={(data) => saveStepData(data, 4)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.courseFormContainer}>
        <Steps
          current={currentStep}
          items={steps.map((step) => ({
            title: step.title,
            description: step.description,
          }))}
          className={styles.stepsNavigation}
        />

        <div className={styles.stepContent}>{renderStepContent()}</div>

        <div className={styles.formActions}>
          <div>
            {currentStep > 0 && (
              <Button onClick={prevStep} disabled={loading}>
                Previous
              </Button>
            )}
          </div>

          <div className={styles.rightActions}>
            <Button onClick={saveDraft} loading={loading}>
              Save Draft
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={nextStep}
                disabled={!canProceed() || loading}
              >
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={publishCourse} loading={loading}>
                Publish Course
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseForm;
