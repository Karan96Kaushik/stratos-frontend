import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Helmet } from 'react-helmet';
import { useSnackbar } from 'material-ui-snackbar-provider';
import { authorizedReq } from 'src/utils/request';
import { LoadingContext, LoginContext } from "../myContext"

const AdminSettings = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [newIp, setNewIp] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const snackbar = useSnackbar();
  const loginState = useContext(LoginContext)

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await authorizedReq({
        route: '/api/admin/ip-settings',
        method: 'get',
        creds: loginState.loginState
      });
      console.log(response)
      setIpAddresses(response.ipAddresses);
      setIsEnabled(response.isEnabled);
    } catch (error) {
      snackbar.showMessage('Failed to fetch settings; ' + error.message);
    }
  };

  const handleAddIp = () => {
    if (!newIp) return;
    
    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIp)) {
      snackbar.showMessage('Invalid IP address format');
      return;
    }

    setIpAddresses([...ipAddresses, newIp]);
    setNewIp('');
  };

  const handleRemoveIp = (index) => {
    const newIps = ipAddresses.filter((_, i) => i !== index);
    setIpAddresses(newIps);
  };

  const handleSave = async () => {
    try {
      if (!confirm('Are you sure you want to save these settings?')) return;
      await authorizedReq({
        route: '/api/admin/ip-settings',
        method: 'post',
        creds: loginState.loginState,
        data: {
          ipAddresses,
          isEnabled
        }
      });
      snackbar.showMessage('Settings saved successfully');
    } catch (error) {
      snackbar.showMessage('Failed to save settings; ' + error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Settings | CRM</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                IP Address Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEnabled}
                      onChange={(e) => setIsEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label= {isEnabled ? "IP Address Filtering Enabled" : "IP Address Filtering Disabled"}
                />
              </Box>


              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add IP Address"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="xxx.xxx.xxx.xxx"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddIp}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>

              <List>
                {ipAddresses.map((ip, index) => (
                  <ListItem key={index}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <ListItemText primary={ip} />
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => handleRemoveIp(index)}
                          size="small"
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>

              <Typography variant="h5" color="text.secondary">Users with 'Remote Access' permission will not be restricted by IP Address Filtering</Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default AdminSettings; 