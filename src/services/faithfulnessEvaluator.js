export function evaluateFaithfulness(
  answer,
  retrievedChunks
) {

  const answerWords =
    answer
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);

  let groundedWords = 0;

  for (const word of answerWords) {

    const existsInContext =
      retrievedChunks.some(chunk =>
        chunk.text
          .toLowerCase()
          .includes(word)
      );

    if (existsInContext) {
      groundedWords++;
    }
  }

  const faithfulnessScore =
    groundedWords / answerWords.length;

  return {
    grounded_words: groundedWords,
    total_answer_words:
      answerWords.length,
    faithfulness_score:
      Number(
        faithfulnessScore.toFixed(2)
      )
  };
}