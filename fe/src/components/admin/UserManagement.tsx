import React, { useState, useEffect } from 'react';
import type { User } from '../../types/auth';
import './UserManagement.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth()

    useEffect(() => {
        const fetchUsers = async () => {
          setLoading(true);

          try {
            const response = await axios.get<{ data: User[] }>(
              'http://localhost:3000/users',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setUsers(response.data.data);
          } catch (err) {
            console.error('Error fetching users:', err);
          } finally {
            setLoading(false);
          }
        };

        fetchUsers();
      }, []);

const handleAssignAdmin = async (userId: string, userName: string) => {
  if (!window.confirm(`Are you sure you want to assign admin role to ${userName}?`)) return;


  try {
    await axios.put(
      `http://localhost:3000/users/${userId}/promote-to-admin`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, role: 'ADMIN' as const }
        : user
    ));

    alert(`${userName} is now an admin!`);
  } catch (error) {
    console.error('Error promoting user:', error);
    alert('Failed to assign admin role. Please try again.');
  }
};

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <p>Manage user roles and permissions</p>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="name-cell">
                  <div className="user-name">{user.name}</div>
                </td>
                <td className="email-cell">{user.username}</td>
                <td className="role-cell">
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td className="actions-cell">
                  {user.role === 'USER' && (
                    <button
                      onClick={() => handleAssignAdmin(user.id, user.name)}
                      className="assign-admin-btn"
                    >
                      👑 Make Admin
                    </button>
                  )}
                  {user.role === 'ADMIN' && (
                    <span className="admin-note">Already Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="no-users">
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
