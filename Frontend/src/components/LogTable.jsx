import {
  Button, Box,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadCSV } from '../utils/csvExport';

export default function LogTable({ logs }) {
  const handleExport = () => {
    downloadCSV(logs);
  };

  const getRiskColor = (description) => {
    if (description.includes("CRITICAL")) return 'error.main';
    if (description.includes("High Risk")) return 'warning.main';
    if (description.includes("Medium Risk")) return 'info.main';
    return 'success.main';
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        UEBA Log Stream (SPEDIA Compatible Schema)
      </Typography>
      
      <Button 
        variant="outlined" 
        color="primary" 
        startIcon={<DownloadIcon />} 
        onClick={handleExport}
        sx={{ mb: 2 }}
      >
        CSV Export Button
      </Button>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Agent Name</TableCell>
              <TableCell>To/CC/BCC/URL</TableCell>
              <TableCell>Description</TableCell> {/* CHANGED HEADER */}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((l) => {
                // Combine new fields for display simplicity
                const emailDetails = 
                    (l.to ? `To: ${l.to}` : '') +
                    (l.cc ? ` | CC: ${l.cc}` : '') +
                    (l.bcc ? ` | BCC: ${l.bcc}` : '');
                const combinedDetails = l.url || emailDetails;

                return (
                    <TableRow 
                        key={l.id} 
                        hover
                        sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 }, 
                            // Highlight based on description containing high risk
                            backgroundColor: l.risk_description?.includes("Risk") ? '#ffebee' : 'inherit' 
                        }}
                    >
                        <TableCell>{new Date(l.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell component="th" scope="row">{l.user}</TableCell>
                        <TableCell>{l.action}</TableCell>
                        <TableCell>{l.activity || 'N/A'}</TableCell>
                        <TableCell>{l.agent_name || 'N/A'}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{combinedDetails || '-'}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={getRiskColor(l.risk_description || '')} 
                            fontWeight="bold"
                          >
                            {l.risk_description}
                          </Typography>
                        </TableCell>
                    </TableRow>
                )
            })}
            {logs.length === 0 && (
                <TableRow>
                    {/* Updated colspan for the new 7 columns */}
                    <TableCell colSpan={7} align="center">No logs currently loaded.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}