import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

export default function Login() {
  const [alert, setAlert] = useState(0);
  const navigate = useNavigate();
  // show password
const [showPassword, setShowPassword] = useState(false);
const [passwordError, setPasswordError] = useState("");

const handleClickShowPassword = () => {
 setShowPassword(!showPassword);
};

  const messages = {
    400: ["error", "Required * fields can't be empty"],
    200: ["success", "Log In successful, redirecting to home..."],
    201: ["info", "Email not verified, redirecting to verify"],
    401: ["error", "Email or Password is incorrect."],
    500: ["error", "Internal Server error!"],
  };

  const onAlertClosed = () => {
    setAlert(0);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get("email") || !data.get("password")) {
      setAlert(400);
      setTimeout(() => {
        onAlertClosed();
      }, 3000);
      return;
    }

    const loginDataObj = {
      email: data.get("email"),
      password: data.get("password"),
    };

    axios
      .post("http://localhost:5500/user/login", loginDataObj, {
        withCredentials: true,
      })
      .then(function (res) {
        setAlert(res.status);
        if (res.status === 200) {
          setTimeout(function () {
            onAlertClosed();
            navigate("/");
          }, 3000);
        } else if (res.status === 201) {
          setTimeout(function () {
            onAlertClosed();
            navigate("/user/verify", {
              state: { userId: res.data.userId, email: res.data.email },
            });
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
      <Container component="main" maxWidth="xs" className="container">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
         
          <Typography component="h1" variant="h4">
            Log In
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
              <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type={showPassword ? "text" : "password"}
                id='password'
                autoComplete='new-password'
                error={!!passwordError} // Display error if password is invalid
                helperText={passwordError}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
                />
              </Grid>
            </Grid>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            className="loginButton"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#fc8019', 
              '&:hover': {
                backgroundColor: '#fc8019', 
              },
           }}
            >
            Log In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="/user/register"
                  variant="body2"
                  sx={{ marginRight: "125px" }}
                >
                  Not registered yet? Sign up
                </Link>
              </Grid>

              <Grid item>
                <Link href="/user/forgotPassword" variant="body3" className="link">
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
