import { Box, Container, Link, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(10)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; 2022 - Plagiarism Checker
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 },
            pl: 5
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Group 4
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
