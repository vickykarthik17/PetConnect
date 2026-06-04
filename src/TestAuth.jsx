import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TestAuth = () => {
    const testRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8082/api/auth/register', {
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Registration successful!');
            console.log('Registration response:', response.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
            console.error('Registration error:', err.response?.data || err.message);
        }
    };

    const testLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8082/api/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Login successful!');
            console.log('Login response:', response.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
            console.error('Login error:', err.response?.data || err.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Test Authentication</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testRegister}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Register
                </button>
                
                <button 
                    onClick={testLogin}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Login
                </button>
            </div>
        </div>
    );
};

export default TestAuth; 