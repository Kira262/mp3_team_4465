import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { motion } from 'framer-motion';
import { Plus, Tag, ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const popularTags = [
  "react",
  "javascript",
  "typescript",
  "node.js",
  "python",
  "css",
  "html",
  "api",
  "vue.js",
  "angular",
  "express",
  "mongodb",
];

const AskQuestionPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to ask a question");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (
      normalizedTag &&
      !formData.tags.includes(normalizedTag) &&
      formData.tags.length < 5
    ) {
      // Validate tag format
      if (!/^[a-zA-Z0-9\-\.#\+]+$/.test(normalizedTag)) {
        toast.error(
          "Tags can only contain letters, numbers, hyphens, dots, and hash/plus symbols"
        );
        return;
      }
      if (normalizedTag.length > 20) {
        toast.error("Each tag must be 20 characters or less");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, normalizedTag],
      }));
      setTagInput("");
    }
  };

  const addTagButton = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      // Validate tag format
      if (!/^[a-zA-Z0-9\-\.#\+]+$/.test(tag)) {
        toast.error(
          "Tags can only contain letters, numbers, hyphens, dots, and hash/plus symbols"
        );
        return;
      }
      if (tag.length > 20) {
        toast.error("Each tag must be 20 characters or less");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const question = await response.json();
        toast.success("Question posted successfully!");
        navigate(`/question/${question.id}`);
      } else {
        toast.error("Failed to post question");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 ">
        <Button variant="default" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ask a Question</h1>
          <p className="text-muted-foreground mt-1">
            Get help from the community by asking a clear, detailed question
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Title</CardTitle>
            <p className="text-sm text-muted-foreground">
              Be specific and imagine you're asking a question to another person
            </p>
          </CardHeader>
          <CardContent>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. How to implement JWT authentication in React?"
              className="text-base"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground mt-2">
              {formData.title.length}/200 characters
            </div>
          </CardContent>
        </Card>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              What are the details of your problem?
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Provide all the details about your question. Include code, error
              messages, or context.
            </p>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Describe your problem in detail. Include what you've tried, what you expected to happen, and what actually happened..."
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tags<span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add a tag to help categorize your question
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2"></div>
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    className="input-field flex-1"
                    placeholder="Add a tag (e.g., react, javascript, typescript) - Press Enter or comma to add"
                    maxLength={20}
                    disabled={formData.tags.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={addTagButton}
                    disabled={!tagInput.trim() || formData.tags.length >= 5}
                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-primary flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Add 1-5 tags to help categorize your question (
                  {formData.tags.length}/5)
                </p>

                {/* Popular Tags Suggestions */}
                {formData.tags.length < 5 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Popular tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "react",
                        "javascript",
                        "typescript",
                        "node.js",
                        "python",
                        "css",
                        "html",
                        "api",
                        "database",
                        "authentication",
                      ]
                        .filter((tag) => !formData.tags.includes(tag))
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (formData.tags.length < 5) {
                                setFormData((prev) => ({
                                  ...prev,
                                  tags: [...prev.tags, tag],
                                }));
                              }
                            }}
                            className="text-xs px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 rounded-full transition-colors border border-gray-200 hover:border-primary-300"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {formData.tags.length}/5 tags selected
            </div>
          </CardContent>
        </Card>

        {/* Guidelines Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">
              Tips for getting good answers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>• Search to see if your question has already been asked</div>
            <div>• Write a title that summarizes the specific problem</div>
            <div>• Describe the problem thoroughly</div>
            <div>• Show what you've tried and tell us what you found</div>
            <div>• Use proper grammar and spelling</div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => navigate("/")}>
            Cancel
          </Button>

          <Button type="submit" disabled={loading} className="min-w-32">
            {loading ? "Publishing..." : "Post Your Question"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;
