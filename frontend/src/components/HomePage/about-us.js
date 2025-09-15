import React from "react";
import { Container, Typography, Grid } from "@mui/material";

const AboutUs = () => {
  return (
    <Container maxWidth="md" className="mt-4">
      <Typography variant="h4" align="center" gutterBottom>
        About Our App
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Our app is designed to help you track and manage the growth and development of your children. It provides a convenient way to monitor their weight and receive notifications for doctor check-ups based on their current weight status.
          </Typography>
          <Typography variant="body1" paragraph>
            <b>Key Features:</b>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Easy-to-use interface for entering and tracking your child's weight over time.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Automated notifications to remind you of upcoming doctor appointments or weight check-ups.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Secure and private: We prioritize the privacy and security of your child's information.
              </Typography>
            </li>
          </ul>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            With our app, you can stay on top of your child's growth and ensure their healthy development. It's a valuable tool for parents and caregivers, providing valuable insights and actionable information to support your child's well-being.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;
