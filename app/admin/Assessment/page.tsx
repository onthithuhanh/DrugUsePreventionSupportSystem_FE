"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form, Input, Modal, Select, DatePicker, Switch, Card, Space, InputNumber, Descriptions } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";

interface Assessment {
  assessmentId: number;
  title: string;
  description: string;
  assessmentType: string;
  ageGroup: string;
  createdDate: string;
  isActive: boolean;
}

interface AssessmentDetail {
  assessmentId: number;
  title: string;
  description: string;
  assessmentType: string;
  ageGroup: string;
  createdDate: string;
  isActive: boolean;
  questions: DetailQuestion[];
}

interface DetailQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  options: DetailOption[];
}

interface DetailOption {
  optionId: number;
  optionText: string;
}

interface AssessmentOption {
  optionText: string;
  optionValue: number;
}

interface AssessmentQuestion {
  questionText: string;
  questionType: string;
  options: AssessmentOption[];
}

interface AssessmentPayload {
  title: string;
  description: string;
  assessmentType: number;
  ageGroup: number;
  questions: AssessmentQuestion[];
}

export default function AssessmentAdminPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Data states
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [assessmentDetail, setAssessmentDetail] = useState<AssessmentDetail | null>(null);
  const [form] = Form.useForm();
  const [assessmentTypes, setAssessmentTypes] = useState<any[]>([]);
  const [ageGroups, setAgeGroups] = useState<any[]>([]);
  
  // Questions for create form
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([{
    questionText: "",
    questionType: "SingleChoice",
    options: [{ optionText: "", optionValue: 1 }]
  }]);

  useEffect(() => {
    reload();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [ats, ags] = await Promise.all([
        authApi.getAllAssessmentTypes(),
        authApi.getAllAgeGroups(),
      ]);
      setAssessmentTypes(Array.isArray(ats) ? ats : []);
      setAgeGroups(Array.isArray(ags) ? ags : []);
    } catch {}
  };

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAssessments();
      setAssessments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authApi.deleteAssessment(id);
      toast({ title: "Thành công", description: "Đã xóa bài đánh giá!" });
      reload();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Lỗi khi xóa bài đánh giá", variant: "destructive" });
    }
  };

  const handleEdit = (record: Assessment) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      createdDate: dayjs(record.createdDate),
      isActive: record.isActive,
      assessmentType: assessmentTypes.find((a) => a.name === record.assessmentType)?.assessmentTypeId,
      ageGroup: ageGroups.find((a) => a.name === record.ageGroup)?.groupId,
    });
    setEditModalVisible(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setQuestions([{
      questionText: "",
      questionType: "SingleChoice",
      options: [{ optionText: "", optionValue: 1 }]
    }]);
    setCreateModalVisible(true);
  };

  const handleViewDetail = async (record: Assessment) => {
    try {
      const detail = await authApi.getAssessmentById(record.assessmentId);
      setAssessmentDetail(detail);
      setDetailModalVisible(true);
    } catch (err: any) {
      toast({ title: "Lỗi", description: "Không thể tải chi tiết bài đánh giá", variant: "destructive" });
    }
  };

  const handleCreateModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Create new assessment with full payload
      const payload: AssessmentPayload = {
        title: values.title,
        description: values.description,
        assessmentType: values.assessmentType,
        ageGroup: values.ageGroup,
        questions: questions.filter(q => q.questionText.trim() !== "")
      };
      
      // Call the new API endpoint using authApi
      await authApi.addAssessment(payload);
      
      toast({ title: "Thành công", description: "Đã thêm bài đánh giá!" });
      setCreateModalVisible(false);
      reload();
    } catch (err: any) {
      console.log(err);
      toast({ title: "Lỗi", description: err?.message || "Thêm thất bại", variant: "destructive" });
    }
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Update existing assessment
      const payload = {
        ...values,
        createdDate: values.createdDate ? values.createdDate.toISOString() : new Date().toISOString(),
        isActive: !!values.isActive,
      };
      await authApi.updateAssessment(editing!.assessmentId, payload);
      toast({ title: "Thành công", description: "Đã cập nhật bài đánh giá!" });
      
      setEditModalVisible(false);
      reload();
    } catch (err: any) {
      console.log(err);
      toast({ title: "Lỗi", description: err?.message || "Cập nhật thất bại", variant: "destructive" });
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: "",
      questionType: "SingleChoice",
      options: [{ optionText: "", optionValue: 1 }]
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof AssessmentQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    const maxValue = Math.max(...newQuestions[questionIndex].options.map(o => o.optionValue), 0);
    newQuestions[questionIndex].options.push({ 
      optionText: "", 
      optionValue: maxValue + 1 
    });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof AssessmentOption, value: any) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setQuestions(newQuestions);
  };

  const columns = [
    { title: "ID", dataIndex: "assessmentId", key: "assessmentId" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Loại đánh giá", dataIndex: "assessmentType", key: "assessmentType" },
    { title: "Nhóm tuổi", dataIndex: "ageGroup", key: "ageGroup" },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate", render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm") },
    { title: "Kích hoạt", dataIndex: "isActive", key: "isActive", render: (v: boolean) => v ? "Có" : "Không" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Assessment) => (
        <>
          <Button type="link" onClick={() => handleViewDetail(record)} style={{ marginRight: 8 }}>Chi tiết</Button>
          <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.assessmentId)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý bài đánh giá</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm bài đánh giá</Button>
      <Table rowKey="assessmentId" columns={columns} dataSource={assessments} loading={loading} bordered />
      
      {/* Create Modal */}
      <Modal
        title="Thêm bài đánh giá"
        open={createModalVisible}
        onOk={handleCreateModalOk}
        onCancel={() => setCreateModalVisible(false)}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="assessmentType" label="Loại đánh giá" rules={[{ required: true, message: "Chọn loại đánh giá" }]}>
            <Select options={assessmentTypes.map(a => ({ label: a.name, value: a.assessmentTypeId }))} placeholder="Chọn loại đánh giá" />
          </Form.Item>
          <Form.Item name="ageGroup" label="Nhóm tuổi" rules={[{ required: true, message: "Chọn nhóm tuổi" }]}>
            <Select options={ageGroups.map(a => ({ label: a.name, value: a.groupId }))} placeholder="Chọn nhóm tuổi" />
          </Form.Item>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Câu hỏi</h3>
              <Button type="dashed" onClick={addQuestion}>Thêm câu hỏi</Button>
            </div>
            
            {questions.map((question, qIndex) => (
              <Card 
                key={qIndex} 
                size="small" 
                style={{ marginBottom: 16 }}
                title={`Câu hỏi ${qIndex + 1}`}
                extra={
                  questions.length > 1 && (
                    <Button 
                      type="text" 
                      danger 
                      size="small"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      Xóa
                    </Button>
                  )
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Input
                    placeholder="Nội dung câu hỏi"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                  />
                  
                  <Select
                    style={{ width: 200 }}
                    value={question.questionType}
                    onChange={(value) => updateQuestion(qIndex, 'questionType', value)}
                    options={[
                      { label: 'Chọn một', value: 'SingleChoice' },
                      { label: 'Có/Không', value: 'YesNo' },
                      { label: 'Chọn nhiều', value: 'MultipleChoice' },
                      { label: 'Văn bản', value: 'Text' }
                    ]}
                  />
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>Tùy chọn:</span>
                      <Button 
                        type="dashed" 
                        size="small"
                        onClick={() => addOption(qIndex)}
                      >
                        Thêm tùy chọn
                      </Button>
                    </div>
                    
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <Input
                          placeholder="Nội dung tùy chọn"
                          value={option.optionText}
                          onChange={(e) => updateOption(qIndex, oIndex, 'optionText', e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <InputNumber
                          placeholder="Giá trị"
                          value={option.optionValue}
                          onChange={(value) => updateOption(qIndex, oIndex, 'optionValue', value || 0)}
                          style={{ width: 100 }}
                        />
                        {question.options.length > 1 && (
                          <Button 
                            type="text" 
                            danger 
                            size="small"
                            onClick={() => removeOption(qIndex, oIndex)}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Space>
              </Card>
            ))}
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Sửa bài đánh giá"
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setEditModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="assessmentType" label="Loại đánh giá" rules={[{ required: true, message: "Chọn loại đánh giá" }]}>
            <Select options={assessmentTypes.map(a => ({ label: a.name, value: a.assessmentTypeId }))} placeholder="Chọn loại đánh giá" />
          </Form.Item>
          <Form.Item name="ageGroup" label="Nhóm tuổi" rules={[{ required: true, message: "Chọn nhóm tuổi" }]}>
            <Select options={ageGroups.map(a => ({ label: a.name, value: a.groupId }))} placeholder="Chọn nhóm tuổi" />
          </Form.Item>
          <Form.Item name="createdDate" label="Ngày tạo" rules={[{ required: true, message: "Chọn ngày tạo" }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết bài đánh giá"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={900}
      >
        {assessmentDetail && (
          <div>
            {/* Basic Information */}
            <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="ID">{assessmentDetail.assessmentId}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{assessmentDetail.isActive ? "Kích hoạt" : "Không kích hoạt"}</Descriptions.Item>
                <Descriptions.Item label="Tiêu đề" span={2}>{assessmentDetail.title}</Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>{assessmentDetail.description}</Descriptions.Item>
                <Descriptions.Item label="Loại đánh giá">{assessmentDetail.assessmentType}</Descriptions.Item>
                <Descriptions.Item label="Nhóm tuổi">{assessmentDetail.ageGroup}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo" span={2}>
                  {dayjs(assessmentDetail.createdDate).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Questions Section */}
            <Card title={`Câu hỏi (${assessmentDetail.questions?.length || 0})`}>
              {assessmentDetail.questions && assessmentDetail.questions.length > 0 ? (
                assessmentDetail.questions.map((question: DetailQuestion, index: number) => (
                  <Card 
                    key={question.questionId} 
                    type="inner"
                    size="small" 
                    style={{ marginBottom: 16 }}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Câu hỏi {index + 1}</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>ID: {question.questionId}</span>
                      </div>
                    }
                  >
                    <div style={{ marginBottom: 12 }}>
                      <strong>Nội dung:</strong>
                      <div style={{ marginTop: 4, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                        {question.questionText}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>Loại câu hỏi:</strong>
                      <span style={{ marginLeft: 8, padding: '2px 8px', backgroundColor: '#e6f7ff', color: '#1890ff', borderRadius: '4px', fontSize: '12px' }}>
                        {question.questionType}
                      </span>
                    </div>
                    
                    <div>
                      <strong>Tùy chọn ({question.options?.length || 0}):</strong>
                      {question.options && question.options.length > 0 ? (
                        <div style={{ marginTop: 8 }}>
                          {question.options.map((option: DetailOption, optionIndex: number) => (
                            <div 
                              key={option.optionId} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '6px 12px', 
                                margin: '4px 0',
                                backgroundColor: '#fafafa', 
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px' 
                              }}
                            >
                              <span>{optionIndex + 1}. {option.optionText}</span>
                              <span style={{ fontSize: '12px', color: '#666' }}>ID: {option.optionId}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#999', fontStyle: 'italic', marginTop: 8, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          Không có tùy chọn
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div style={{ 
                  color: '#999', 
                  fontStyle: 'italic', 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px'
                }}>
                  Chưa có câu hỏi nào
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
} 