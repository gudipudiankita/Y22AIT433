import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logger from '../utils/logger';

function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve shortened URLs from localStorage
    const stored = localStorage.getItem('shortenedUrls');
    if (stored) {
      try {
        const urls = JSON.parse(stored);
        const urlEntry = urls.find((u) => u.shortcode === shortcode);
        if (urlEntry) {
          const now = new Date();
          const expiry = new Date(urlEntry.expiryDate);
          if (now > expiry) {
            alert('This short URL has expired.');
            logger.warn('Attempted to access expired short URL', { shortcode });
            navigate('/');
            return;
          }
          // Track click
          urlEntry.clicks.push({
            timestamp: new Date(),
            source: 'redirect',
            location: 'unknown', // Could be enhanced with geo IP
          });
          // Save updated clicks
          localStorage.setItem('shortenedUrls', JSON.stringify(urls));
          logger.info('Redirecting to original URL', { shortcode, originalUrl: urlEntry.originalUrl });
          // Redirect to original URL
          window.location.href = urlEntry.originalUrl;
          return;
        } else {
          alert('Short URL not found.');
          logger.warn('Short URL not found for redirect', { shortcode });
          navigate('/');
        }
      } catch (e) {
        logger.error('Error parsing shortened URLs for redirect', { error: e });
        navigate('/');
      }
    } else {
      alert('No shortened URLs found.');
      logger.warn('No shortened URLs found in localStorage for redirect');
      navigate('/');
    }
  }, [shortcode, navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

export default RedirectHandler;
