import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButtton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

type MediaCardProps = {
    title: string;
    subtitle: string;
    image: string;
    selectSubject: () => void;
    editSubject: () => void;
    deleteSubject: () => void;
    selected?: boolean;
}

function MediaCard({ image, title, subtitle, selected, selectSubject, editSubject, deleteSubject }: MediaCardProps) {
  return (
        <Card sx={{ minWidth: 300, maxWidth: 345, display: "inline-block", borderBottom: selected ? "5px solid red" : "none" }}>
            <CardMedia
                component="img"
                sx={{ height: 140 }}
                image={image}
                alt="subject photo"
                title="Contemplative Reptile"
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div" color={selected ? "primary.main" : "inherit"} sx={{ fontSize: 18 }}>
                {title}
            </Typography>
            <Typography variant="body2" color={selected ? "primary.light" : "text.secondary"}>
                {subtitle}
            </Typography>
            </CardContent>
            <CardActions 
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center"
                }}
            >
                {!selected && (
                    <IconButtton sx={{ borderRadius: "50%" }} onClick={selectSubject}>
                        <Tooltip title="Show Classrooms">
                            <ExpandMoreIcon color="inherit" />
                        </Tooltip>
                    </IconButtton>
                )}
                <IconButtton onClick={editSubject} sx={{ borderRadius: "50%" }}>
                    <Tooltip title="Edit">
                        <EditOutlinedIcon color="inherit" />
                    </Tooltip>
                </IconButtton>
                <IconButtton onClick={deleteSubject} sx={{ borderRadius: "50%" }}>
                    <Tooltip title="Delete">
                        <DeleteOutlineOutlinedIcon color="inherit" />
                    </Tooltip> 
                </IconButtton>
            </CardActions>
        </Card>
  )
}

export default MediaCard