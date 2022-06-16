import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MediaCard from "../cards/SubjectCard";
import { Subject } from "../../util/base";
// Components
import IconCard from "../cards/IconCard";
import { AnimatePresence, motion } from "framer-motion";

type SubjectProps = {
    subjectList: Subject[],
    selectSubject: (subjectId: number) => void,
    addSubject: () => void,
    editSubject: (subject: Subject) => void,
    deleteSubject: (subjectId: number) => void,
    selectedSub?: number
}

function SubjectList({ subjectList, selectedSub, selectSubject, addSubject, editSubject, deleteSubject }: SubjectProps) {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        let imageList: string[] = [];
        let index: number = 1;

        subjectList.forEach((subject) => {
            if (index > 5) index = 1;
            imageList.push(`/images/subjects/${index}.jpg`);
            index++;
        });

        setImages(state => imageList);
    }, [subjectList]);

  return (
    <>
        <Typography variant="h5" component="div" sx={{ pb: 3, fontSize: 20 }}>
            Subjects
        </Typography>
        <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
                pb: 2,
                overflowX: "auto",
                '&::-webkit-scrollbar': {
                    width: 8,
                    height: 8
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: "#dfdfdf",
                    borderRadius: 10
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    borderRadius: 10
                }
            }}
        >
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <IconCard title="Add Subject" addSubject={addSubject} />
                </motion.div>
                
                {subjectList.map((subject, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i*0.5 }}
                    >
                        <MediaCard 
                            title={subject.subjectTitle}
                            subtitle={subject.subjectDescription}
                            image={images[i]} 
                            selectSubject={() => selectSubject(subject.subjectId)}
                            editSubject={() => editSubject(subject)}
                            deleteSubject={() => deleteSubject(subject.subjectId)}
                            selected={selectedSub === subject.subjectId}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </Stack>
    </>
  )
}

export default SubjectList