import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Modal, Form, Input, Radio, Checkbox, Button, Card } from "antd";
import 'antd/dist/reset.css';
import './formStyles.css';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://lte-node.onrender.com").trim().replace(/\/$/, "");
const CAREER_URL = `${API_BASE}/api/careers`;

const Careers = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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
        throw new Error(err.message || "Failed to submit application.");
      }
      Modal.success({
        title: "Success",
        content: "Your application has been successfully submitted! We will review it and get back to you soon.",
        onOk: () => {
          form.resetFields();
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Error submitting career form:", error);
      Modal.error({
        title: "Error",
        content: error.message || "An error occurred. Please check your connection and try again.",
        onOk: () => setSubmitting(false),
      });
    }
  };

  React.useEffect(() => {
    document.title = "Careers";
  }, []);

  return (
      <section id="careers" className="contact">
        <div className="container-fluid mt-5" data-aos="fade-up">
          <div className="section-title">
            <h2>Careers</h2>
          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-6">
              <div className="row">
                {/* Information Boxes */}
                {[
                  {
                    title: "Get Started Today",
                    content:
                      "Welcome to the Careers page of Learntekin! We are a technology organization specializing in training and development in website development, Android application development, data analytics, and data science. Our goal is to empower individuals with the skills and knowledge required to succeed in the ever-changing landscape of the technology industry. Learntek IN, LLC today!",
                  },
                  {
                    title: "Let us explore!",
                    content:
                      "At Learntekin, we value creativity, innovation, and collaboration. We believe in providing an environment that fosters growth and personal development. Our team is made up of individuals who are passionate about technology and share a common goal of making a positive impact in the industry.",
                  },
                  {
                    title: "Our Mantra on hiring",
                    content:
                      "We are constantly looking for talented individuals who are willing to take on new challenges and contribute to our mission. Whether you are a seasoned professional or just starting out in your career, we offer a variety of opportunities to help you grow and achieve your career goals.",
                  },
                ].map((box, index) => (
                  <div className="col-md-12" key={index}>
                    <div className="info-box mt-4">
                      <h3>{box.title}</h3>
                      <p align="justify">{box.content}</p>
                    </div>
                  </div>
                ))}

                {/* Job Positions */}
                {[
                  {
                    icon: "mdi:web",
                    title: "Website Developer",
                    content:
                      "We provide top-notch website development services to our clients. Our team of experienced developers uses the latest technologies and frameworks to develop websites that are responsive, fast, and secure.",
                  },
                  {
                    icon: "mdi:ab-testing",
                    title: "Automation Tester",
                    content:
                      "At LearnTek, we provide automation testing services to help our clients save time and reduce errors. Our team of experts uses the latest testing tools and technologies to automate the testing process, resulting in faster and more accurate testing.",
                  },
                  // Add more positions as needed
                ].map((position, index) => (
                  <div className="col-md-12" key={index}>
                    <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                      <i className="bi">
                        <Icon icon={position.icon} />
                      </i>
                      <h2>{position.title}</h2>
                      <p align="justify">{position.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              {/* Form Section */}
              <div className="info-box1">
                <Card className="form-card" bordered={false}>
                  <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Apply Now</h3>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ preferredTimes: [] }}
                  >
                    <Form.Item name="title" label="Title" className="form-field">
                      <Radio.Group>
                        <Radio value="Ms.">Ms.</Radio>
                        <Radio value="Mr.">Mr.</Radio>
                        <Radio value="Mrs.">Mrs.</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      name="firstName"
                      rules={[{ required: true, message: 'Please enter your first name' }]}
                      className="form-field"
                    >
                      <Input size="large" placeholder="First Name" />
                    </Form.Item>

                    <Form.Item
                      name="lastName"
                      rules={[{ required: true, message: 'Please enter your last name' }]}
                      className="form-field"
                    >
                      <Input size="large" placeholder="Last Name" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                      className="form-field"
                    >
                      <Input size="large" placeholder="Your Email" />
                    </Form.Item>

                    <Form.Item
                      name="phoneNumber"
                      rules={[{ required: true, message: 'Please enter phone number' }]}
                      className="form-field"
                    >
                      <Input size="large" placeholder="Your Phone Number" />
                    </Form.Item>

                    <Form.Item
                      name="role"
                      rules={[{ required: true, message: 'Please enter role you apply for' }]}
                      className="form-field"
                    >
                      <Input size="large" placeholder="Role apply for" />
                    </Form.Item>

                    <Form.Item name="referral" className="form-field">
                      <Input size="large" placeholder="Your Referral" />
                    </Form.Item>

                    <Form.Item name="preferredTimes" label="Preferred time to call?" className="form-field">
                      <Checkbox.Group>
                        <Checkbox value="morning">Morning</Checkbox>
                        <Checkbox value="afternoon">Afternoon</Checkbox>
                        <Checkbox value="evening">Evening</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" block loading={submitting} className="btn-brand">
                        Send Message
                      </Button>
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

export default Careers;
