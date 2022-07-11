import { useEffect, useState } from  "react";
import { ClassAssignment } from '../../util/base';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AssignmentCard from "../cards/AsignmentCard";
// Animation
import { AnimatePresence, motion } from "framer-motion";

type AssignmentListProps = {
    assignments: ClassAssignment[];
    selected?: number;
    classCode: string;
    submitted?: number[];
    selectAssign: (assign: ClassAssignment) => void;
    editAssign?: (assign: ClassAssignment) => void;
    deleteAssign?: (assignId: number) => void;
}

const colorList = [ "#ff6666", "#ffbd55", "#ffff66", "#9de24f", "#87cefa", "#b19cd9" ];

function AssignmentList({ assignments, selected, classCode, submitted, editAssign, deleteAssign, selectAssign }: AssignmentListProps) {
  const [colors, setColors] = useState<string[]>(colorList);

  useEffect(()=> {
    let colors: string[] = [];
    let index: number = 0;

    assignments.forEach(assignment => {
        if (index > 5) index = 5;
        colors.push(colorList[index]);
        index++;
    })

    setColors(state => colors);
  }, [assignments])

  return (
    <>
        <Typography variant="h5" component="div" sx={{ pb: 3, fontSize: 20 }}>
            Assignments
        </Typography>
        <Stack 
            direction="row" 
            spacing={3} 
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
                {assignments.map((assignment, i) => (
                    <motion.div
                        key={assignment.assignmentId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i*0.5 }}
                    >
                        <AssignmentCard 
                            assignment={assignment}
                            color={colors[i]}
                            classCode={classCode}
                            selected={selected === assignment.assignmentId}
                            selectSubject={() => selectAssign(assignment)}
                            editSubject={editAssign ? () => editAssign(assignment) : undefined}
                            deleteSubject={deleteAssign ? () => deleteAssign(assignment.assignmentId) : undefined}
                            submitted={submitted ? Boolean(submitted.find(s => s === assignment.assignmentId) !== undefined) : undefined}
                        />
                    </motion.div>
                ))}
                {assignments.length === 0 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column",
                        width: '100%',
                        height: { xs: 200, sm: 280 }
                    }}>
                        <img alt="assignment" src="/images/covers/assignment.png" style={{ objectFit: "scale-down", height: "100%" }} />
                        <Typography variant="h3" align="center">No Assignment assigned yet</Typography>
                    </Box>
                )}
            </AnimatePresence>
        </Stack>
    </>
  )
}

export default AssignmentList