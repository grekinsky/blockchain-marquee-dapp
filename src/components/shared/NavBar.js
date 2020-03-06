import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
    title: {
        flexGrow: 1
    }
}));

function NavBar() {
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Blockchain Marquee Demo
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
