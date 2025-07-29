import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { registerUser, authenticateUser } from '../utils/authApi';
import logger from '../utils/logger';

function AuthIntegration() {
  const [formData, setFormData] = useState({
    email: 'ggudipudiankita@gmail.com',
    name: 'Ankita Gudipudi',
    mobileNo: '9705930168',
    githubUsername: 'gudipudiankita',
    rollNo: 'y22AIT433',
    accessCode: 'CVGQQY',
  });
  const [clientInfo, setClientInfo] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleRegister = async () => {
    try {
      const result = await registerUser(formData);
      setClientInfo(result);
      setSnackbar({ open: true, message: 'Registration successful! Save your clientID and clientSecret.', severity: 'success' });
      logger.info('User registered', { result });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
      logger.error('Registration failed', { error: error.message });
    }
  };

  const handleAuthenticate = async () => {
    if (!clientInfo) {
      setSnackbar({ open: true, message: 'Please register first to get clientID and clientSecret.', severity: 'warning' });
      return;
    }
    try {
      const authData = {
        email: formData.email,
        name: formData.name,
        rollNo: formData.rollNo,
        accessCode: formData.accessCode,
        clientID: clientInfo.clientID,
        clientSecret: clientInfo.clientSecret,
      };
      const result = await authenticateUser(authData);
      setAuthToken(result.access_token);
      setSnackbar({ open: true, message: 'Authentication successful! Token obtained.', severity: 'success' });
      logger.info('User authenticated', { result });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
      logger.error('Authentication failed', { error: error.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Registration and Authentication
      </Typography>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange('email')}
        />
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange('name')}
        />
        <TextField
          label="Mobile Number"
          fullWidth
          margin="normal"
          value={formData.mobileNo}
          onChange={handleChange('mobileNo')}
        />
        <TextField
          label="GitHub Username"
          fullWidth
          margin="normal"
          value={formData.githubUsername}
          onChange={handleChange('githubUsername')}
        />
        <TextField
          label="Roll Number"
          fullWidth
          margin="normal"
          value={formData.rollNo}
          onChange={handleChange('rollNo')}
        />
        <TextField
          label="Access Code"
          fullWidth
          margin="normal"
          value={formData.accessCode}
          onChange={handleChange('accessCode')}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
          <Button variant="contained" onClick={handleAuthenticate}>
            Authenticate
          </Button>
        </Box>
      </Paper>
      {clientInfo && (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="subtitle1">Client ID:</Typography>
          <Typography sx={{ wordBreak: 'break-all' }}>{clientInfo.clientID}</Typography>
          <Typography variant="subtitle1">Client Secret:</Typography>
          <Typography sx={{ wordBreak: 'break-all' }}>{clientInfo.clientSecret}</Typography>
        </Paper>
      )}
      {authToken && (
        <Paper sx={{ padding: 2 }}>
          <Typography variant="subtitle1">Access Token:</Typography>
          <Typography sx={{ wordBreak: 'break-all' }}>{authToken}</Typography>
        </Paper>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AuthIntegration;
