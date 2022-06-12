import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// Icons
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

type AnalyzerProps = {
    paragraphs: string[],
    originality: number,
    totalWords: number,
    plagiarizedFile: string,
    fileName: string,
    checkSources: (sentence: string) => boolean,
    reloadPage: () => void
}

function FileAnalyzer(props: AnalyzerProps) {
  const { paragraphs, originality, totalWords, plagiarizedFile, fileName, checkSources, reloadPage } = props;
  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item sm={12} lg={4} justifyContent="center" order={{ sm: 1, lg: 2 }}>
            <Paper>
                <List>
                    <ListItem sx={{ p: 2 }}>
                        <ListItemAvatar>
                        <Avatar sx={{ width: 50, height: 50 }}>
                            <ManageSearchOutlinedIcon fontSize="large" />
                        </Avatar>
                        </ListItemAvatar>
                        <Stack direction="column" sx={{ pl: 1 }}>
                            <Typography variant="h3" color="primary">
                                {`${originality.toFixed(2)}%`}
                            </Typography>
                            <Typography variant="body1" fontSize={16}>
                                Originality
                            </Typography>
                        </Stack>
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ p: 2 }}>
                        <ListItemAvatar>
                        <Avatar sx={{ width: 50, height: 50 }}>
                            <TextFieldsOutlinedIcon fontSize="large" />
                        </Avatar>
                        </ListItemAvatar>
                        <Stack direction="column" sx={{ pl: 1 }}>
                            <Typography variant="h3" color="primary">
                                {totalWords}
                            </Typography>
                            <Typography variant="body1" fontSize={16}>
                                Total Words
                            </Typography>
                        </Stack>
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ p: 2 }}>
                        <ListItemAvatar>
                        <Avatar sx={{ width: 50, height: 50 }}>
                            <FileCopyOutlinedIcon fontSize="large" />
                        </Avatar>
                        </ListItemAvatar>
                        <Stack direction="column" sx={{ pl: 1 }}>
                            <Typography variant="h3" color="primary">
                                {plagiarizedFile}
                            </Typography>
                            <Typography variant="body1" fontSize={16}>
                                Most Similar Document
                            </Typography>
                        </Stack>
                    </ListItem>
                </List>
                <Stack sx={{ p: 2, width: "100%" }}>
                    <Button variant="contained" color="primary" onClick={reloadPage} fullWidth>Submit Again</Button>
                </Stack>
            </Paper>
        </Grid>
        <Grid item sm={12} lg={8} order={{ sm: 2, lg: 1 }}>
            <Paper sx={{ p: 5, minHeight: 500 }}>
                <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                   {fileName}
                </Typography>
                {paragraphs.map((text, i) => {
                    const sentences = text.split('. ');

                    return (
                        <Typography key={i} variant="body1" component="p" align="justify" sx={{ mb: 1 }}>
                            {sentences.map((sentence, i) => (
                                checkSources(sentence) ? <span key={i} style={{ backgroundColor: '#ffcac8' }}>{sentence + '. '}</span> :
                                <span key={i}>{/\S/.test(sentence) && sentence + '. '}</span>
                            ))}
                        </Typography>
                    )
                })}
            </Paper>
        </Grid>
    </Grid>
  )
}

export default FileAnalyzer