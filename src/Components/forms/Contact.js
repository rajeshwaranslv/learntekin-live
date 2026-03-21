import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Card, Row, Col, Space, Typography, Divider } from "antd";
import {
  MailOutlined, PhoneOutlined, ClockCircleOutlined,
  EnvironmentOutlined, LinkedinOutlined, InstagramOutlined,
  YoutubeOutlined, UserOutlined, SendOutlined, TwitterOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import 'antd/dist/reset.css';
import './formStyles.css';

const { Title, Text, Paragraph } = Typography;

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://lte-node.onrender.com").trim().replace(/\/$/, "");
const CONTACT_URL = `${API_BASE}/api/contacts`;

const infoItems = [
  { icon: <MailOutlined />,        title: "Email Us",    content: <a href="mailto:learntekin@gmail.com">learntekin@gmail.com</a> },
  { icon: <PhoneOutlined />,       title: "Call Us",     content: <a href="tel:+916382422474">+91-638-242-2474</a> },
  { icon: <ClockCircleOutlined />, title: "Open Hours",  content: "Mon – Fri: 9 AM – 5 PM" },
  { icon: <EnvironmentOutlined />, title: "Location",    content: "Panruti, Tamil Nadu, India" },
];

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { document.title = "Contact"; }, []);

  const onFinish = async (values) => {
    if (submitting) return;
    setSubmitting(true);
    const payload = { ...values, timestamp: new Date().toISOString() };
    try {
      const res = await fetch(CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to send message.");
      }
      Modal.success({
        title: "Message Sent!",
        content: "Thank you for reaching out. We'll get back to you shortly.",
        onOk: () => { form.resetFields(); setSubmitting(false); },
      });
    } catch (err) {
      Modal.error({
        title: "Failed to Send",
        content: err.message || "Something went wrong. Please try again.",
        onOk: () => setSubmitting(false),
      });
    }
  };

  return (
    <section style={{ padding: "3rem 1.5rem 4rem", background: "#f6fdf8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <Title level={2} style={{ color: "#0b3d2e", letterSpacing: "0.06em", marginBottom: 6 }}>
          CONTACT
        </Title>
        <Divider style={{ borderColor: "#2f9d44", borderWidth: 3, width: 48, minWidth: 48, margin: "0 auto 12px" }} />
        <Paragraph style={{ color: "#4b7a5e", maxWidth: 480, margin: "0 auto" }}>
          Have a question or want to work together? We'd love to hear from you.
        </Paragraph>
      </div>

      <Row gutter={[32, 24]} style={{ maxWidth: 1100, margin: "0 auto" }} align="top">
        {/* Left – info cards */}
        <Col xs={24} lg={10}>
          <Text strong style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2f9d44" }}>
            GET IN TOUCH
          </Text>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
            {infoItems.map((item, i) => (
              <Card
                key={i}
                size="small"
                styles={{ body: { padding: "14px 16px" } }}
                style={{
                  borderRadius: 14, borderLeft: "4px solid #2f9d44",
                  boxShadow: "0 2px 12px rgba(16,60,40,0.07)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg,#e8f8ed,#d0f0db)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#1a7a38",
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <Text strong style={{ fontSize: 13, color: "#0b3d2e", display: "block", marginBottom: 2 }}>{item.title}</Text>
                    <Paragraph style={{ fontSize: 13, color: "#3a6b51", margin: 0 }}>{item.content}</Paragraph>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Text strong style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2f9d44", display: "block", marginTop: 20, marginBottom: 10 }}>
            FOLLOW US
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { icon: <InstagramOutlined />, label: "Instagram", href: "https://www.instagram.com/learntekin" },
              { icon: <LinkedinOutlined />,  label: "LinkedIn",  href: "https://www.linkedin.com/groups/14199617/" },
              { icon: <YoutubeOutlined />,   label: "YouTube",   href: "https://www.youtube.com/@learntekindia" },
              { icon: <WhatsAppOutlined />,  label: "WhatsApp",  href: "http://wa.me/+916382422474" },
              { icon: <TwitterOutlined />,   label: "X",         href: "https://x.com/LearnTekin" },
            ].map((s, i) => (
              <Button
                key={i}
                icon={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                style={{
                  borderColor: "#c9edd6", color: "#1a7a38",
                  background: "#f0fdf4", borderRadius: 8,
                  fontWeight: 600, fontSize: 12,
                }}
              >
                {s.label}
              </Button>
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
              Send a Message
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#6b8f78", fontSize: 13, marginBottom: 20 }}>
              Fill in the form and we'll respond within 24 hours.
            </Paragraph>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your name" }]}>
                <Input size="large" placeholder="Your Name" prefix={<UserOutlined style={{ color: "#aac9b4" }} />} style={{ borderRadius: 10 }} />
              </Form.Item>
              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
                <Input size="large" placeholder="your@email.com" prefix={<MailOutlined style={{ color: "#aac9b4" }} />} style={{ borderRadius: 10 }} />
              </Form.Item>
              <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please enter a subject" }]}>
                <Input size="large" placeholder="How can we help?" style={{ borderRadius: 10 }} />
              </Form.Item>
              <Form.Item name="message" label="Message" rules={[{ required: true, message: "Please enter your message" }]}>
                <Input.TextArea rows={6} placeholder="Write your message here..." style={{ borderRadius: 10, resize: "none" }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={submitting}
                  icon={<SendOutlined />}
                  className="btn-brand"
                  size="large"
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Contact;
