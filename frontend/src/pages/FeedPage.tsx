import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { studentApi } from '../services/api';
import { QuestionComposer } from '../components/feed/QuestionComposer';
import { QuestionCard } from '../components/feed/QuestionCard';
import { PostSkeleton } from '../components/ui/Skeleton';
import type { Question, CreateQuestionData } from '../types';
import type { AxiosError } from 'axios';

export const FeedPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getQuestions();
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

  const handleCreateQuestion = async (data: CreateQuestionData) => {
    try {
      setSubmitting(true);
      const newQuestion = await studentApi.createQuestion(data);
      setQuestions([newQuestion, ...questions]);
      showToast('success', 'Question posted successfully!');
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Failed to post question');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4e9ec] dark:bg-[#0e0e0e]">
      {/* Telegram-style header - fixed at top */}
      <div className="bg-white dark:bg-[#212121] border-b border-[#e7e7e7] dark:border-[#2f2f2f] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-[20px] font-medium text-black dark:text-white">
            Questions
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Composer at top for students */}
        {user?.role === 'student' && (
          <div className="bg-white dark:bg-[#181818] border-b border-t border-[#e7e7e7] dark:border-[#2f2f2f] my-4 rounded-xl">
            <QuestionComposer onSubmit={handleCreateQuestion} isLoading={submitting} />
          </div>
        )}

        {/* Questions list - like Telegram chat list */}
        <div className="bg-white dark:bg-[#181818] rounded-xl border border-[#e7e7e7] dark:border-[#2f2f2f]">
          {loading ? (
            <div>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : (!questions || questions.length === 0) ? (
            <div className="text-center py-16 px-4">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#e4e9ec] dark:bg-[#2f2f2f] flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[#707579] dark:text-[#aaaaaa]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-[17px] font-medium text-black dark:text-white mb-2">
                No questions yet
              </h3>
              <p className="text-[15px] text-[#707579] dark:text-[#aaaaaa]">
                {user?.role === 'student' ? 'Be the first to ask a question!' : 'No questions have been posted yet.'}
              </p>
            </div>
          ) : (
            <div>
              {questions?.map((question, index) => (
                <div key={question.question_id} className={index === questions.length - 1 ? '' : 'border-b border-[#e7e7e7] dark:border-[#2f2f2f]'}>
                  <QuestionCard question={question} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
