import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import "./footer.css";

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Box className="footer-links">
          <Link
            href="https://www.kendoseinajoki.fi/"
            target="_blank"
            color="inherit"
          >
            About
          </Link>
          <Link href="/privacy" target="_blank" color="inherit">
            Privacy Policy
          </Link>
        </Box>
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} Koodikukkaro
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
