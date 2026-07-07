import { Avatar } from "@mui/material";

// this function help to generate the color
function stringToColor(string) {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function UserAvatar({
    name,
    profile_pic,
    size = 40,
    onClick,
}) {
  return (
    <Avatar
        // src={profile_pic ? `http://localhost:8000${profile_pic}` : ""}
        src={profile_pic || ""}
        onClick={onClick}
        sx={{
            width:size,
            height:size,
            cursor: onClick ? "pointer" : "default",
            bgcolor:profile_pic ? "transparent": stringToColor(name),
            color:"#fff",
            fontWeight:"bold"
        }}
    >
        {!profile_pic && name?.charAt(0).toUpperCase()}
    </Avatar>
  )
}

export default UserAvatar