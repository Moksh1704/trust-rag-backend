export function detectHallucinations(
  answer,
  retrievedChunks
) {

  const answerWords =
    answer
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);

  const hallucinatedWords = [];

  for (const word of answerWords) {

    const existsInContext =
      retrievedChunks.some(chunk =>
        chunk.text
          .toLowerCase()
          .includes(word)
      );

    if (!existsInContext) {
      hallucinatedWords.push(word);
    }
  }

  const hallucinationRate =
    hallucinatedWords.length /
    answerWords.length;

  return {
    hallucinated_words:
      hallucinatedWords,

    hallucination_rate:
      Number(
        hallucinationRate.toFixed(2)
      ),

    hallucination_detected:
      hallucinationRate > 0.3
  };
}