import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addApplication } from "../actions/InternshipApplicationAction";
import { Typography, Form, Input, Button } from "antd";

const { Title } = Typography;

const InternshipApplication = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      await dispatch(addApplication(values));
      form.resetFields();
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit application. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <Title level={2}>Internship Application</Title>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[{ required: true, message: "Please enter your contact number" }]}
        >
          <Input placeholder="Enter your contact number" />
        </Form.Item>

        <Form.Item
          name="resumePath"
          label="Resume (PDF URL)"
          rules={[
            { required: true, message: "Please enter your resume link" },
            {
              validator: (_, value) =>
                value && value.endsWith(".pdf")
                  ? Promise.resolve()
                  : Promise.reject("Only .pdf files are allowed"),
            },
          ]}
        >
          <Input placeholder="Paste your resume .pdf link here" />
        </Form.Item>

        <Form.Item
          name="internshipTitle"
          label="Internship Title"
          rules={[{ required: true, message: "Please enter the internship title" }]}
        >
          <Input placeholder="Internship Title you are applying for" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InternshipApplication;
