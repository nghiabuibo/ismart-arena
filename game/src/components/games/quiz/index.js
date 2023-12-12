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
            <div>{question.title}</div>
            <div>
                {renderAnswer}
            </div>
        </>
    )
}

export default Quiz