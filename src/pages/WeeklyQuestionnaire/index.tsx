import { Cancel } from "@mui/icons-material";
import { Fade, Grid, IconButton } from '@mui/material'
import { Link, useLocation, useHistory } from "react-router-dom";
import classes from './styles.module.scss';
import LinearProgress from '@mui/material/LinearProgress';
import Left from '@mui/icons-material/KeyboardArrowLeft'
import { Questionnaire, QuestionnaireItem, QuestionnaireResponseItem, QuestionnaireResponseItemAnswer } from 'fhir/r4';
import QuestionnaireItemRouter from "./QuestionnaireItemRouter";
import { useState } from "react";
import NextButton from "./NextButton";
import OptionButton from "../../components/Buttons/OptionButton";

interface Props {
    questionnaire: Questionnaire
}

export default function WeeklyQuestionnaire({ questionnaire }: Props) {

    const [responses, setResponses] = useState<QuestionnaireResponseItem[]>([]);

    let questions: QuestionnaireItem[] = [];
    if (questionnaire.item && questionnaire.item.length > 0) {
        questions = questionnaire.item
    }

    const location = useLocation();

    const split = location.pathname.split("/");
    const questionNumber = parseInt(split[split.length - 1]);
    const progress = (questionNumber / questions.length) * 100;

    //Refactor this to make more sense
    if (questionNumber > questions.length) {
        return (<div className={classes.container}>
            <p>This is the Summary Page</p>
            <Link to="/home">
                <OptionButton> Submit and Go Home</OptionButton>
            </Link>
        </div>)

    }

    const currentQuestion = questions[questionNumber - 1];

    const handleGroupResponse = (items : QuestionnaireResponseItem[], code: string) => {
        const index = responses.findIndex(value => { return value.linkId === code })
        let answersCopy = [...responses];
        const newValue = {linkId: code, item: items };

        if (index < 0) {
            answersCopy.push(newValue)
        } else {
            answersCopy[index] = newValue
        }
        setResponses(answersCopy)
    }

    const handleResponse = (answers: QuestionnaireResponseItemAnswer[], code: string) => {
        const index = responses.findIndex(value => { return value.linkId === code })
        let answersCopy = [...responses];
        const newValue = { linkId: code, answer: answers };

        if (index < 0) {
            answersCopy.push(newValue)
        } else {
            answersCopy[index] = newValue
        }
        setResponses(answersCopy)
    }

    return (
        <Fade in appear timeout={1000}>
            <div className={classes.container}>
                <TopText progress={progress} />
                <QuestionnaireItemRouter responses={responses} handleGroupResponse={handleGroupResponse} handleResponse={handleResponse} item={currentQuestion} />
                <NextButton questions={questions} responses={responses} />
            </div>
        </Fade>
    )
}

interface TopTextProps {
    progress: number
}

const TopText = ({ progress }: TopTextProps) => {
    const history = useHistory();
    return (
        <div>
            <Grid justifyContent="space-between" alignItems="center" container >
                <IconButton className={classes.backButton} onClick={history.goBack}>
                    <Left />
                </IconButton>
                <Link className={classes.exit} to="/home">
                    <Cancel />
                </Link>
            </Grid>
            <div style={{ flexGrow: 1, padding: "1em" }}>
                <LinearProgress variant="determinate" value={progress} />
            </div>
        </div>
    )
}