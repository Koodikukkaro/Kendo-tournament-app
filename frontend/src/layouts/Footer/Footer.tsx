import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import "./footer.css";
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Box className="footer-links">
          <Link
            href={routePaths.kendoseinajoki}
            target="_blank"
            color="inherit"
          >
            {t("navigation.about")}
          </Link>
          <Link href={routePaths.privacy} target="_blank" color="inherit">
            {t("navigation.privacy_policy")}
          </Link>
        </Box>
        <Typography variant="body2" color="textSecondary" align="center">
          <Link href={routePaths.github} target="_blank" color="inherit">
            © {new Date().getFullYear()} Koodikukkaro & Kendoers
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
