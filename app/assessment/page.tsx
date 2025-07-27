"use client";
import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Row, Col, Spin, Empty, Tag } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

interface Assessment {
  assessmentId: number;
  title: string;
  description: string;
  assessmentType: string;
  ageGroup: string;
  createdDate: string;
  isActive: boolean;
}

export default function AssessmentListPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAssessments();
      // Chỉ lấy các assessment đang active
      const activeAssessments = Array.isArray(data) ? data.filter(a => a.isActive) : [];
      setAssessments(activeAssessments);
    } catch (err: any) {
      toast({ 
        title: "Lỗi", 
        description: "Không thể tải danh sách khảo sát", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (assessmentId: number) => {
    router.push(`/assessment/${assessmentId}`);
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

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2}>Danh sách khảo sát</Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Chọn một khảo sát để bắt đầu đánh giá
        </Paragraph>
      </div>

      {assessments.length === 0 ? (
        <Empty 
          description="Hiện tại chưa có khảo sát nào"
          style={{ marginTop: '64px' }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {assessments.map((assessment) => (
            <Col xs={24} sm={12} lg={8} key={assessment.assessmentId}>
              <Card
                hoverable
                style={{ 
                  height: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                bodyStyle={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  padding: '24px'
                }}
                actions={[
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => handleStartAssessment(assessment.assessmentId)}
                    style={{ 
                      width: '90%',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  >
                    Bắt đầu khảo sát
                  </Button>
                ]}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                      {assessment.title}
                    </Title>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Tag color="blue">{assessment.assessmentType}</Tag>
                      <Tag color="green">{assessment.ageGroup}</Tag>
                    </div>
                  </div>
                  
                  <Paragraph 
                    style={{ 
                      color: '#666', 
                      marginBottom: '16px',
                      lineHeight: '1.6'
                    }}
                  >
                    {assessment.description}
                  </Paragraph>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                    <small style={{ color: '#999' }}>
                      Ngày tạo: {dayjs(assessment.createdDate).format("DD/MM/YYYY")}
                    </small>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
