// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
// Utils
import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';
// Icons
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
// Animation
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Assignment } from "../../util/base";

type UploadProps = {
    fileName: string | null,
    submitFile: (file: File) => void;
    submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
    assignment?: Assignment;
}

function Upload(props: UploadProps) {
    const theme = useTheme();
    const { fileName, assignment, submitFile, submitForm } = props;
    const handleDropFile = (<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {
        submitFile(acceptedFiles[0]);
    }); 

  return (
    <Grid container justifyContent="space-between" spacing={3}>
        <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
            <Dropzone
                onDrop={handleDropFile}
                accept={{ 'application/pdf': ['.pdf'] }}
                minSize={1024}
                maxSize={3072000}
            >
                {({ getRootProps, getInputProps }) => (
                <Paper sx={{ height: 300 }} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <AnimatePresence exitBeforeEnter>
                        {fileName ? (
                            <motion.div
                                key="uploaded"
                                initial={{ scale: 2, opacity: 0}}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                style={{ 
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                }}
                            >
                                <ArticleOutlinedIcon color="primary" fontSize="large" sx={{ m: 1 }} />
                                <Typography variant="body2" noWrap>
                                    Uploaded File
                                </Typography>
                                <Typography variant="body2" align="center" color="primary" sx={{ pl: 2, pr: 2 }} >
                                    {fileName}
                                </Typography>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="drop"
                                initial={{ scale: 2, opacity: 0}}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                style={{ 
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                }}
                            >
                                <CloudUploadOutlinedIcon color="primary" fontSize="large" sx={{ m: 1 }} />
                                <Typography variant="body2" noWrap>
                                    Drop your file here or
                                </Typography>
                                <Typography variant="body2" color="primary" noWrap>
                                    Browse Files
                                </Typography>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Paper>
                )}
            </Dropzone>
        </Grid>
        <Grid item xs={12} md={7} order={{ xs: 1, md: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Stack component="form" onSubmit={submitForm} direction="column" justifyContent="flex-start" spacing={2}>
                    <Stack direction="row" justifyContent="space-between" sx={{ borderBottom: `1px solid ${theme.colors.primary.main}`, pb: 1 }}>
                        <Typography variant="body2" align="right" sx={{ fontWeight: 'bold' }}>
                            {`${assignment && assignment.assignPoints} points`}
                        </Typography>
                       <Stack direction="column">
                        <Typography variant="body2" align="right" sx={{ fontWeight: 'bold' }}>
                                {assignment && "Due " + new Date(assignment?.assignDueDate).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Typography>
                            <Typography variant="body2" align="right" color="text.secondary">
                                {assignment && new Date(assignment?.assignDueDate + "T" + assignment?.assignDueTime).toLocaleTimeString('en-US')}
                            </Typography>
                       </Stack>
                    </Stack>
                    <Typography variant="body1" align="justify">
                        {assignment && assignment.assignDesc}
                    </Typography>
                    <TextField 
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Add comment..."
                        sx={{ pt: 3 }}
                    />
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ maxWidth: { xs: '100%', sm: 300 } }}
                    >
                        Submit
                    </Button>
                </Stack>
            </Paper>
        </Grid>
    </Grid>
  )
}

export default Upload