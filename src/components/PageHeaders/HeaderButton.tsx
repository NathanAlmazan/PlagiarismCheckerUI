import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

type HeaderProps = {
  title: string,
  subtitle: string,
  buttonText: string,
  buttonClick: () => void;
  back?: boolean;
}

function PageHeader({ buttonText, title, subtitle, back, buttonClick }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Stack direction="row" spacing={1}>
          {back && (
            <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          )}
          <Stack direction="column">
            <Typography variant="h3" component="h3" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle2">
              {subtitle}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={buttonClick}
        >
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
