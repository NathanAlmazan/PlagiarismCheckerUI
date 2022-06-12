import { Typography } from '@mui/material';

type PageHeaderProps = {
    title: string,
    subtitle: string
}

function PageHeader(props: PageHeaderProps) {
  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="subtitle2">
        {props.subtitle}
      </Typography>
    </>
  );
}

export default PageHeader;
