import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import logger from '../utils/logger';

function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.shortcode}</TableCell>
        <TableCell>
          <a href={`http://localhost:3000/${row.shortcode}`} target="_blank" rel="noopener noreferrer">
            {`http://localhost:3000/${row.shortcode}`}
          </a>
        </TableCell>
        <TableCell>{row.createdAt.toLocaleString()}</TableCell>
        <TableCell>{row.expiryDate.toLocaleString()}</TableCell>
        <TableCell>{row.clicks.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Click Details
              </Typography>
              {row.clicks.length === 0 ? (
                <Typography variant="body2">No clicks recorded.</Typography>
              ) : (
                <Table size="small" aria-label="clicks">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.clicks.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.source}</TableCell>
                        <TableCell>{click.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Statistics() {
  // For demo, we will get shortened URLs from logger or localStorage
  // In real app, this should come from a global state or backend
  const [data, setData] = React.useState(() => {
    try {
      const stored = localStorage.getItem('shortenedUrls');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          expiryDate: new Date(item.expiryDate),
        }));
      }
    } catch (e) {
      logger.error('Failed to parse shortened URLs from localStorage', { error: e });
    }
    return [];
  });

  React.useEffect(() => {
    // Save data to localStorage on change
    localStorage.setItem('shortenedUrls', JSON.stringify(data));
  }, [data]);

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>
      {data.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="statistics table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Shortcode</TableCell>
                <TableCell>Short URL</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Expires At</TableCell>
                <TableCell>Clicks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Statistics;
