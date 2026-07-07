import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Avatar,
    TextField,
    Button,
    CircularProgress,
    Stack,
    IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
} from "../features/auth/authApi";

function ProfilePage() {
    const navigate = useNavigate();

    const { data: userData } = useGetCurrentUserQuery();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (userData?.user) {
            setName(userData.user.name || "");
            setPreview(userData.user.profile_pic || "");
        }
    }, [userData]);

    // Memory leak avoid
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append("name", name);

            if (image) {
                formData.append("profile_pic", image);
            }

            const res = await updateProfile(formData).unwrap();

            toast.success(
                res?.message || "Profile updated successfully!"
            );
        } catch (err) {
            toast.error(
                err?.data?.message || "Something went wrong!"
            );
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />

            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "#f0f2f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 2,
                            py: 2,
                            borderBottom: "1px solid #e9edef",
                        }}
                    >
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>

                        <Typography
                            variant="h6"
                            sx={{
                                ml: 1,
                                fontWeight: 600,
                            }}
                        >
                            Profile Settings
                        </Typography>
                    </Box>

                    {/* Body */}

                    <Stack
                        spacing={4}
                        alignItems="center"
                        sx={{
                            p: 4,
                        }}
                    >
                        {/* Avatar */}

                        <Box
                            sx={{
                                position: "relative",
                                width: 120,
                                height: 120,
                            }}
                        >
                            <Avatar
                                src={preview}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: "4px solid #fff",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.15)",
                                    bgcolor: "#f0f2f5",
                                }}
                            />

                            {/* Camera */}

                            <IconButton
                                component="label"
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    width: 36,
                                    height: 36,
                                    bgcolor: "#00a884",
                                    color: "#fff",
                                    border: "2px solid #fff",
                                    zIndex: 10,

                                    "&:hover": {
                                        bgcolor: "#008069",
                                    },
                                }}
                            >
                                <PhotoCameraIcon
                                    sx={{
                                        fontSize: 18,
                                    }}
                                />

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </IconButton>
                        </Box>

                        {/* Name */}

                        <TextField
                            fullWidth
                            label="Full Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,

                                    "&.Mui-focused fieldset": {
                                        borderColor: "#00a884",
                                    },
                                },

                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#00a884",
                                },
                            }}
                        />

                        {/* Button */}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            sx={{
                                py: 1.4,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                bgcolor: "#00a884",

                                "&:hover": {
                                    bgcolor: "#008069",
                                },
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress
                                    size={22}
                                    sx={{
                                        color: "#fff",
                                    }}
                                />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </>
    );
}

export default ProfilePage;