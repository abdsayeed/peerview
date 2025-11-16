import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { teacherApi } from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { PostSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatTimeAgo } from '../utils/date';
import type { Question } from '../types';
import type { AxiosError } from 'axios';

export const TeacherDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await teacherApi.getQuestions();
      setQuestions(data);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 px-1">
        <h1 className="text-[20px] font-medium text-black dark:text-white mb-1">
          Teacher Dashboard
        </h1>
        <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">
          View and answer student questions
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white dark:bg-[#181818] rounded-xl border border-[#e7e7e7] dark:border-[#2f2f2f]">
          <EmptyState
            icon={
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            title="No questions available"
            description="There are no questions to answer at the moment. Check back later!"
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181818] rounded-xl border border-[#e7e7e7] dark:border-[#2f2f2f]">
          {questions.map((question, index) => (
            <div 
              key={question.question_id}
              onClick={() => handleQuestionClick(question.question_id)}
              className={`p-4 cursor-pointer hover:bg-[#f4f4f5] dark:hover:bg-[#212121] transition-colors ${index === questions.length - 1 ? '' : 'border-b border-[#e7e7e7] dark:border-[#2f2f2f]'}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={question.student_name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium text-black dark:text-white">
                      {question.student_name}
                    </p>
                    <Badge variant="student">Student</Badge>
                  </div>
                  <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">
                    {formatTimeAgo(question.created_at)}
                  </p>
                </div>
                <Badge variant="default">{question.module}</Badge>
              </div>

              <div className="mb-3 pl-12">
                <h3 className="text-[15px] font-normal text-black dark:text-white mb-1 leading-snug">
                  {question.title}
                </h3>
                <p className="text-[14px] text-[#707579] dark:text-[#aaaaaa] line-clamp-2 leading-[1.35]">
                  {question.description}
                </p>
              </div>

              {question.media_url && (
                <div className="mb-2 pl-12">
                  {question.media_type === 'image' ? (
                    <img
                      src={question.media_url}
                      alt="Question media"
                      className="rounded-lg max-h-40 w-auto object-cover border border-[#e7e7e7] dark:border-[#2f2f2f]"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-[13px] text-[#707579] dark:text-[#aaaaaa]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Video attached</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-[13px] text-[#707579] dark:text-[#aaaaaa] pt-3 mt-3 border-t border-[#e7e7e7] dark:border-[#2f2f2f] pl-12">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>
                    {question.answer_count || 0}{' '}
                    {(question.answer_count || 0) === 1 ? 'answer' : 'answers'}
                  </span>
                </div>
                {(question.answer_count || 0) === 0 && (
                  <Badge variant="warning">Unanswered</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
