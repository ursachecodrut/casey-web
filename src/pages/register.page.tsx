import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { register, signInWithGoogle, signInWithFacebook } = useAuth();

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleRegiserSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register({ email, password });
      localStorage.setItem('isAuthenticated', 'true');
      setLoading(false);
      navigate('/profile');
    } catch (error) {
      setOpenSnackbar(true);
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      localStorage.setItem('isAuthenticated', 'true');
      setLoading(false);
      navigate('/profile');
    } catch (error) {
      setOpenSnackbar(true);
      console.log(error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      await signInWithFacebook();
      localStorage.setItem('isAuthenticated', 'true');
      setLoading(false);
      navigate('/profile');
    } catch (error) {
      setOpenSnackbar(true);
      console.log(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleCloseSnackbar = (reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 10,
      }}
    >
      <Card>
        <CardContent
          component="form"
          onSubmit={(e) => handleRegiserSubmit(e)}
          noValidate
        >
          <Typography variant="h5">Register</Typography>
          <FormControl variant="standard" sx={{ my: 3 }}>
            <FormGroup>
              <TextField
                variant="standard"
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="on"
                required
                sx={{ mb: 3 }}
                value={email}
                onChange={(e) => handleEmailChange(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="standard"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="password"
                autoComplete="on"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormGroup>
            <Button type="submit" variant="contained" sx={{ mx: 10 }}>
              register
            </Button>
          </FormControl>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="inherit" sx={{ mb: 2 }}>
              Or sign in with
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <FormControl>
              <FormGroup
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                >
                  Google
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookSignIn}
                >
                  Facebook
                </Button>
              </FormGroup>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          Error with register
        </Alert>
      </Snackbar>
    </Box>
  );
};
