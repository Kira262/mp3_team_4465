// import React from 'react'

// const QuestionDetailPage = () => {
//     return (
//         <div className="max-w-4xl mx-auto">
//             <div className="text-center py-16">
//                 <h1 className="text-2xl font-bold text-gray-900">Question Detail Page</h1>
//                 <p className="text-gray-600 mt-2">Coming soon...</p>
//             </div>
//         </div>
//     )
// }

// export default QuestionDetailPage

import { useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Eye, User, Check, Flag, Share2, Bookmark } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avtar";
import { Separator } from "../components/ui/separator";
import { RichTextEditor } from "../components/RichTextEditor";
import { Link, useParams } from "react-router-dom";

// Mock question data
const mockQuestion = {
  id: "1",
  title: "How to implement authentication with JWT in React?",
  description: `I'm building a React application and need to implement JWT-based authentication. What's the best approach for storing tokens and handling authentication state across components?

Here's what I've tried so far:

\`\`\`javascript
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
};
\`\`\`

But I'm not sure if localStorage is the best place to store the JWT token, and I'm having trouble managing the authentication state across my app.`,
  tags: ["react", "jwt", "authentication", "javascript"],
  author: {
    name: "john_dev",
    avatar: "",
    reputation: 1250,
    joinedDate: "2023-05-15"
  },
  votes: 15,
  views: 245,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
};

const mockAnswers = [
  {
    id: "1",
    content: `Great question! Here's a comprehensive approach to JWT authentication in React:

## 1. Token Storage

While localStorage works, I recommend using httpOnly cookies for better security:

\`\`\`javascript
// Instead of localStorage, use httpOnly cookies
// This prevents XSS attacks from accessing your tokens
\`\`\`

## 2. Authentication Context

Create a context to manage auth state:

\`\`\`javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Implementation here...
};
\`\`\`

This approach provides better security and cleaner state management.`,
    author: {
      name: "security_expert",
      avatar: "",
      reputation: 3200
    },
    votes: 8,
    createdAt: "2024-01-15T11:15:00Z",
    isAccepted: true
  },
  {
    id: "2", 
    content: `I've been using this pattern successfully:

\`\`\`javascript
const useAuth = () => {
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  );

  const login = useCallback(async (credentials) => {
    // Login logic
  }, []);

  return { token, login, logout };
};
\`\`\`

The key is to use useCallback to prevent unnecessary re-renders.`,
    author: {
      name: "react_dev",
      avatar: "",
      reputation: 1800
    },
    votes: 3,
    createdAt: "2024-01-15T12:30:00Z",
    isAccepted: false
  }
];

export default function QuestionDetail() {
  const { id } = useParams();
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnswerText("");
    setIsSubmitting(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        asChild 
        className="hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Questions
        </Link>
      </Button>

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <Button variant="vote" size="icon">
                <ArrowUp className="w-5 h-5" />
              </Button>
              <span className={`text-lg font-bold ${mockQuestion.votes > 0 ? 'text-vote-up' : mockQuestion.votes < 0 ? 'text-vote-down' : 'text-muted-foreground'}`}>
                {mockQuestion.votes}
              </span>
              <Button variant="vote" size="icon">
                <ArrowDown className="w-5 h-5" />
              </Button>
              <Separator className="w-8 my-2" />
              <Button variant="ghost" size="icon" title="Bookmark">
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4">{mockQuestion.title}</h1>
              
              <div className="prose prose-sm max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: mockQuestion.description.replace(/\n/g, '<br>') }} />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockQuestion.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-tag-bg text-tag-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Question Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{mockQuestion.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{mockAnswers.length} answers</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-4 h-4 mr-2" />
                    Flag
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Asked {formatTime(mockQuestion.createdAt)}
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockQuestion.author.avatar} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <Link to={`/users/${mockQuestion.author.name}`} className="font-medium text-primary hover:underline">
                      {mockQuestion.author.name}
                    </Link>
                    <div className="text-muted-foreground">{mockQuestion.author.reputation} reputation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{mockAnswers.length} Answers</h2>

        {mockAnswers.map((answer) => (
          <Card key={answer.id} className={answer.isAccepted ? "border-vote-up/50 bg-vote-up/5" : ""}>
            <CardContent className={`p-6 ${answer.isAccepted ? "border-vote-up" : ""}`}>
              <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <Button variant="vote" size="icon">
                    <ArrowUp className="w-5 h-5" />
                  </Button>
                  <span className={`text-lg font-bold ${answer.votes > 0 ? 'text-vote-up' : answer.votes < 0 ? 'text-vote-down' : 'text-muted-foreground'}`}>
                    {answer.votes}
                  </span>
                  <Button variant="vote" size="icon">
                    <ArrowDown className="w-5 h-5" />
                  </Button>
                  {answer.isAccepted && (
                    <div className="mt-2">
                      <Check className="w-6 h-6 text-vote-up" />
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  <div className="prose prose-sm max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, '<br>') }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">Share</Button>
                      <Button variant="ghost" size="sm">Flag</Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        {answer.isAccepted && (
                          <Badge variant="default" className="mr-2 bg-vote-up text-white">
                            Accepted
                          </Badge>
                        )}
                        Answered {formatTime(answer.createdAt)}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={answer.author.avatar} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <Link to={`/users/${answer.author.name}`} className="font-medium text-primary hover:underline">
                          {answer.author.name}
                        </Link>
                        <div className="text-muted-foreground">{answer.author.reputation} reputation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Answer Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <RichTextEditor
              value={answerText}
              onChange={setAnswerText}
              placeholder="Write your answer here..."
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Thanks for contributing an answer to StackIt!
              </div>
              <Button 
                type="submit" 
                disabled={!answerText.trim() || isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? "Posting..." : "Post Your Answer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}