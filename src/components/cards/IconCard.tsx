import { alpha, styled } from '@mui/material/styles';
import { Card, Button } from '@mui/material';
// Icons
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: 100,
    height: 100,
    justifyContent: 'center',
    marginBottom: 50,
  }));

type IconCardProps = {
    title: string;
    addSubject: () => void;
}

function IconCard({ title, addSubject }: IconCardProps) {
  return (
        <Card
            sx={{
                py: 5,
                boxShadow: 0,
                height: "100%",
                textAlign: 'center',
                color: (theme) => theme.palette.primary.dark,
                bgcolor: "#FFFF",
                minWidth: 300, 
                maxWidth: 345,
            }}
        >
            <IconWrapperStyle
                sx={{
                color: (theme) => theme.palette.primary.dark,
                backgroundImage: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
                        theme.palette.primary.dark,
                    0.24
                    )} 100%)`,
                }}
            >
                <AddOutlinedIcon fontSize="large" />
            </IconWrapperStyle>

            <Button variant="contained" onClick={addSubject}>{title}</Button>

        </Card>
  )
}

export default IconCard