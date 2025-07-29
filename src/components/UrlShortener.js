import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { isValidUrl, isValidShortcode, generateShortcode } from '../utils/urlUtils';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_VALIDITY_MINUTES = 30;

function UrlShortener() {
  const [urls, setUrls] = useState([
    { id: uuidv4(), originalUrl: '', validity: '', shortcode: '', error: '' },
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Handle input change for each URL entry
  const handleInputChange = (id, field, value) => {
    setUrls((prev) =>
      prev.map((url) => (url.id === id ? { ...url, [field]: value, error: '' } : url))
    );
  };

  // Validate inputs and generate shortcodes
  const validateAndShorten = () => {
    let hasError = false;
    const newUrls = urls.map((url) => {
      let error = '';
      if (!url.originalUrl || !isValidUrl(url.originalUrl)) {
        error = 'Invalid URL format';
        hasError = true;
      }
      if (url.validity && (!Number.isInteger(Number(url.validity)) || Number(url.validity) <= 0)) {
        error = 'Validity must be a positive integer';
        hasError = true;
      }
      if (url.shortcode && !isValidShortcode(url.shortcode)) {
        error = 'Shortcode must be alphanumeric and 3-10 characters';
        hasError = true;
      }
      return { ...url, error };
    });
    setUrls(newUrls);
    if (hasError) {
      setSnackbar({ open: true, message: 'Please fix errors before submitting.', severity: 'error' });
      logger.warn('Validation failed for URL inputs', { urls: newUrls });
      return;
    }

    // Check for shortcode uniqueness
    const existingShortcodes = new Set(shortenedUrls.map((u) => u.shortcode));
    const finalUrls = newUrls.map((url) => {
      let code = url.shortcode;
      if (!code) {
        // Generate unique shortcode
        do {
          code = generateShortcode();
        } while (existingShortcodes.has(code));
      } else if (existingShortcodes.has(code)) {
        // Collision error
        url.error = 'Shortcode already exists';
        hasError = true;
      }
      existingShortcodes.add(code);
      return { ...url, shortcode: code };
    });

    if (hasError) {
      setUrls(finalUrls);
      setSnackbar({ open: true, message: 'Shortcode collision detected. Please change.', severity: 'error' });
      logger.warn('Shortcode collision detected', { urls: finalUrls });
      return;
    }

    // Prepare shortened URLs with expiry
    const now = new Date();
    const shortened = finalUrls.map((url) => {
      const validityMinutes = url.validity ? Number(url.validity) : DEFAULT_VALIDITY_MINUTES;
      const expiryDate = new Date(now.getTime() + validityMinutes * 60000);
      return {
        id: uuidv4(),
        originalUrl: url.originalUrl,
        shortcode: url.shortcode,
        expiryDate,
        createdAt: now,
        clicks: [],
      };
    });

    setShortenedUrls((prev) => [...prev, ...shortened]);
    setUrls([{ id: uuidv4(), originalUrl: '', validity: '', shortcode: '', error: '' }]);
    setSnackbar({ open: true, message: 'URLs shortened successfully!', severity: 'success' });
    logger.info('URLs shortened', { shortened });
  };

  // Add new URL input row (max 5)
  const addUrlInput = () => {
    if (urls.length < 5) {
      setUrls((prev) => [...prev, { id: uuidv4(), originalUrl: '', validity: '', shortcode: '', error: '' }]);
    }
  };

  // Handle redirection link click to track clicks
  const handleRedirectClick = (id) => {
    setShortenedUrls((prev) =>
      prev.map((url) =>
        url.id === id
          ? {
              ...url,
              clicks: [
                ...url.clicks,
                {
                  timestamp: new Date(),
                  source: 'app',
                  location: 'unknown', // Could be enhanced with geo IP
                },
              ],
            }
          : url
      )
    );
    logger.info('Short link clicked', { id });
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      {urls.map((url, index) => (
        <Paper key={url.id} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Original URL"
                fullWidth
                value={url.originalUrl}
                onChange={(e) => handleInputChange(url.id, 'originalUrl', e.target.value)}
                error={!!url.error && url.error.includes('URL')}
                helperText={url.error && url.error.includes('URL') ? url.error : ''}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Validity (minutes)"
                type="number"
                fullWidth
                value={url.validity}
                onChange={(e) => handleInputChange(url.id, 'validity', e.target.value)}
                error={!!url.error && url.error.includes('Validity')}
                helperText={url.error && url.error.includes('Validity') ? url.error : ''}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Custom Shortcode"
                fullWidth
                value={url.shortcode}
                onChange={(e) => handleInputChange(url.id, 'shortcode', e.target.value)}
                error={!!url.error && url.error.includes('Shortcode')}
                helperText={url.error && url.error.includes('Shortcode') ? url.error : ''}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              {index === urls.length - 1 && urls.length < 5 && (
                <Button variant="outlined" onClick={addUrlInput} fullWidth>
                  Add URL
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
        <Button variant="contained" onClick={validateAndShorten}>
          Shorten URLs
        </Button>
      </Box>

      {shortenedUrls.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Shortened URLs
          </Typography>
          {shortenedUrls.map((url) => (
            <Paper key={url.id} sx={{ padding: 2, marginBottom: 1 }}>
              <Typography>
                Original URL: <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</a>
              </Typography>
              <Typography>
                Short URL:{' '}
                <a
                  href={`http://localhost:3000/${url.shortcode}`}
                  onClick={() => handleRedirectClick(url.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`http://localhost:3000/${url.shortcode}`}
                </a>
              </Typography>
              <Typography>
                Expires At: {url.expiryDate.toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
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

export default UrlShortener;
