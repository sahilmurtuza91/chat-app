import * as React from "react";
import {
  Box,
  Button,
  CssBaseline,
  Link,
  Typography,
  Stack,
  styled,
  Divider,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FormInput from "../../components/Helper/FormInput";
import PasswordInput from "../../components/Helper/PasswordInput";
import { useLoginMutation } from "../../features/auth/authApi";

import { useDispatch } from "react-redux"
import { setUser } from "../../redux/userSlice";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(3.5),
  gap: theme.spacing(3),
  margin: "auto",
  backgroundColor: "#f4f4f4",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  borderRadius: "20px",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
}));

export default function Login() {
  const [loginUser, { isLoading, isError, error, isSuccess, data }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required!")
        .matches(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
          "Please enter a valid email address!",
        ),
      password: Yup.string()
        .min(8, "Password must be at least 8 character")
        .required("Password is required!"),
    }),
    onSubmit: async (values) => {
      // navigate("/dashboard");
      try {
        const response = await loginUser({
          email: values.email,
          password: values.password
        }).unwrap();
        dispatch(setUser(response.data)); // data is save to the user
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);;

      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong. Please try again!");
      }
    }
  });

  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <SignInContainer direction="column">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textAlign: "center",
              mb: 0.5,
              color: "#333",
            }}
          >
            <Box component="span" sx={{ color: "green", display: "block", mb: 0.5 }}>
              Welcome Back
            </Box>
            Sign in to continue to Chat App
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 1.5,
            }}
          >
            {/* Email Field */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              formik={formik}
            />
            {/* password */}
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter Password"
              formik={formik}
            />

            {/* Sign In Button */}
            <Button
              // onClick={() => {
              //   Navigate("/dashboard");
              // }}
              type="submit"
              fullWidth
              color="primary"
              variant="contained"
              sx={{
                py: 1,
                fontWeight: "bold",
                borderRadius: "8px",
                fontSize: "0.9rem",
                textTransform: "none",
                mt: 1,
                backgroundColor: "var(--c_primary)",
              }}
            >
            {isLoading ? "signing..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", }}>
              <Link
                // onClick={() => navigate("/forgot-password")}
                component="button"
                type="button"
                variant="body2"
                underline="hover"
                sx={{
                  color: "#1976d2",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>

              <Link
                component="button"
                type="button"
                onClick={() => navigate("/")}
                underline="hover"
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                }}
              >
                Sign Up
              </Link>
            </Box>

          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}

