import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../actions/InternshipApplicationAction";
import { getInternshipListings } from "../actions/InternshipListingAction";
import { Typography, Form, Input, Button, Select } from "antd";
import "../../App.css";

const { Title } = Typography;
const { Option } = Select;

const InternshipApplication = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { list = [] } = useSelector((state) => state.internshipList || {});

  useEffect(() => {
    dispatch(getInternshipListings());
  }, [dispatch]);

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
    <div className="App" style={{ minHeight: "100vh", paddingTop: "50px" }}>
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: "500px",
          margin: "auto",
        }}
      >
        <Title level={2} style={{ marginBottom: "2rem", color: "#282c34" }}>
          Internship Application
        </Title>
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
            label="Resume (Drive Link or any URL)"
            rules={[
              { required: true, message: "Please enter your resume link" },
              {
                validator: (_, value) => {
                  const urlRegex = /^https?:\/\/.+/;
                  if (!value || urlRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Please enter a valid URL starting with http or https");
                },
              },
            ]}
          >
            <Input placeholder="Paste your resume link (Drive, Dropbox, etc.)" />
          </Form.Item>

          <Form.Item
            name="internshipTitle"
            label="Internship Title"
            rules={[{ required: true, message: "Please select the internship title" }]}
          >
            <Select placeholder="Select Internship">
              {list.map((internship) => (
                <Option key={internship.id} value={internship.title}>
                  {internship.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              block
              style={{ backgroundColor: "#282c34", borderColor: "#282c34" }}
            >
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default InternshipApplication;

