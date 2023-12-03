import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { type LoginRequest } from "types/requests";
import useToast from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { type LocationState } from "types/global";
import {
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm
} from "react-hook-form-mui";
import routePaths from "routes/route-paths";
import Link from "@mui/material/Link";

interface LoginFormData {
  email: string;
  password: string;
}

const defaultValues: LoginFormData = {
  email: "",
  password: ""
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as LocationState;
  const showToast = useToast();
  const { isAuthenticated, login } = useAuth();
  const { homeRoute } = routePaths;
  const from = location.state?.from?.pathname ?? homeRoute;

  /* Runs on the initial render and checks if the user
   * was redirected due to being unauthenticated */
  React.useEffect(() => {
    if (!isAuthenticated && from !== homeRoute) {
      showToast("You need to login to view this content", "warning");
    }
  }, [from]);

  const formContext = useForm<LoginFormData>({
    defaultValues,
    mode: "onBlur"
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await login(data as LoginRequest);
      navigate(from, { replace: true });
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <Grid container display="flex" justifyContent="center">
      <Box
        sx={{
          padding: "1em",
          width: "500px"
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          fontWeight="bold"
          alignSelf="start"
        >
          {"Sign in"}
        </Typography>

        <FormContainer
          defaultValues={defaultValues}
          formContext={formContext}
          onSuccess={onSubmit}
        >
          <TextFieldElement
            required
            name="email"
            label="Email Address"
            type="text"
            fullWidth
            margin="normal"
          />

          <PasswordElement
            required
            name="password"
            label="Password"
            fullWidth
            margin="normal"
          />

          <Box margin="auto" width="200px">
            <Button
              type="submit"
              id="btn-login"
              variant="contained"
              color="primary"
              className="login-button"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              {"Log in"}
            </Button>
          </Box>
        </FormContainer>

        <Grid container gap="10px">
          <Grid item xs>
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to={homeRoute}
                onClick={() => {
                  showToast(
                    "Password cannot be changed as of now. :(",
                    "warning"
                  );
                }}
              >
                {"Forgot password?"}
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              <Link component={RouterLink} to="/register">
                {"Don't have an account? Sign Up"}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default LoginForm;
