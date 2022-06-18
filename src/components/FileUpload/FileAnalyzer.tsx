import { useState, SyntheticEvent } from "react";
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
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// Icons
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Utils
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>{children}</Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

type AnalyzerProps = {
    paragraphs: string[],
    originality: number,
    totalWords: number,
    plagiarizedFile: string,
    fileName: string,
    similarFileName?: string,
    similarParagraphs?: string[], 
    teacher?: boolean,
    checkSources: (sentence: string) => boolean,
    reloadPage?: () => void,
    submitFile?: () => void
}

function FileAnalyzer(props: AnalyzerProps) {
  const { paragraphs, originality, totalWords, plagiarizedFile, fileName, similarFileName, teacher, similarParagraphs, checkSources, reloadPage, submitFile } = props;
  const navigate = useNavigate();
  const [tab, setTab] = useState<number>(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Grid container spacing={2}>
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
                {Boolean(reloadPage !== undefined && submitFile !== undefined) ? (
                    <Stack direction="column" spacing={2} sx={{ p: 2, width: "100%" }}>
                        <Button variant="contained" color="primary" onClick={reloadPage} fullWidth>Submit Again</Button>
                        <Button variant="outlined" color="primary" onClick={submitFile} fullWidth>Submit Anyway</Button>
                    </Stack>
                ) : (
                    <Stack direction="column" spacing={2} sx={{ p: 2, width: "100%" }}>
                        <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" onClick={() => navigate(-1)} fullWidth>Go Back</Button>
                    </Stack>
                )}
            </Paper>
        </Grid>
        {teacher ? (
            <Grid item sm={12} lg={8} order={{ sm: 2, lg: 1 }}>
                <Box sx={{ borderBottom: 1, marginTop: { xs: 5, md: 0 }, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Current File" {...a11yProps(0)} />
                        <Tab label="Similar File" disabled={similarFileName === undefined} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={tab} index={0}>
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
                </TabPanel>
                {similarFileName !== undefined && (
                    <TabPanel value={tab} index={1}>
                        <Paper sx={{ p: 5, minHeight: 500 }}>
                            <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                                {similarFileName}
                            </Typography>
                            {similarParagraphs && similarParagraphs.map((text, i) => {
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
                    </TabPanel>
                )}
            </Grid>
        ) : (
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
        )}
    </Grid>
  )
}

export default FileAnalyzer