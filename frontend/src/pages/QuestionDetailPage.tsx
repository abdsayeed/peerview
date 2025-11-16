import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { studentApi, teacherApi } from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/TextArea';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatTimeAgo } from '../utils/date';
import type { QuestionDetail, CreateAnswerData } from '../types';
import type { AxiosError } from 'axios';

export const QuestionDetailPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const answersEndRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auto-scroll to bottom when answers change
  const scrollToBottom = () => {
    answersEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (question && question.answers.length > 0) {
      scrollToBottom();
    }
  }, [question?.answers.length]);

  const fetchQuestion = async () => {
    if (!questionId) return;

    try {
      setLoading(true);
      const data = user?.role === 'teacher' 
        ? await teacherApi.getQuestion(questionId)
        : await studentApi.getQuestion(questionId);
      setQuestion(data);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Failed to load question');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const handleSubmitAnswer = async () => {
    if (!questionId || !answerText.trim()) return;

    try {
      setSubmitting(true);
      const answerData: CreateAnswerData = { answer_text: answerText };
      const newAnswer = await teacherApi.answerQuestion(questionId, answerData);
      
      if (question) {
        setQuestion({
          ...question,
          answers: [...question.answers, newAnswer],
        });
      }
      
      setAnswerText('');
      showToast('success', 'Answer posted successfully!');
      // Scroll to the new answer
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[#e4e9ec] dark:bg-[#0e0e0e]">
      {/* Telegram-style Header */}
      <div className="bg-white dark:bg-[#212121] border-b border-[#e7e7e7] dark:border-[#2f2f2f] sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-[#707579] dark:text-[#aaaaaa] hover:text-black dark:hover:text-white hover:bg-[#e7e7e7] dark:hover:bg-[#2f2f2f] rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Avatar name={question.student_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-black dark:text-white truncate">
              {question.student_name}
            </p>
            <p className="text-[12px] text-[#707579] dark:text-[#aaaaaa]">
              {question.module} • {formatTimeAgo(question.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto tg-scrollbar p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Question Card - Telegram message style */}
          <div className="bg-white dark:bg-[#181818] rounded-xl border border-[#e7e7e7] dark:border-[#2f2f2f] p-4">
            {/* Question Title & Content */}
            <div className="mb-3">
              <h1 className="text-[17px] font-semibold text-black dark:text-white mb-2">
                {question.title}
              </h1>
              <p className="text-[15px] text-black dark:text-white whitespace-pre-wrap leading-relaxed">
                {question.description}
              </p>
            </div>

            {/* Media */}
            {question.media_url && (
              <button
                onClick={() => setMediaViewerOpen(true)}
                className="rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-[#e7e7e7] dark:border-[#2f2f2f] max-w-md"
              >
                {question.media_type === 'image' ? (
                  <img
                    src={question.media_url}
                    alt="Question media"
                    className="w-full h-auto max-h-80 object-cover"
                  />
                ) : question.media_type === 'video' ? (
                  <video
                    src={question.media_url}
                    className="w-full h-auto max-h-80 object-cover"
                  />
                ) : null}
              </button>
            )}
          </div>

          {/* Answers Section */}
          <div className="bg-white dark:bg-[#181818] rounded-xl border border-[#e7e7e7] dark:border-[#2f2f2f]">
            {/* Answers Header */}
            <div className="p-4 border-b border-[#e7e7e7] dark:border-[#2f2f2f]">
              <h2 className="text-[13px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wide">
                {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
            </div>

            {/* Answer Bubbles - Chat Style */}
            {question.answers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#e4e9ec] dark:bg-[#2f2f2f] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#707579] dark:text-[#aaaaaa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-[14px] text-[#707579] dark:text-[#aaaaaa]">
                  No answers yet.
                </p>
                {user?.role === 'teacher' && (
                  <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa] mt-1">
                    Be the first to answer!
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {question.answers.map((answer) => (
                  <div key={answer.answer_id} className="flex items-start gap-3">
                    <Avatar name={answer.teacher_name} size="sm" />
                    <div className="flex-1">
                      {/* Telegram-style bubble */}
                      <div className="inline-block max-w-[85%]">
                        <div className="bg-[#2AABEE] text-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[13px] font-medium">
                              {answer.teacher_name}
                            </p>
                            <Badge variant="teacher" className="text-[10px] px-1.5 py-0.5 bg-white/20">
                              Teacher
                            </Badge>
                          </div>
                          <p className="text-[14px] whitespace-pre-wrap leading-relaxed">
                            {answer.answer_text}
                          </p>
                        </div>
                        <p className="text-[11px] text-[#707579] dark:text-[#aaaaaa] mt-1 ml-2">
                          {formatTimeAgo(answer.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={answersEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer Composer (Teachers Only) - Fixed at bottom */}
      {user?.role === 'teacher' && (
        <div className="bg-white dark:bg-[#212121] border-t border-[#e7e7e7] dark:border-[#2f2f2f] px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-end gap-2">
            <div className="flex-1">
              <TextArea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your answer..."
                rows={1}
                className="resize-none min-h-[40px] max-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (answerText.trim()) {
                      handleSubmitAnswer();
                    }
                  }
                }}
              />
            </div>
            <Button
              onClick={handleSubmitAnswer}
              isLoading={submitting}
              disabled={!answerText.trim()}
              className="!px-4 !py-2 !min-h-[40px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {mediaViewerOpen && question.media_url && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setMediaViewerOpen(false)}
        >
          <button
            onClick={() => setMediaViewerOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {question.media_type === 'image' ? (
            <img
              src={question.media_url}
              alt="Question media"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : question.media_type === 'video' ? (
            <video
              src={question.media_url}
              controls
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
