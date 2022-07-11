import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type PageHeaderProps = {
    title: string,
    subtitle: string;
    back?: boolean;
}

function PageHeader(props: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <Stack direction="row" spacing={1}>
      {props.back && (
        <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      )}
      <Stack direction="column">
        <Typography variant="h3" component="h3" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="subtitle2">
          {props.subtitle}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default PageHeader;
