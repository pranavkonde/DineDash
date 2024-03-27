import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function ResetPassword() {
 const [alert, setAlert] = useState(0);
 const navigate = useNavigate();

 const messages = {
    400: ["error", "All fields are required"],
    200: ["success", "Password reset successful. Redirecting to login..."],
    404: ["error", "Invalid or expired reset token."],
    500: ["error", "Internal Server error!"],
 };

 const onAlertClosed = () => {
    setAlert(0);
 };

 function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get("password") || !data.get("confirmPassword")) {
      setAlert(400);
      setTimeout(() => {
        onAlertClosed();
      }, 3000);
      return;
    }

    const resetPasswordDataObj = {
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
      token: new URLSearchParams(window.location.search).get('token'),
    };

    console.log("token",resetPasswordDataObj.token)

    axios
      .post("http://localhost:5500/user/resetPassword", resetPasswordDataObj, {
        withCredentials: true,
      })
      .then(function (res) {
        setAlert(res.status);
        if (res.status === 200) {
          setTimeout(function () {
            onAlertClosed();
            navigate("/user/login");
          }, 3000);
        }
      })
      .catch(function (err) {
        const status = err.response ? err.response.status : 500;
        setAlert(status);
        setTimeout(function () {
           onAlertClosed();
        }, 3000);
       });
       
 }

 return (
    <>
      <Container component="main" maxWidth="xs">
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
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <br></br>
          <Box>
            {alert ? (
              <>
                <Alert
                 severity={messages[alert][0]}
                 variant="filled"
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
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                 required
                 fullWidth
                 id="password"
                 label="New Password"
                 name="password"
                 type="password"
                 autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                 required
                 fullWidth
                 name="confirmPassword"
                 label="Confirm New Password"
                 type="password"
                 id="confirmPassword"
                 autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/user/login" variant="body2">
                 Back to Log In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
 );
}
