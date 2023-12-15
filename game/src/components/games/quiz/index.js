import styles from './quiz.module.css'
import quizBg from '../../../assets/imgs/quiz-bg.png'

function Quiz(props) {
    const { gamePack, question, userResult, gameState, handleAnswer, isShowLeaderBoard } = props
    const { answers } = question

    const renderAnswer = answers.map(answer => {
        let isSelected, isCorrected, isInCorrected
        const [userSelected] = userResult?.answers?.filter(userAnswer => userAnswer.gamePackID === gamePack.id && userAnswer.questionID === question.id && userAnswer.answerID === answer.id) ?? []
        if (userSelected) isSelected = true

        // only show result when time's up
        if (!gameState?.currentTimeLeft && userSelected?.isCorrected) isCorrected = true
        if (!gameState?.currentTimeLeft && userSelected && !userSelected?.isCorrected) isInCorrected = true

        return (
            <div className='col-6' key={answer.id}>
                <button
                    className={`w-100 h-100 ${styles.answerBtn} ${isSelected ? styles.selected : ''} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''}`}
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                >
                    {answer.text}
                </button>
            </div>
        )
    })

    return (
        <div className={`d-flex align-items-center justify-content-center flex-column p-4 ${styles.quizWrapper}`}>
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