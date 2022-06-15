import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// Icons
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

type HeaderProps = {
  title: string,
  subtitle: string,
  buttonText: string,
  buttonClick: () => void
}

function PageHeader({ buttonText, title, subtitle, buttonClick }: HeaderProps) {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle2">
          {subtitle}
        </Typography>
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
