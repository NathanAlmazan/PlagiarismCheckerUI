import React, { useState, useEffect } from 'react';
// Components
import LoadingOverlay from "../../components/SuspenseLoader/LoadingOverlay";
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import Container from "@mui/material/Container";
// Utils
import { noCase } from 'change-case';
import { analyzeDocument, getFilePlainContent, submitPDF, deleteDocument, saveAssignment } from '../../util/GetRequests';
// Animation
import { AnimatePresence, motion } from 'framer-motion';

const UploadFile = React.lazy(() => import("../../components/FileUpload/Upload"));
const FileAnalyzer = React.lazy(() => import("../../components/FileUpload/FileAnalyzer"));
const SuccessSnackbar = React.lazy(() => import("../../components/snackbars/SuccessSnackbar"));

type FileInformation = {
  fileId: number, 
  fileUid: string
}

function SubmitPanel() {
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
    const lines: string[] = textContent.split("\r\n");

    let pars: string[] = [];
    let paragraph = "";
    lines.forEach(line => {
      let sentence = line.split('. ');
      if (/\S/.test(sentence[sentence.length - 1]) === false) {
          paragraph += line;
          pars.push(paragraph);
          paragraph = "";
      } else {
          if (paragraph.charAt(paragraph.length - 1) === ' ' || line.charAt(0) === ' ') {
            paragraph += line;
          } else paragraph += ` ${line}`;
      }
    });

    setParagraphs(state => pars);
  }, [textContent]);

  const checkSources = (sentence: string): boolean => {
    for (let j = 0; j < sources.length; j++) {
        const test = sources[j].split(">").filter(t => /\S/.test(t));
    
        const words = sentence.split(" ").filter(t => /\S/.test(t));
        for (let x = 0; x < words.length; x++) {
            if (!test[0]) break;
            else {
                if (test[0] === noCase(words[x]).replace(/\s/g, '')) test.shift();
            }
        }
        
        if (test.length === 0) return true;
    }

    return false;
  }
  const handleFileChange = (file: File) => setDocument(file);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploaded(false);
    if (document !== null) {
      try {
        const uploaded = await submitPDF(document, 1);
        const cosineDistance = await analyzeDocument(uploaded.file_id, 1);
        setFileInfo({ fileId: uploaded.file_id, fileUid: uploaded.fileUid });
        setUploaded(true);

        if (cosineDistance !== null) {
          const textContent = await getFilePlainContent(document);

          setSources(cosineDistance.similarSentences);
          setTextContent(textContent.message);
          setPlagiarizedFile(cosineDistance.source);
          setOriginality(100 - (cosineDistance.cosineDistance * 100));
          setPlagiarized(true);
        } else {
          setPlagiarized(false);
          setSuccess(true);
          setDocument(null);
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
    if (fileInfo) await saveAssignment(7, 1, fileInfo.fileId);
    setUploaded(true);
    setPlagiarized(false);
    setSuccess(true);
    setDocument(null);
  }

  return (
    <>
      <Helmet><title>Upload File</title></Helmet>
      <PageTitleWrapper>
        <PageHeader 
          title='Assignment Title'
          subtitle="This panel will analyze your assignment's originality."
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