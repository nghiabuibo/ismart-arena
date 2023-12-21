import styles from './quiz.module.css'
import quizBg from '../../../assets/imgs/quiz-bg.png'
import { useState } from 'react'

function Quiz(props) {
    const { gamePack, question, userResult, gameState, handleAnswer, isShowLeaderBoard } = props
    const { answers } = question
    const [inputAnswer, setInputAnswer] = useState('')

    const handleInputAnswerSubmit = (e) => {
        e.preventDefault()
        handleAnswer(inputAnswer)
    }

    let renderAnswer
    switch (question.answerType) {
        case 'select':
            renderAnswer = answers.map(answer => {
                let isSelected, isCorrected, isInCorrected, correctedAnswer
                const [userSelected] = userResult?.answers?.filter(userAnswer => userAnswer.gamePackID === gamePack.id && userAnswer.questionID === question.id && userAnswer.answer === answer.id) ?? []
                if (userSelected) isSelected = true

                // only show result when time's up
                if (!gameState?.currentTimeLeft && userSelected?.isCorrected) isCorrected = true
                if (!gameState?.currentTimeLeft && userSelected && !userSelected?.isCorrected) isInCorrected = true
                if (!gameState?.currentTimeLeft && gameState?.correctedAnswers?.some(correctedAnswer => correctedAnswer.id === answer.id)) correctedAnswer = true

                return (
                    <div className='col-6' key={answer.id}>
                        <button
                            className={`w-100 h-100 ${styles.answerBtn} ${isSelected ? styles.selected : ''} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''} ${correctedAnswer ? styles.corrected : ''}`}
                            key={answer.id}
                            onClick={() => handleAnswer(answer.id)}
                        >
                            {answer.text}
                        </button>
                    </div>
                )
            })
            break;

        case 'input':
            let isSubmittable = true
            let isCorrected, isInCorrected
            const userSubmmittedAll = userResult?.answers?.filter(userAnswer => userAnswer.gamePackID === gamePack.id && userAnswer.questionID === question.id) ?? []
            const userSubmmittedCorrected = userSubmmittedAll.filter(userSubmmitted => userSubmmitted.isCorrected)
            const [userSubmmitted] = userSubmmittedCorrected.length ? userSubmmittedCorrected : userSubmmittedAll
            
            if (
                (userSubmmitted && !question.allowMultipleAnswers)
                || (userSubmmitted && question.allowMultipleAnswers && userSubmmitted.isCorrected)
            ) {
                isSubmittable = false
                if (!inputAnswer) {
                    setInputAnswer(userSubmmitted.answer)
                }
            }

            if (!gameState?.currentTimeLeft) isSubmittable = false

            // only show result when time's up
            if (!gameState?.currentTimeLeft && userSubmmitted?.isCorrected) isCorrected = true
            if (!gameState?.currentTimeLeft && !userSubmmitted?.isCorrected) isInCorrected = true

            renderAnswer =
                <form onSubmit={handleInputAnswerSubmit} className={styles.answerInputWrapper}>
                    <input type='text' className={`${styles.answerInput} ${userSubmmitted ? styles.selected : ''} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''}`} value={inputAnswer} onChange={(e) => setInputAnswer(e.target.value)} required={true} disabled={!isSubmittable} />
                    <button type='submit' className={styles.answerInputSubmit} disabled={!isSubmittable}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff">
                            <path d="M83.4 226.6L304 256 83.4 285.4 0 480H64L512 256 64 32H0L83.4 226.6z" />
                        </svg>
                    </button>
                </form>
            break;

        default:
            break;
    }

    return (
        <div className={`d-flex align-items-center justify-content-center flex-column p-lg-4 ${styles.quizWrapper}`}>
            {
                isShowLeaderBoard &&
                <img src={quizBg} className={styles.quizBg} alt='Quiz Background' />
            }

            <div className={styles.quizContent}>
                <div className={!isShowLeaderBoard ? styles.questionBg : ''}>
                    {
                        question.title &&
                        <div className={`text-white text-center fw-bold fs-2 p-3 mb-3 ${styles.questionTitle}`}>{question.title}</div>
                    }

                    {
                        question.illustration &&
                        <img className={`mb-3 img-fluid`} src={process.env.REACT_APP_CMS_URL + question.illustration.url} alt="Illustration" />
                    }
                </div>

                <div className='row g-3 mb-3'>
                    {renderAnswer}
                </div>
            </div>
        </div>
    )
}

export default Quiz