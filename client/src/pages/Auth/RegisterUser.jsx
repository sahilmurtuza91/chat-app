import * as React from "react";
import {
  Box,
  Button,
  CssBaseline,
  Link,
  Typography,
  Stack,
  styled,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useDispatch} from "react-redux"

import FormInput from "../../components/Helper/FormInput";
import PasswordInput from "../../components/Helper/PasswordInput";

import { useRegisterMutation } from "../../features/auth/authApi";
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

export default function RegisterUser() {

  const [registerUser, { isLoading, isError, error, isSuccess, data }] = useRegisterMutation();
  const dispatch = useDispatch();

  const Navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(50, "Maximum 50 characters")
        .required("Full Name is required"),
      email: Yup.string()
        .trim()
        .lowercase()
        .required("Email is required!")
        .matches(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
          "Please enter a valid email address!",
        ),
      password: Yup.string()
        .required("Password is required")
        .min(8)
        .matches(/[A-Z]/, "One uppercase required")
        .matches(/[a-z]/, "One lowercase required")
        .matches(/[0-9]/, "One number required")
        .matches(/[!@#$%^&*]/, "One special character required"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required!")
        .oneOf([Yup.ref("password")], "Passwords must match")
    }),
    onSubmit: async (values) => {
      // Navigate("/dashboard");
      try {
        const response = await registerUser({
          name: values.name,
          email: values.email,
          password: values.password
        }).unwrap();
        // console.log(response);
        dispatch(setUser(response.data)); // here data us save to store
        toast.success("Account created successfully! Welcome.", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          Navigate("/dashboard");
        }, 1000);
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong. Please try again!");
      }
    },
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
              Welcome!
            </Box>
            Create your account to continue.
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
            {/*Full Name */}
            <FormInput
              label="Full Name"
              name="name"
              placeholder="Enter Full Name"
              formik={formik}
            />

            {/* Email Field */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter Email Address"
              formik={formik}
            />

            {/* Password Field */}
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter Password"
              formik={formik}
            />

            {/* confirmPassword Field */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm Password"
              formik={formik}
            />

            {/* Sign In Button */}
            <Button

              type="submit"
              fullWidth
              color="primary"
              variant="contained"
              disabled={isLoading}
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
              {isLoading ? "Creating..." : "Create Account"}
            </Button>

            {/* login */}
            <Link
              onClick={() => Navigate("/login")}
              component="button"
              type="button"
              variant="body2"
              underline="none"
              sx={{
                alignSelf: "center",
                mt: 1,
                textDecoration: "none",
                fontSize: "0.825rem",
              }}
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}