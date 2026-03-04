import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './AdminTable.module.css';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        api.get('/admin/logs').then(({data}) => setLogs(data));
    }, []);

    return (
        <div>
            <h2>System Audit Logs</h2>
            <table className={styles.table}>
                <thead>
                    <tr><th>User</th><th>Action</th><th>Target</th><th>Date</th></tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id}>
                            <td>{log.userId?.name || 'System'}</td>
                            <td><strong>{log.action}</strong></td>
                            <td>{log.targetType}</td>
                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default SystemLogs;