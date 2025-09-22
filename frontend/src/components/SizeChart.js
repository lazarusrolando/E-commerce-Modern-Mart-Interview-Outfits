import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const sizeData = [
  { size: 'S', chest: '34-36"', waist: '28-30"' },
  { size: 'M', chest: '38-40"', waist: '32-34"' },
  { size: 'L', chest: '42-44"', waist: '36-38"' },
  { size: 'XL', chest: '46-48"', waist: '40-42"' },
  { size: 'XXL', chest: '50-52"', waist: '44-46"' }
];

const SizeChart = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Size Chart
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Use this size chart as a general guide to find your perfect fit.
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Size</TableCell>
                <TableCell>Chest</TableCell>
                <TableCell>Waist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sizeData.map((row) => (
                <TableRow key={row.size}>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{row.chest}</TableCell>
                  <TableCell>{row.waist}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default SizeChart;
