import React, { useState } from "react";
import { Form, Input, Button, Card, message, Select } from "antd";
import { addPost } from "../actions/postsActions";

const { TextArea } = Input;
const { Option } = Select;

const PostForm = ({ onPostAdded = () => {}, currentUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { title, description, category } = values;

    const newPost = {
      title,
      description,
      category,
      createdBy: currentUser?.name || "No Name",
    };

    try {
      setLoading(true);
      await addPost(newPost);
      message.success("Post added successfully!");
      form.resetFields();
      onPostAdded();
    } catch (error) {
      console.error("Failed to add post:", error);
      message.error("Failed to add post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add New Post" className="mb-4" bordered>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          category: "Uncategorized",
        }}
      >
        <Form.Item
          label="Post Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>

        <Form.Item
          label="Post Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <TextArea rows={4} placeholder="Enter post description" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select>
            <Option value="Uncategorized">Uncategorized</Option>
            <Option value="Tech">Tech</Option>
            <Option value="Lifestyle">Lifestyle</Option>
            <Option value="News">News</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PostForm;
