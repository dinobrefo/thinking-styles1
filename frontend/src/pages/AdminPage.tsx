import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface UserStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalCounselors: number;
  totalAssessments: number;
  totalReports: number;
  recentActivity: {
    users: number;
    assessments: number;
    reports: number;
  };
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  school?: string;
  grade?: string;
  isActive: boolean;
  createdAt: string;
  assessmentCount?: number;
  reportCount?: number;
}

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdminData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/users/stats'),
        axios.get(`/users?page=${currentPage}&limit=10`)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setTotalPages(usersRes.data.totalPages);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAdminData();
  }, [currentPage, fetchAdminData]);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await axios.put(`/users/${userId}/status`, { isActive });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive } : u));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };


  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users and monitor system activity</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Statistics */}
        {stats && (
          <div className="stats-section">
            <h2>System Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Students</h3>
                <p className="stat-number">{stats.totalStudents}</p>
              </div>
              <div className="stat-card">
                <h3>Teachers</h3>
                <p className="stat-number">{stats.totalTeachers}</p>
              </div>
              <div className="stat-card">
                <h3>Parents</h3>
                <p className="stat-number">{stats.totalParents}</p>
              </div>
              <div className="stat-card">
                <h3>Assessments</h3>
                <p className="stat-number">{stats.totalAssessments}</p>
              </div>
              <div className="stat-card">
                <h3>Reports</h3>
                <p className="stat-number">{stats.totalReports}</p>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity (Last 30 Days)</h3>
              <div className="activity-grid">
                <div className="activity-item">
                  <span className="activity-label">New Users:</span>
                  <span className="activity-value">{stats.recentActivity.users}</span>
                </div>
                <div className="activity-item">
                  <span className="activity-label">New Assessments:</span>
                  <span className="activity-value">{stats.recentActivity.assessments}</span>
                </div>
                <div className="activity-item">
                  <span className="activity-label">New Reports:</span>
                  <span className="activity-value">{stats.recentActivity.reports}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        <div className="users-section">
          <h2>Users Management</h2>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>School</th>
                  <th>Assessments</th>
                  <th>Reports</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.school || '-'}</td>
                    <td>{user.assessmentCount || 0}</td>
                    <td>{user.reportCount || 0}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-small ${user.isActive ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => toggleUserStatus(user._id, !user.isActive)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
