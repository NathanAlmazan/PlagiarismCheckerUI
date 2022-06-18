import { useState, useEffect, ChangeEvent } from "react";
import {
    Tooltip,
    Divider,
    Box,
    Stack,
    FormControl,
    InputLabel,
    Card,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    MenuItem,
    Typography,
    CardHeader,
    Button
  } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from "react-router-dom";
import Label from '../../Label';
import InsertPageBreakTwoToneIcon from '@mui/icons-material/InsertPageBreakTwoTone';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import BulkActions from './BulkActions';
import { AnimatePresence, motion } from "framer-motion";
import { FileStorage } from "../../../util/base";

  type Filters = "passed" | "marginal" | "plagiarized" | "all" | "unchecked";

  const getStatusLabel = (score: number): JSX.Element => {
    const map = [
      {
        text: 'plagiarized',
        color: 'error'
      },
      {
        text: 'passed',
        color: 'success'
      },
      {
        text: 'marginal',
        color: 'warning'
      },
      {
        text: 'unchecked',
        color: 'primary'
      }
    ];

    let stats = "passed";

    if (score === 0) stats = "unchecked";
    else if (score < 60 && score > 30) stats = "marginal";
    else if (score < 30 ) stats = "plagiarized";

    const status = map.find(s => s.text === stats);
  
    if (!status) return (<div>No Status</div>);

    return <Label color={status.color as any} text={status.text} />;
  };

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
        id: 'passed',
        name: 'Passed'
    },
    {
      id: 'marginal',
      name: 'Marginal'
    },
    {
      id: 'plagiarized',
      name: 'Plagiarized'
    },
    {
      id: 'unchecked',
      name: 'Not Checked'
    }
  ];

  const applyPagination = (
    submittedFiles: FileStorage[],
    page: number,
    limit: number
  ): FileStorage[] => {
    return submittedFiles.slice(page * limit, page * limit + limit);
  };

  type FileStorageProps = {
    assignmentTitle: string;
    classCode: string;
    assignId: number;
    submittedFiles: FileStorage[];
  }

  function FileStorageTable({ assignmentTitle, submittedFiles, classCode, assignId }: FileStorageProps) {
    const navigate = useNavigate();
    const [filteredFiles, setFilteredFiles] = useState<FileStorage[]>(submittedFiles);
    const [paginatedFiles, setPaginatedFiles] = useState<FileStorage[]>([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [filters, setFilters] = useState<Filters>("all");

    useEffect(() => {
        setFilteredFiles(state => submittedFiles);
    }, [submittedFiles]);

    useEffect(() => {
        setPaginatedFiles(applyPagination(
            filteredFiles,
            page,
            limit
        ));
    }, [filteredFiles, page, limit])

    const handleStatusChange = (e: SelectChangeEvent) => setFilters(e.target.value as Filters);
    const handlePageChange = (event: any, newPage: number) => setPage(newPage);
    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => setLimit(parseInt(event.target.value));
    const handleSelectOneFile = (
        event: ChangeEvent<HTMLInputElement>,
        fileId: number
      ): void => {
        if (!selectedFiles.includes(fileId)) {
            setSelectedFiles((prevSelected) => [
            ...prevSelected,
            fileId
          ]);
        } else {
            setSelectedFiles((prevSelected) =>
            prevSelected.filter((id) => id !== fileId)
          );
        }
      };

    return (
    <AnimatePresence>
        <motion.div
            key={assignmentTitle}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.5 }}
        >
        <Card sx={{ mt: 5 }}>
            {selectedFiles.length > 0 && (
                <Box flex={1} p={2}>
                    <BulkActions />
                </Box>
            )}
            {selectedFiles.length === 0 && (
                <CardHeader
                    action={
                    <Stack direction="row" spacing={2} width={250}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filters}
                            onChange={handleStatusChange}
                            label="Status"
                            autoWidth
                        >
                            {statusOptions.map((statusOption) => (
                            <MenuItem key={statusOption.id} value={statusOption.id}>
                                {statusOption.name}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <Button sx={{ width: 150 }} variant="contained" onClick={() => navigate(`/teacher/upload/${classCode}/${assignId}`)}>
                            Upload
                        </Button>
                    </Stack>
                    }
                    title={assignmentTitle}
                />
            )}

            <Divider />

            <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                            color="primary"
                            //checked={selectedAllCryptoOrders}
                            //indeterminate={selectedSomeCryptoOrders}

                            //onChange={handleSelectAllCryptoOrders}
                            />
                        </TableCell>
                        <TableCell>UID</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>File Name</TableCell>
                        <TableCell>Date Submitted</TableCell>
                        <TableCell align="right">Originality</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedFiles.map(file => {
                            const dateString = new Date(file.dateUploaded).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            const timeString = new Date(file.dateUploaded).toLocaleTimeString('en-US');
                            const isSelected = selectedFiles.includes(file.file_id);
                            const originality = 100 - (100 * file.originalityScore);

                            return (
                                <TableRow
                                    hover
                                    key={file.file_id}
                                    selected={isSelected}
                                    >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isSelected}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleSelectOneFile(event, file.file_id)
                                            }
                                            value={isSelected}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {file.fileUid.slice(0, 15) + "..."}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {file.assignmentList ? 
                                                file.assignmentList.student.studentAccount.firstName + " " + file.assignmentList.student.studentAccount.lastName : 
                                                "Sample File"
                                            }
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {file.assignmentList ? 
                                                file.assignmentList.student.studentAccount.email : 
                                                "For testing purposes only."
                                            }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {file.fileName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            application/pdf
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {dateString}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {timeString}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {`${originality.toFixed(2)}%`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {getStatusLabel(originality)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Assess Document" arrow>
                                        <IconButton
                                            sx={{
                                            '&:hover': {
                                                background: (theme) => theme.colors.primary.lighter
                                            },
                                            color: (theme) => theme.palette.primary.main
                                            }}
                                            color="inherit"
                                            size="small"
                                            onClick={() => navigate(`/teacher/assess/${file.fileUid}/${assignId}`)}
                                        >
                                            <InsertPageBreakTwoToneIcon fontSize="small" />
                                        </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download File" arrow>
                                        <IconButton
                                            onClick={() => window.open(file.originalFileLink)}
                                            sx={{
                                            '&:hover': { background: (theme) => theme.colors.error.lighter },
                                            color: (theme) => theme.palette.error.main
                                            }}
                                            color="inherit"
                                            size="small"
                                        >
                                            <DownloadTwoToneIcon fontSize="small" />
                                        </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        {Boolean(paginatedFiles.length < limit && filteredFiles.length > 0) && (
                            <TableRow sx={{ height: 60 * (limit - paginatedFiles.length) }} />
                        )}

                        {filteredFiles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: "column",
                                        width: '100%',
                                        height: { xs: 200, sm: 280 },
                                        m: 3
                                    }}>
                                        <img alt="assignment" src="/images/covers/assignment.png" style={{ objectFit: "scale-down", height: "100%" }} />
                                        <Typography variant="h5" align="center">No submission yet.</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={filteredFiles.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                />
            </Box>
        </Card>
        </motion.div>
    </AnimatePresence>
    )
  }
  
  export default FileStorageTable;