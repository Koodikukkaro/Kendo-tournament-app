import React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import "./landing.css";
import "../../common/Style/common.css";
import Footer from "components/common/Footer/Footer";

const Landing: React.FC = () => {
  return (
    <div className="app-container landing-bg">
      <main className="main-content">
        <Container maxWidth="lg" className="landing-container">
          <Typography variant="h2" component="h1" gutterBottom>
            Kendo Tournament Management
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom>
            Manage your tournaments with ease.
          </Typography>
          <div className="landing-buttons">
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              size="large"
              to="/login"
              className="button-large"
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/register"
              size="large"
              className="button-large outlined"
            >
              Register
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
