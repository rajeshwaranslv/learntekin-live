import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tooltip,
  Input,
} from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  CommentOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const formatDate = (date) => {
  if (!date) return "Invalid Date";
  const d = typeof date === "string" ? new Date(date) : date?.toDate?.() || new Date(date);
  return isNaN(d) ? "Invalid Date" : d.toLocaleDateString();
};

export default function BlogPostList({
  posts,
  currentUser,
  onLike,
  onDislike,
  onShare,
  onComment,
  onDeletePost,
  onDeleteAllComments,
  onDeleteComment,
}) {
  const [commentInputs, setCommentInputs] = useState({});

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentKeyDown = (post, e) => {
    const text = commentInputs[post.id]?.trim();
    if (e.key === "Enter" && text) {
      onComment(post, text);
      setCommentInputs((prev) => ({ ...prev, [post.id]: "" }));
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <Card
          key={post.id}
          style={{ marginBottom: 16 }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>{post.title}</Title>
                <Text type="secondary">
                  Category: {post.category || "Uncategorized"} | Created by {post.createdBy || post.user?.name || "Unknown"} | {formatDate(post.createdAt)}
                </Text>
              </div>
              {(currentUser?.role === "admin" || currentUser?.id === post.user?.id) && (
                <Tooltip title="Delete post">
                  <Button
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => onDeletePost(post.id)}
                  />
                </Tooltip>
              )}
            </div>
          }
        >
          <Paragraph>{post.description || post.content || ""}</Paragraph>

          <Space wrap>
            <Button icon={<LikeOutlined />} onClick={() => onLike(post)}>
              {post.likes || 0}
            </Button>
            <Button icon={<DislikeOutlined />} onClick={() => onDislike(post)}>
              {post.dislikes || 0}
            </Button>
            <Button icon={<ShareAltOutlined />} onClick={() => onShare(post)}>
              {post.shares || 0}
            </Button>
            <Tooltip title="Comments">
              <Button icon={<CommentOutlined />}>
                {post.comments?.length || 0}
              </Button>
            </Tooltip>
            {post.comments?.length > 0 &&
              (currentUser?.role === "admin" || currentUser?.id === post.user?.id) && (
                <Button danger size="small" onClick={() => onDeleteAllComments(post)}>
                  Delete All Comments
                </Button>
              )}
          </Space>

          <div style={{ marginTop: 16 }}>
            {post.comments?.map((comment, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: 8 }}
                title={
                  <span>
                    {comment.user?.name || "Unknown"} | {formatDate(comment.createdAt)}
                  </span>
                }
                extra={
                  (currentUser?.role === "admin" || currentUser?.id === comment.user?.id) && (
                    <Button
                      size="small"
                      danger
                      onClick={() => onDeleteComment(post, index)}
                    >
                      Delete
                    </Button>
                  )
                }
              >
                <Text>{comment.text}</Text>
              </Card>
            ))}

            <Input
              value={commentInputs[post.id] || ""}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
              placeholder="Write a comment and press Enter..."
              onKeyDown={(e) => handleCommentKeyDown(post, e)}
              allowClear
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
