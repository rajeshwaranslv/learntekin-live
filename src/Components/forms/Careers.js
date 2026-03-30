import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Modal, Form, Input, Radio, Checkbox, Button, Card, Row, Col, Typography, Divider, Tag } from "antd";
import {
  MailOutlined, PhoneOutlined, UserOutlined, TeamOutlined,
} from "@ant-design/icons";
import { buildApiUrl } from "../../utils/api";
import 'antd/dist/reset.css';
import './formStyles.css';

const { Title, Text, Paragraph } = Typography;

const CAREER_URL = buildApiUrl("/api/careers");

const aboutItems = [
  {
    emoji: "🚀",
    title: "Get Started Today",
    content:
      "Welcome to the Careers page of Learntekin! We are a technology organization specializing in training and development in website development, Android application development, data analytics, and data science.",
  },
  {
    emoji: "💡",
    title: "Let Us Explore!",
    content:
      "At Learntekin, we value creativity, innovation, and collaboration. We provide an environment that fosters growth, personal development, and a positive impact in the industry.",
  },
  {
    emoji: "🎯",
    title: "Our Mantra on Hiring",
    content:
      "We are constantly looking for talented individuals ready to take on new challenges. Whether seasoned or just starting out, we offer opportunities to help you grow.",
  },
];

const jobItems = [
  { icon: "mdi:web",        title: "Website Developer",  content: "Build responsive, fast, and secure websites using modern frameworks." },
  { icon: "mdi:ab-testing", title: "Automation Tester",  content: "Automate testing pipelines using modern tools for accurate and fast delivery." },
];

const Careers = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => { document.title = "Careers"; }, []);

  const onFinish = async (values) => {
    if (submitting) return;
    setSubmitting(true);
    const formData = {
      title: values.title || "",
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      role: values.role,
      referral: values.referral || "",
      preferredTimes: {
        morning: (values.preferredTimes || []).includes("morning"),
        afternoon: (values.preferredTimes || []).includes("afternoon"),
        evening: (values.preferredTimes || []).includes("evening"),
      },
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await fetch(CAREER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit.");
      }
      Modal.success({
        title: "Application Submitted!",
        content: "We've received your application and will be in touch shortly.",
        onOk: () => { form.resetFields(); setSubmitting(false); },
      });
    } catch (error) {
      Modal.error({
        title: "Submission Failed",
        content: error.message || "An error occurred. Please try again.",
        onOk: () => setSubmitting(false),
      });
    }
  };

  return (
    <section style={{ padding: "3rem 1.5rem 4rem", background: "#f6fdf8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <Title level={2} style={{ color: "#0b3d2e", letterSpacing: "0.06em", marginBottom: 6 }}>
          CAREERS
        </Title>
        <Divider style={{ borderColor: "#2f9d44", borderWidth: 3, width: 48, minWidth: 48, margin: "0 auto 12px" }} />
        <Paragraph style={{ color: "#4b7a5e", maxWidth: 480, margin: "0 auto" }}>
          Join our team and help shape the future of technology education.
        </Paragraph>
      </div>

      <Row gutter={[32, 24]} style={{ maxWidth: 1100, margin: "0 auto" }} align="top">
        {/* Left – info */}
        <Col xs={24} lg={10}>
          <Text strong style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2f9d44" }}>
            ABOUT US
          </Text>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
            {aboutItems.map((item, i) => (
              <Card
                key={i}
                size="small"
                styles={{ body: { padding: "14px 16px" } }}
                style={{ borderRadius: 14, borderTop: "3px solid #2f9d44", boxShadow: "0 2px 12px rgba(16,60,40,0.07)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg,#e8f8ed,#d0f0db)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <Text strong style={{ fontSize: 13, color: "#0b3d2e", display: "block", marginBottom: 4 }}>{item.title}</Text>
                    <Paragraph style={{ fontSize: 12.5, color: "#4b6b58", lineHeight: 1.65, margin: 0 }}>{item.content}</Paragraph>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Text strong style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2f9d44", display: "block", marginTop: 20, marginBottom: 10 }}>
            OPEN POSITIONS
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobItems.map((job, i) => (
              <Card
                key={i}
                size="small"
                styles={{ body: { padding: "14px 16px" } }}
                style={{
                  borderRadius: 14, border: "1px solid #c9edd6",
                  background: "linear-gradient(135deg,#f0fdf4,#e8f5ed)",
                  boxShadow: "0 2px 8px rgba(16,60,40,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: "#fff", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 20, color: "#1a7a38",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  }}>
                    <Icon icon={job.icon} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 13, color: "#0b3d2e" }}>{job.title}</Text>
                      <Tag color="green" style={{ fontSize: 10, borderRadius: 6, padding: "0 6px", margin: 0 }}>Hiring</Tag>
                    </div>
                    <Paragraph style={{ fontSize: 12.5, color: "#3a6b51", margin: 0 }}>{job.content}</Paragraph>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Col>

        {/* Right – form */}
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            style={{ borderRadius: 20, boxShadow: "0 4px 32px rgba(16,60,40,0.1)" }}
            styles={{ body: { padding: "2rem" } }}
          >
            <Title level={4} style={{ textAlign: "center", color: "#0b3d2e", marginBottom: 2 }}>
              Apply Now
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#6b8f78", fontSize: 13, marginBottom: 20 }}>
              Complete the form and we'll be in touch shortly.
            </Paragraph>

            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ preferredTimes: [] }}>
              <Form.Item name="title" label="Title">
                <Radio.Group>
                  <Radio value="Ms.">Ms.</Radio>
                  <Radio value="Mr.">Mr.</Radio>
                  <Radio value="Mrs.">Mrs.</Radio>
                </Radio.Group>
              </Form.Item>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Required" }]}>
                    <Input size="large" placeholder="First Name" prefix={<UserOutlined style={{ color: "#aac9b4" }} />} style={{ borderRadius: 10 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Required" }]}>
                    <Input size="large" placeholder="Last Name" style={{ borderRadius: 10 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
                <Input size="large" placeholder="your@email.com" prefix={<MailOutlined style={{ color: "#aac9b4" }} />} style={{ borderRadius: 10 }} />
              </Form.Item>

              <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: "Required" }]}>
                <Input size="large" placeholder="+91 XXXXX XXXXX" prefix={<PhoneOutlined style={{ color: "#aac9b4" }} />} style={{ borderRadius: 10 }} />
              </Form.Item>

              <Form.Item name="role" label="Role Applying For" rules={[{ required: true, message: "Required" }]}>
                <Input size="large" placeholder="e.g. Website Developer" prefix={<TeamOutlined style={{ color: "#aac9b4" }} />} style={{ borderRadius: 10 }} />
              </Form.Item>

              <Form.Item name="referral" label="Referral (optional)">
                <Input size="large" placeholder="Who referred you?" style={{ borderRadius: 10 }} />
              </Form.Item>

              <Form.Item name="preferredTimes" label="Preferred Time to Call">
                <Checkbox.Group>
                  <Checkbox value="morning">Morning</Checkbox>
                  <Checkbox value="afternoon">Afternoon</Checkbox>
                  <Checkbox value="evening">Evening</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" block loading={submitting} className="btn-brand" size="large">
                  Submit Application
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Careers;
