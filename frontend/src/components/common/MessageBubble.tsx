import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui/Avatar';

interface MessageBubbleProps {
  content: string;
  author: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
    avatar?: string;
  };
  timestamp: string;
  isOwn?: boolean;
  mediaUrl?: string;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  author,
  timestamp,
  isOwn = false,
  mediaUrl,
  className = '',
}) => {
  const bubbleClass = isOwn ? 'message-bubble-out' : 'message-bubble-in';
  const alignClass = isOwn ? 'ml-auto' : 'mr-auto';

  return (
    <div className={`flex gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
      {/* Avatar - only show for others' messages */}
      {!isOwn && (
        <div className="flex-shrink-0">
          <Avatar
            name={author.name}
            imageUrl={author.avatar}
            size="sm"
            className="tg-avatar"
          />
        </div>
      )}

      {/* Message content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* Author name - only show for others' messages */}
        {!isOwn && (
          <div className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1 px-1">
            {author.name}
          </div>
        )}

        {/* Message bubble */}
        <div className={`message-bubble ${bubbleClass} ${alignClass}`}>
          {/* Media preview */}
          {mediaUrl && (
            <div className="mb-2 -mx-1 -mt-1">
              <img
                src={mediaUrl}
                alt="Attachment"
                className="rounded-lg max-w-full h-auto max-h-64 object-cover"
              />
            </div>
          )}

          {/* Text content */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs mt-1 ${
              isOwn
                ? 'text-white/70'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </div>
        </div>

        {/* Role badge for teachers */}
        {!isOwn && author.role === 'teacher' && (
          <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1 px-1 font-medium">
            Teacher
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
