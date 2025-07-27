"use client";
import React, { useEffect, useState } from "react";
import { Card, Button, Radio, Checkbox, Input, Form, Typography, Spin, Progress, Modal } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

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

interface UserAnswer {
  questionId: number;
  selectedOptionIds: number[];
  textAnswer?: string;
}

export default function TakeAssessmentPage() {
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assessmentId = parseInt(params.id as string);

  useEffect(() => {
    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAssessmentById(assessmentId);
      setAssessment(data);
      
      // Initialize answers object
      const initialAnswers: Record<number, UserAnswer> = {};
      data.questions.forEach((question: DetailQuestion) => {
        initialAnswers[question.questionId] = {
          questionId: question.questionId,
          selectedOptionIds: [],
          textAnswer: ""
        };
      });
      setAnswers(initialAnswers);
    } catch (err: any) {
      toast({ 
        title: "Lỗi", 
        description: "Không thể tải bài đánh giá", 
        variant: "destructive" 
      });
      router.push('/assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, optionIds: number[], textAnswer?: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOptionIds: optionIds,
        textAnswer: textAnswer || ""
      }
    }));
  };

  const handleSingleChoice = (questionId: number, optionId: number) => {
    handleAnswerChange(questionId, [optionId]);
  };

  const handleMultipleChoice = (questionId: number, optionIds: number[]) => {
    handleAnswerChange(questionId, optionIds);
  };

  const handleYesNo = (questionId: number, value: boolean) => {
    // Assuming Yes = 1, No = 0 for option IDs
    const question = assessment?.questions.find(q => q.questionId === questionId);
    if (question && question.options.length >= 2) {
      const optionId = value ? question.options[0].optionId : question.options[1].optionId;
      handleAnswerChange(questionId, [optionId]);
    }
  };

  const handleTextAnswer = (questionId: number, text: string) => {
    handleAnswerChange(questionId, [], text);
  };

  const isQuestionAnswered = (questionId: number) => {
    const answer = answers[questionId];
    if (!answer) return false;
    
    const question = assessment?.questions.find(q => q.questionId === questionId);
    if (!question) return false;

    if (question.questionType.toLowerCase() === 'text') {
      return answer.textAnswer && answer.textAnswer.trim() !== '';
    } else {
      return answer.selectedOptionIds.length > 0;
    }
  };

  const getProgress = () => {
    if (!assessment) return 0;
    const answeredCount = assessment.questions.filter(q => isQuestionAnswered(q.questionId)).length;
    return Math.round((answeredCount / assessment.questions.length) * 100);
  };

  const canSubmit = () => {
    if (!assessment) return false;
    return assessment.questions.every(q => isQuestionAnswered(q.questionId));
  };

  const handleSubmit = async () => {
    if (!assessment || !canSubmit()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng trả lời tất cả các câu hỏi",
        variant: "destructive"
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận nộp bài',
      content: 'Bạn có chắc chắn muốn nộp bài đánh giá này không? Sau khi nộp bạn sẽ không thể thay đổi câu trả lời.',
      okText: 'Nộp bài',
      cancelText: 'Hủy',
      onOk: async () => {
        await submitAssessment();
      }
    });
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("userData");
      let userId = 1; // Default fallback
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.userId || user.id || 1;
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      // Collect all selected option IDs
      const allSelectedOptionIds: number[] = [];
      Object.values(answers).forEach(answer => {
        allSelectedOptionIds.push(...answer.selectedOptionIds);
      });

      const payload = {
        userId: userId,
        assessmentId: assessmentId,
        selectedOptionIds: allSelectedOptionIds
      };

      // Submit to API using authApi
      await authApi.submitUserAssessment(payload);

      toast({
        title: "Thành công",
        description: "Đã nộp bài đánh giá thành công!"
      });

      router.push('/assessment');
    } catch (err: any) {
      console.error('Submit error:', err);
      toast({
        title: "Lỗi",
        description: "Không thể nộp bài đánh giá. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: DetailQuestion) => {
    const answer = answers[question.questionId];
    
    switch (question.questionType.toLowerCase()) {
      case 'singlechoice':
      case 'single choice':
        return (
          <Radio.Group
            value={answer?.selectedOptionIds[0]}
            onChange={(e) => handleSingleChoice(question.questionId, e.target.value)}
            style={{ width: '100%' }}
          >
            {question.options.map((option) => (
              <Radio 
                key={option.optionId} 
                value={option.optionId}
                style={{ 
                  display: 'block', 
                  height: '40px', 
                  lineHeight: '40px',
                  marginBottom: '8px',
                  padding: '0 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px'
                }}
              >
                {option.optionText}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'multiplechoice':
      case 'multiple choice':
        return (
          <Checkbox.Group
            value={answer?.selectedOptionIds}
            onChange={(values) => handleMultipleChoice(question.questionId, values as number[])}
            style={{ width: '100%' }}
          >
            {question.options.map((option) => (
              <Checkbox 
                key={option.optionId} 
                value={option.optionId}
                style={{ 
                  display: 'block', 
                  height: '40px', 
                  lineHeight: '40px',
                  marginBottom: '8px',
                  padding: '0 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px'
                }}
              >
                {option.optionText}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case 'yesno':
      case 'yes no':
        return (
          <Radio.Group
            value={answer?.selectedOptionIds[0]}
            onChange={(e) => handleSingleChoice(question.questionId, e.target.value)}
            style={{ width: '100%' }}
          >
            {question.options.map((option) => (
              <Radio 
                key={option.optionId} 
                value={option.optionId}
                style={{ 
                  display: 'block', 
                  height: '40px', 
                  lineHeight: '40px',
                  marginBottom: '8px',
                  padding: '0 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px'
                }}
              >
                {option.optionText}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'text':
        return (
          <TextArea
            rows={4}
            placeholder="Nhập câu trả lời của bạn..."
            value={answer?.textAnswer}
            onChange={(e) => handleTextAnswer(question.questionId, e.target.value)}
            style={{ borderRadius: '8px' }}
          />
        );

      default:
        return <div>Loại câu hỏi không được hỗ trợ</div>;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!assessment) {
    return <div>Không tìm thấy bài đánh giá</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          {assessment.title}
        </Title>
        <Paragraph style={{ color: '#666', fontSize: '16px' }}>
          {assessment.description}
        </Paragraph>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div>
            <span style={{ color: '#666' }}>Tiến độ: </span>
            <span style={{ fontWeight: 'bold' }}>{getProgress()}%</span>
          </div>
          <div style={{ color: '#666' }}>
            {assessment.questions.filter(q => isQuestionAnswered(q.questionId)).length}/{assessment.questions.length} câu hỏi
          </div>
        </div>
        
        <Progress 
          percent={getProgress()} 
          showInfo={false} 
          strokeColor="#52c41a"
          style={{ marginTop: '8px' }}
        />
      </Card>

      {/* Questions */}
      {assessment.questions.map((question, index) => (
        <Card 
          key={question.questionId}
          style={{ 
            marginBottom: '24px',
            border: isQuestionAnswered(question.questionId) ? '2px solid #52c41a' : '1px solid #d9d9d9'
          }}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Câu hỏi {index + 1}</span>
              {isQuestionAnswered(question.questionId) && (
                <span style={{ color: '#52c41a', fontSize: '14px' }}>✓ Đã trả lời</span>
              )}
            </div>
          }
        >
          <div style={{ marginBottom: '24px' }}>
            <Paragraph style={{ fontSize: '16px', fontWeight: '500' }}>
              {question.questionText}
            </Paragraph>
          </div>
          
          {renderQuestion(question)}
        </Card>
      ))}

      {/* Submit Button */}
      <Card>
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canSubmit()}
            style={{ 
              minWidth: '200px',
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px'
            }}
          >
            {submitting ? 'Đang nộp bài...' : 'Nộp bài đánh giá'}
          </Button>
          
          {!canSubmit() && (
            <div style={{ marginTop: '12px', color: '#ff4d4f' }}>
              Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
