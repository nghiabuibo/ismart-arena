function Quiz(props) {
    const { question, handleAnswer } = props
    const { answers } = question

    const renderAnswer = answers.map(answer => {
        return (
            <button key={answer.id} onClick={() => handleAnswer(answer.id)}>{answer.text}</button>
        )
    })

    return (
        <>
            {question.title &&
                <div>{question.title}</div>}

            {question.illustration &&
                <img src={process.env.REACT_APP_CMS_URL + question.illustration.url} alt="Illustration" />
            }
            
            <div>
                {renderAnswer}
            </div>
        </>
    )
}

export default Quiz