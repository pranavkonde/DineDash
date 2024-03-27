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


export default function ForgotPassword() {
 const [alert, setAlert] = useState(0);
 const navigate = useNavigate();

 const messages = {
    400: ["error", "Email field can't be empty"],
    200: ["success", "Password reset email sent successfully."],
    404: ["error", "Email not found."],
    500: ["error", "Internal Server error!"],
 };

 const onAlertClosed = () => {
    setAlert(0);
 };

 function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get("email")) {
      setAlert(400);
      setTimeout(() => {
        onAlertClosed();
      }, 3000);
      return;
    }

    const forgotPasswordDataObj = {
      email: data.get("email"),
    };

    axios
      .post("http://localhost:5500/user/forgotPassword", forgotPasswordDataObj, {
        withCredentials: true,
      })
      .then(function (res) {
        setAlert(res.status);
        if (res.status === 200) {
          setTimeout(function () {
            onAlertClosed();
            navigate("/user/signin");
          }, 3000);
        }
      })
      .catch(function (err) {
        setAlert(err.response.status);
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
            Forgot Password
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
                 id="email"
                 label="Email Address"
                 name="email"
                 autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Reset Email
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/user/signin" variant="body2">
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
