import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import classes from './styles.module.scss';

export default function NextButton() {

    const location = useLocation();
    const split = location.pathname.split("/");
    const questionNumber = parseInt(split[split.length - 1]);

    return (<Link to={`/survey/${questionNumber + 1}`}>
        <IconButton className={classes.nextButton}>
            <KeyboardArrowRightRounded />
        </IconButton>
    </Link>)
}