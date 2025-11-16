import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
