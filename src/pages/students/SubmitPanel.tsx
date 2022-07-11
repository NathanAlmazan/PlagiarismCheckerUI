import React, { useState, useEffect } from 'react';
// Components
import LoadingOverlay from "../../components/SuspenseLoader/LoadingOverlay";
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import Container from "@mui/material/Container";
// Utils
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeDocument, getFilePlainContent, submitPDF, deleteDocument, getAssignmentDate, saveAssignment } from '../../util/GetRequests';
// Animation
import { AnimatePresence, motion } from 'framer-motion';
import { Assignment } from '../../util/base';
import { useAuth } from '../../hocs/AuthProvider';

const UploadFile = React.lazy(() => import("../../components/FileUpload/Upload"));
const FileAnalyzer = React.lazy(() => import("../../components/FileUpload/FileAnalyzer"));
const SuccessSnackbar = React.lazy(() => import("../../components/snackbars/SuccessSnackbar"));

type FileInformation = {
  fileId: number, 
  fileUid: string
}

function SubmitPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classCode, assignId } = useParams();
  const [studentId, setStudentId] = useState<number>();
  const [assignmentData, setAssignmentData] = useState<Assignment>();
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [textContent, setTextContent] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<boolean>(true);
  const [plagiarized, setPlagiarized] = useState<boolean>(false);
  const [originality, setOriginality] = useState<number>(0);
  const [plagiarizedFile, setPlagiarizedFile] = useState<string>();
  const [fileInfo, setFileInfo] = useState<FileInformation>();
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (user.student) setStudentId(user.student)
    }
  }, [user])

  useEffect(() => {
    if (classCode && assignId) {
      getAssignmentDate(classCode, parseInt(assignId)).then((data) => {
        setAssignmentData(data);
      }).catch(err => console.log(err));
    }

  }, [classCode, assignId])

  
  useEffect(() => {
    const lines: string[] = textContent.split(". ");

    setParagraphs(state => lines);
  }, [textContent]);

  const checkSources = (sentence: string): boolean => {
    for (let j = 0; j < sources.length; j++) {
        const tests = sources[j].split(">");
        
        let count: number = 0;
        tests.forEach(t => {
            if (t.length > 2) {
                if (sentence.toLowerCase().search(t) !== -1) count++;
            }
        })

        if ((tests.length - count) < 5) return true;
    }

    return false;
  }

  const handleFileChange = (file: File) => setDocument(file);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploaded(false);
    if (document !== null && assignId !== undefined) {
      try {
        const uploaded = await submitPDF(document, parseInt(assignId));
        const cosineDistance = await analyzeDocument(uploaded.file_id, parseInt(assignId));
        setFileInfo({ fileId: uploaded.file_id, fileUid: uploaded.fileUid });
        setUploaded(true);

        if (cosineDistance !== null) {
          const textContent = await getFilePlainContent(document);

          setSources(cosineDistance.similarSentences);
          setTextContent(textContent.message);
          setPlagiarizedFile(cosineDistance.source?.fileName);
          setOriginality(100 - (cosineDistance.cosineDistance * 100));
          setPlagiarized(true);
        } else {
          setPlagiarized(false);
          if (studentId) {
            await saveAssignment(studentId, parseInt(assignId), uploaded.file_id);
            console.log("Saved");
          }
          setSuccess(true);
          setDocument(null);
          navigate(-1);
        }

      } catch (e) {
        console.log((e as Error).message);
      }
    }
  }

  const reloadPage = async () => {
    setUploaded(false);
    if (fileInfo) await deleteDocument(fileInfo.fileId, fileInfo.fileUid);
    setUploaded(true);
    window.location.reload();
  }

  const saveFile = async () => {
    setUploaded(false);
    if (fileInfo && assignId && studentId) {
      await saveAssignment(studentId, parseInt(assignId), fileInfo.fileId);
    }
    setUploaded(true);
    setSuccess(true);
    setDocument(null);
    navigate(-1)
  }

  return (
    <>
      <Helmet><title>Upload File</title></Helmet>
      <PageTitleWrapper>
        <PageHeader 
          title={assignmentData ? assignmentData.assignTitle : 'Assignment Title'}
          subtitle="This panel will analyze your assignment's originality."
          back
        />
      </PageTitleWrapper>
     
      <Container>
        <AnimatePresence exitBeforeEnter>
          {plagiarized ? (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <FileAnalyzer 
                paragraphs={paragraphs} 
                originality={originality}
                plagiarizedFile={plagiarizedFile ? plagiarizedFile : ""}
                fileName={document ? document.name : ""}
                totalWords={textContent.split(" ").length}
                checkSources={checkSources} 
                reloadPage={reloadPage}
                submitFile={saveFile}
              />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <UploadFile 
                fileName={document ? document.name : null} 
                submitFile={handleFileChange}
                submitForm={handleSubmit} 
                assignment={assignmentData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <LoadingOverlay open={!uploaded} />
      <SuccessSnackbar 
        open={success} 
        message="Assignment was successfully uploaded."
        handleClose={() => setSuccess(false)}
      />
    </>
  )
}

export default SubmitPanel;