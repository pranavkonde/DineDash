import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Radio, RadioGroup } from "@mui/material";
import axios from "axios";

const theme = createTheme();

export default function Register() {
  const [alert, setAlert] = useState(0);

  const navigate = useNavigate();

  const messages = {
    400: ["error", "Required * fields can't be empty"],
    409: ["error", "Passwords are not matching"],
    200: ["success", "Registered Successfully, Verify email..."],
    404: ["info", "Email already registered with us, please login!!"],
    500: ["error", "Internal Server error!"],
  };

  const onAlertClosed = () => {
    setAlert(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (
      !data.get("email") ||
      !data.get("password") ||
      !data.get("full_name") ||
      !data.get("phone_no") ||
      !data.get("cpassword")
    ) {
      setAlert(400);
      setTimeout(function () {
        onAlertClosed();
      }, 3000);
      return;
    }

    if (data.get("password") !== data.get("cpassword")) {
      setAlert(409);
      setTimeout(function () {
        onAlertClosed();
      }, 3000);
      return;
    }

    const registerDataObj = {
      email: data.get("email"),
      password: data.get("password"),
      full_name: data.get("full_name"),
      phone_no: data.get("phone_no"),
    };

    console.log(registerDataObj);

    axios
      .post("http://localhost:5500/user/register", registerDataObj, { withCredentials: true })
      .then(function (res) {
        setAlert(res.status);
        setTimeout(function () {
          navigate("/user/verify", {
            state: { userId: res.data.userId, email: res.data.email },
          });
        }, 3000);
      })
      .catch(function (err) {
        setAlert(err.response.status);
      });
  };

  return (
    <>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Register
          </Typography>
          <br></br>
          <Box>
            {alert ? (
              <>
                <Alert
                  severity={messages[alert][0]}
                  variant='filled'
                  onClose={onAlertClosed}
                >
                  {" "}
                  {messages[alert][1]}{" "}
                </Alert>
                <br></br>
              </>
            ) : (
              <></>
            )}
          </Box>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='full_name'
                  label='Full Name'
                  name='full_name'
                  autoComplete='full_name'
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete='given-name'
                  name='email'
                  required
                  fullWidth
                  id='email'
                  label='Email Id'
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete='given-name'
                  name='phone_no'
                  required
                  fullWidth
                  id='phone'
                  label='Phone no.'
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='cpassword'
                  label='Confirm Password'
                  type='password'
                  id='cpassword'
                  autoComplete='new-password'
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link href='/user/signin' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
              </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
