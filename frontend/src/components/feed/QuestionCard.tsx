import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { formatTimeAgo } from '../../utils/date';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
}

// Module color mapping
const moduleColors: Record<string, string> = {
  'COM101': 'text-blue-500 border-blue-500/30',
  'COM205': 'text-purple-500 border-purple-500/30',
  'COM301': 'text-green-500 border-green-500/30',
  'COM405': 'text-orange-500 border-orange-500/30',
  'COM501': 'text-red-500 border-red-500/30',
  'COM682': 'text-indigo-500 border-indigo-500/30',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const navigate = useNavigate();
  const moduleColor = moduleColors[question.module] || 'text-[#2AABEE] border-[#2AABEE]/30';

  const handleClick = () => {
    navigate(`/question/${question.question_id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="border-b border-[#e7e7e7] dark:border-[#2f2f2f] px-4 py-3 hover:bg-[#f4f4f5] dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar name={question.student_name} size="md" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Name, Module and Time */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-semibold text-black dark:text-white">
              {question.student_name}
            </h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${moduleColor}`}>
              {question.module}
            </span>
            <span className="text-[13px] text-[#707579] dark:text-[#aaaaaa] ml-auto">
              {formatTimeAgo(question.created_at)}
            </span>
          </div>

          {/* Question Title - Telegram style */}
          <h4 className="text-[15px] font-normal text-black dark:text-white mb-1 leading-snug">
            {question.title}
          </h4>

          {/* Description preview */}
          <p className="text-[14px] text-[#707579] dark:text-[#aaaaaa] line-clamp-2 leading-[1.35] mb-2">
            {question.description}
          </p>

          {/* Media preview - Telegram style rounded corners */}
          {question.media_url && (
            <div className="mt-2 mb-2 overflow-hidden rounded-xl max-w-md border border-[#e7e7e7] dark:border-[#2f2f2f]">
              {question.media_type === 'image' ? (
                <img
                  src={question.media_url}
                  alt="Question media"
                  className="w-full h-auto max-h-64 object-cover"
                />
              ) : question.media_type === 'video' ? (
                <video
                  src={question.media_url}
                  className="w-full h-auto max-h-64 object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null}
            </div>
          )}

          {/* Footer - answer count and interactions */}
          <div className="flex items-center gap-4 mt-2 text-[13px] text-[#707579] dark:text-[#aaaaaa]">
            <div className="flex items-center gap-1.5">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">{question.answer_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
