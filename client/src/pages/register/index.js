import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

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
  const [phoneError, setPhoneError] = useState(""); // Added state for phone number validation error
   // Email validation regex
 const [emailError, setEmailError] = useState("");
 const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

 const [fullNameError, setFullNameError] = useState("");
 const [passwordError, setPasswordError] = useState("");

 // Full name validation regex
 const fullNameRegex = /^[a-zA-Z\s]*$/;

 // Password validation regex
 const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
 
 // show password
const [showPassword, setShowPassword] = useState(false);

const handleClickShowPassword = () => {
 setShowPassword(!showPassword);
};

 
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
  const handlePhoneChange = (event) => {
    const phoneNumber = event.target.value;
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Invalid phone number format");
    } else {
      setPhoneError("");
    }
 };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!emailRegex.test(data.get("email"))) {
      setEmailError("Email is not valid"); // Update email error state
      return; // Stop the form submission if the email is invalid
    }

     // Validate full name format using the regex
     if (!fullNameRegex.test(data.get("full_name"))) {
      setFullNameError("Full name must be a single word without spaces");
      return;
    }

    // Validate password format using the regex
    if (!passwordRegex.test(data.get("password"))) {
      setPasswordError("Password must be at least 8 characters long, contain at least one digit, and one special character");
      return;
    }

    
 

    if (
      !data.get("email") &&
      !data.get("password") &&
      !data.get("full_name") &&
      !data.get("phone_no")
    ) {
      setAlert(400);
      setTimeout(function () {
        onAlertClosed();
      }, 3000);
      return;
    }

    // if (data.get("password") !== data.get("cpassword")) {
    //   setAlert(409);
    //   setTimeout(function () {
    //     onAlertClosed();
    //   }, 3000);
    //   return;
    // }

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
                  error={!!fullNameError} // Display error if full name is invalid
                  helperText={fullNameError}
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
                  error={!!emailError} // Display error if email is invalid
                  helperText={emailError} 
                  
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
                  onChange={handlePhoneChange} // Added onChange handler for phone number validation
                 error={!!phoneError} // Display error if phone number is invalid
                 helperText={phoneError}
                  
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
              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='cpassword'
                  label='Confirm Password'
                  type='password'
                  id='cpassword'
                  autoComplete='new-password'
                />
              </Grid> */}
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 ,backgroundColor:'#fc8019'}}
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
