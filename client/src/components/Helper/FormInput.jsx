import { FormControl, FormLabel, TextField } from "@mui/material";

function FormInput({
    label,
    name,
    type="text",
    placeholder,
    formik,
    ...props
}) {
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
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                autoComplete={name}
                // autoFocus
                required
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                    backgroundColor: "transparent",
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                        borderRadius: "4px",
                    },
                }}

                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
                {...props}
            />
        </FormControl>
    )
}

export default FormInput