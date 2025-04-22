// components/ui/CourseCreation/Steps/ModuleManager.tsx
"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import styles from "./ModuleManager.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: any[]; // Simplified for now
}

interface ModuleManagerProps {
  modules: Module[];
  onSave: (modules: Module[]) => void;
}

const ModuleManager: React.FC<ModuleManagerProps> = ({ modules, onSave }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [moduleList, setModuleList] = useState<Module[]>(modules);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [form] = Form.useForm();

  // Open modal to add a new module
  const showAddModal = () => {
    form.resetFields();
    setEditingModule(null);
    setIsModalVisible(true);
  };

  // Open modal to edit an existing module
  const showEditModal = (module: Module) => {
    form.setFieldsValue(module);
    setEditingModule(module);
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      let updatedModules: Module[];

      if (editingModule) {
        // Update existing module
        updatedModules = moduleList.map((module) =>
          module.id === editingModule.id ? { ...module, ...values } : module
        );
        messageApi.success("Module updated successfully");
      } else {
        // Add new module
        const newModule: Module = {
          id: `module-${Date.now()}`,
          ...values,
          position: moduleList.length,
          lessons: [],
        };
        updatedModules = [...moduleList, newModule];
        messageApi.success("Module added successfully");
      }

      setModuleList(updatedModules);
      onSave(updatedModules);
      setIsModalVisible(false);
    });
  };

  // Delete a module
  const deleteModule = (moduleId: string) => {
    modal.confirm({
      title: "Are you sure you want to delete this module?",
      content:
        "This action cannot be undone. All lessons and content within this module will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        const updatedModules = moduleList
          .filter((module) => module.id !== moduleId)
          .map((module, index) => ({ ...module, position: index }));

        setModuleList(updatedModules);
        onSave(updatedModules);
        messageApi.success("Module deleted successfully");
      },
    });
  };

  // Move a module up or down in the order
  const moveModule = (moduleId: string, direction: "up" | "down") => {
    const moduleIndex = moduleList.findIndex((m) => m.id === moduleId);
    if (
      (direction === "up" && moduleIndex === 0) ||
      (direction === "down" && moduleIndex === moduleList.length - 1)
    ) {
      return; // Can't move further
    }

    const targetIndex = direction === "up" ? moduleIndex - 1 : moduleIndex + 1;
    const updatedModules = [...moduleList];

    // Swap positions
    [updatedModules[moduleIndex], updatedModules[targetIndex]] = [
      updatedModules[targetIndex],
      updatedModules[moduleIndex],
    ];

    // Update position values
    updatedModules.forEach((module, index) => {
      module.position = index;
    });

    setModuleList(updatedModules);
    onSave(updatedModules);
  };

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <div className={styles.moduleManagerContainer}>
        <div className={styles.managerHeader}>
          <div>
            <Title level={4}>Course Modules</Title>
            <Text type="secondary" className={styles.headerDescription}>
              Create and organize your course modules. Drag to reorder.
            </Text>
          </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add Module
          </Button>
        </div>

        {moduleList.length === 0 ? (
          <Empty
            description="No modules yet. Add your first module to start building your course."
            className={styles.emptyState}
          />
        ) : (
          <div className={styles.modulesList}>
            {moduleList.map((module, index) => (
              <Card
                key={module.id}
                className={styles.moduleCard}
                title={
                  <div className={styles.moduleCardTitle}>
                    <span className={styles.moduleNumber}>
                      Module {index + 1}
                    </span>
                    <span>{module.title}</span>
                  </div>
                }
                extra={
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(module)}
                      aria-label="Edit module"
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteModule(module.id)}
                      aria-label="Delete module"
                    />
                  </Space>
                }
              >
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                  className={styles.moduleDescription}
                >
                  {module.description}
                </Paragraph>

                <div className={styles.moduleFooter}>
                  <div>
                    <Text type="secondary">
                      {module.lessons.length}{" "}
                      {module.lessons.length === 1 ? "lesson" : "lessons"}
                    </Text>
                  </div>
                  <div className={styles.reorderButtons}>
                    <Button
                      type="text"
                      icon={<ArrowUpOutlined />}
                      size="small"
                      disabled={index === 0}
                      onClick={() => moveModule(module.id, "up")}
                      title="Move up"
                    />
                    <Button
                      type="text"
                      icon={<ArrowDownOutlined />}
                      size="small"
                      disabled={index === moduleList.length - 1}
                      onClick={() => moveModule(module.id, "down")}
                      title="Move down"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal para adicionar/editar módulo */}
        <Modal
          title={editingModule ? "Edit Module" : "Add New Module"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          okText={editingModule ? "Save Changes" : "Add Module"}
        >
          <Form form={form} layout="vertical" requiredMark="optional">
            <Form.Item
              name="title"
              label="Module Title"
              rules={[
                { required: true, message: "Please enter module title" },
                { max: 100, message: "Title must be maximum 100 characters" },
              ]}
            >
              <Input placeholder="e.g. Introduction to the Course" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Module Description"
              rules={[
                { required: true, message: "Please enter module description" },
              ]}
            >
              <TextArea
                placeholder="Describe what this module covers..."
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ModuleManager;
