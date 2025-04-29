'use client';

import CourseForm from "@/components/ui/CourseCreation/CourseForm/CourseForm";
import { Typography } from "antd";
import React from "react";
import styles from "./page.module.css";

const { Title } = Typography;

const CreateCoursePage: React.FC = () => {
  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <Title level={2} style={{color: 'white'}}>Create New Course</Title>
          <p className={styles.headerDescription}>
            Create a structured learning experience with modules, lessons, and assessments.
          </p>
        </div>
      </div>

      <div className={styles.pageContent}>
        <CourseForm />
      </div>
    </>
  );
};

export default CreateCoursePage;