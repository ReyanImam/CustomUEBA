import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard (Analytics & Model Management)
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" color="primary">
          ✅ Model Training Page
        </Typography>
        <Typography variant="body1">
          Integrate ML backend, display feature engineering pipelines, and allow users to trigger model retraining here.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" disabled>Go to Training Page</Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="secondary" gutterBottom>
                ✅ Anomaly Detection Integration
              </Typography>
              <Typography variant="body2">
                This section would display real-time anomaly scores, a graphical representation of the model's output, and alert summaries.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" disabled>View Alerts</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="info" gutterBottom>
                ✅ SHAP Explainability Page
              </Typography>
              <Typography variant="body2">
                Visualize SHAP (SHapley Additive exPlanations) values to explain individual predictions (e.g., why a specific log received a high risk score).
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" disabled>View Explanations</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption">
            *Note: Functionality for Model Training, Anomaly Detection, and SHAP require additional backend integration.*
        </Typography>
      </Box>
    </Box>
  );
}