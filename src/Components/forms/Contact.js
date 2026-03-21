import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Card } from "antd";
import 'antd/dist/reset.css';
import './formStyles.css';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://lte-node.onrender.com").trim().replace(/\/$/, "");
const CONTACT_URL = `${API_BASE}/api/contacts`;

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = "Contact";
  }, []);

  const onFinish = async (values) => {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
      timestamp: new Date().toISOString(),
    };

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
        title: 'Message sent',
        content: 'Your message has been sent. Thank you!',
        onOk: () => {
          form.resetFields();
          setSubmitting(false);
        }
      });
    } catch (err) {
      console.error('Error saving contact:', err);
      Modal.error({
        title: 'Error',
        content: err.message || 'An error occurred while sending your message. Please try again.',
        onOk: () => setSubmitting(false)
      });
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container-fluid mt-5" data-aos="fade-up">
        <div className="section-title">
          <h2>Contact</h2>
        </div>
        <div className="row" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-6">
            <div className="info-box mt-4">
              <i className="bx bx-envelope"></i>
              <h3>Email Us</h3>
              <p>
                <a href="mailto:learntekin@gmail.com">Email: learntekin@gmail.com</a>
              </p>
            </div>
            <div className="info-box mt-4">
              <i className="bx bx-phone-call"></i>
              <h3>Call Us</h3>
              <p>
                <a href="tel:+916382422474">Phone: +91-638-242-2474</a>
              </p>
            </div>
            <div className="info-box mt-4">
              <i className="bi bi-clock flex-shrink-0"></i>
              <h4>Open Hours:</h4>
              <p>Mon-Fri: 9AM - 5PM</p>
            </div>
          </div>

          <div className="col-lg-6 mt-4">
            <div className="info-box1">
              <Card className="form-card" bordered={false}>
                <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Get In Touch</h3>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                  <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]} className="form-field"> 
                    <Input size="large" placeholder="Your Name" />
                  </Form.Item>

                  <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]} className="form-field"> 
                    <Input size="large" placeholder="Your Email" />
                  </Form.Item>

                  <Form.Item name="subject" rules={[{ required: true, message: 'Please enter subject' }]} className="form-field"> 
                    <Input size="large" placeholder="Subject" />
                  </Form.Item>

                  <Form.Item name="message" rules={[{ required: true, message: 'Please enter message' }]} className="form-field"> 
                    <Input.TextArea rows={7} placeholder="Message" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={submitting} className="btn-brand">Send Message</Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
