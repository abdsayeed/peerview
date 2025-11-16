import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { adminApi } from '../services/api';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDateTime } from '../utils/date';
import type { AdminStats, AdminUser, Question } from '../types';
import type { AxiosError } from 'axios';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ type: 'question' | 'user'; id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, questionsData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAllUsers(),
        adminApi.getAllQuestions(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setQuestions(questionsData);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      setDeleting(true);
      if (deleteModal.type === 'question') {
        await adminApi.deleteQuestion(deleteModal.id);
        setQuestions(questions.filter(q => q.question_id !== deleteModal.id));
        showToast('success', 'Question deleted successfully');
      } else {
        await adminApi.deleteUser(deleteModal.id);
        setUsers(users.filter(u => u.user_id !== deleteModal.id));
        showToast('success', 'User deleted successfully');
      }
      setDeleteModal(null);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      showToast('error', err.response?.data?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 px-1">
        <h1 className="text-[20px] font-medium text-black dark:text-white mb-1">
          Admin dashboard
        </h1>
        <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">
          Manage users, questions, and view platform statistics
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">Total Questions</p>
                  <p className="text-[20px] font-semibold text-black dark:text-white mt-1">
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#2AABEE]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#2AABEE]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">Total Students</p>
                  <p className="text-[20px] font-semibold text-black dark:text-white mt-1">
                    {stats.usersByRole.students}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">Total Users</p>
                  <p className="text-[20px] font-semibold text-black dark:text-white mt-1">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#707579] dark:text-[#aaaaaa]">Teachers</p>
                  <p className="text-[20px] font-semibold text-black dark:text-white mt-1">
                    {stats.usersByRole.teachers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-[15px] font-medium text-black dark:text-white">All Users</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f4f5] dark:bg-[#181818]">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e7e7] dark:divide-[#2f2f2f]">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-[#f4f4f5] dark:hover:bg-[#212121] transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Badge variant={user.role as 'student' | 'teacher' | 'admin'}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(user.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteModal({ type: 'user', id: user.user_id })}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <h2 className="text-[15px] font-medium text-black dark:text-white">All Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f4f5] dark:bg-[#181818]">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-medium text-[#707579] dark:text-[#aaaaaa] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e7e7] dark:divide-[#2f2f2f]">
                {questions.map((question) => (
                  <tr key={question.question_id} className="hover:bg-[#f4f4f5] dark:hover:bg-[#212121] transition-colors">
                    <td className="px-4 py-4 text-[13px] font-medium text-black dark:text-white">
                      <div className="max-w-xs truncate">{question.title}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-[13px] text-[#707579] dark:text-[#aaaaaa]">
                      {question.student_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-[13px]">
                      <Badge variant="default">{question.module}</Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-[13px] text-[#707579] dark:text-[#aaaaaa]">
                      {formatDateTime(question.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-[13px]">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteModal({ type: 'question', id: question.question_id })}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <ModalBody>
          <p className="text-[14px] text-[#707579] dark:text-[#aaaaaa]">
            Are you sure you want to delete this {deleteModal?.type}? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
