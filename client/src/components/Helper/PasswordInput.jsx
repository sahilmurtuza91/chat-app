import { useState } from "react";

import {
    FormControl,
    FormLabel,
    TextField,
    IconButton,
    InputAdornment,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

function PasswordInput({
    label,
    name,
    placeholder,
    formik,
}) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl>
            <FormLabel
                htmlFor={name}
                sx={{
                    mb: 0.5,
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    color: "#475569",
                }}
            >
                {label}
            </FormLabel>
            <TextField
                name={name}
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                id={name}
                autoComplete={name}
                required
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                    backgroundColor: "transparent",
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                        borderRadius: "4px",
                        position: "relative",
                    },
                    "& .MuiInputAdornment-root": {
                        zIndex: 5,
                    },
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                error={
                    formik.touched[name] && Boolean(formik.errors[name])
                }
                helperText={formik.touched[name] && formik.errors[name]}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment className="eye_btn" position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </FormControl>
    );
}

export default PasswordInput;