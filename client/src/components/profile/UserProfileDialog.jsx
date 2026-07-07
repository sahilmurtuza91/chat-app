import {
    Dialog,
    DialogContent,
    Typography,
    Box,
    IconButton,
    Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useSelector } from "react-redux";
import UserAvatar from "../sidebar/UserAvatar";

function UserProfileDialog({ open, handleClose }) {
    const selectedUser = useSelector(
        (state) => state.conversation.selectedUser
    );

    if (!selectedUser) return null;

    
    const DetailRow = ({ icon, label, value }) => (
        <Box display="flex" alignItems="flex-start" gap={3} py={2}>
            <Box sx={{ color: "#8696a0", mt: 0.3, display: "flex", flexShrink: 0 }}>
                {icon}
            </Box>
            <Box flex={1}>
                <Typography variant="caption" sx={{ color: "#667781", fontSize: "13px" }}>
                    {label}
                </Typography>
                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: "16px",
                        color: "#111b21",
                        wordBreak: "break-word",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#f0f2f5", 
                },
            }}
        >
            
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    bgcolor: "#ffffff",
                    borderBottom: "1px solid #e9edef",
                }}
            >
                <IconButton onClick={handleClose} sx={{ color: "#3b4a54", mr: 1.5 }} size="small">
                    <CloseIcon />
                </IconButton>

                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 500,
                        color: "#3b4a54",
                        fontSize: "16px"
                    }}
                >
                    Contact info
                </Typography>
            </Box>

            <DialogContent sx={{ p: 0, "&::-webkit-scrollbar": { display: "none" } }}>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  
                    <Box
                        sx={{
                            bgcolor: "#ffffff",
                            py: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            borderBottom: "1px solid #e9edef"
                        }}
                    >
                        <Box sx={{ p: 0.5, border: "1px solid #e9edef", borderRadius: "50%", bgcolor: "#fff" }}>
                            <UserAvatar
                                name={selectedUser.name}
                                profile_pic={selectedUser.profile_pic}
                                size={150} 
                            />
                        </Box>

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: "20px",
                                fontWeight: 500,
                                color: "#111b21",
                            }}
                        >
                            {selectedUser.name}
                        </Typography>
                    </Box>

                    
                    <Box sx={{ bgcolor: "#ffffff", px: 4, py: 1, borderToP: "1px solid #e9edef" }}>
                        <DetailRow
                            icon={<PersonIcon />}
                            label="Name"
                            value={selectedUser.name}
                        />
                        
                        <Divider variant="inset" component="div" sx={{ ml: 6, borderColor: "#e9edef" }} />

                        <DetailRow
                            icon={<EmailIcon />}
                            label="Email"
                            value={selectedUser.email}
                        />

                        <Divider variant="inset" component="div" sx={{ ml: 6, borderColor: "#e9edef" }} />

                        <DetailRow
                            icon={<InfoOutlinedIcon />}
                            label="About"
                            value={selectedUser.about || "Hey there! I am using this Chat App."}
                        />
                    </Box>
                    
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default UserProfileDialog;