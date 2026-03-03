import { useState, useEffect, useCallback } from 'react';
import { BOSS_FIGHT_QUESTIONS } from '../data';

interface UseBossFightOptions {
  isActive: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onComplete: (success: boolean) => void;
  currentAnswers: boolean[];
}

export function useBossFight({ isActive, onAnswer, onComplete, currentAnswers }: UseBossFightOptions) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  const question = BOSS_FIGHT_QUESTIONS[currentQuestion];

  // Shuffle answers once when question changes
  useEffect(() => {
    if (question) {
      const answers = [question.correctAnswer, ...question.wrongAnswers];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
    }
  }, [currentQuestion, question]);

  // Reset when boss fight becomes active
  useEffect(() => {
    if (isActive) {
      setCurrentQuestion(0);
      setTimeLeft(30);
      setShowExplanation(false);
      setHasAnswered(false);
      setShuffledAnswers([]);
    }
  }, [isActive]);

  // Timer logic
  useEffect(() => {
    if (!isActive || timeLeft <= 0 || hasAnswered || showExplanation) return;

    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isActive, timeLeft, hasAnswered, showExplanation]);

  // Auto-fail when time runs out
  useEffect(() => {
    if (isActive && timeLeft === 0 && !hasAnswered) {
      handleAnswer(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft, hasAnswered]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    setHasAnswered(true);
    setShowExplanation(true);
    onAnswer(isCorrect);
  }, [onAnswer]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion + 1 >= BOSS_FIGHT_QUESTIONS.length) {
      const correctAnswers = currentAnswers.filter(Boolean).length;
      onComplete(correctAnswers >= 3);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
      setHasAnswered(false);
      setShowExplanation(false);
    }
  }, [currentQuestion, currentAnswers, onComplete]);

  const correctCount = currentAnswers.filter(Boolean).length;

  return {
    currentQuestion,
    timeLeft,
    showExplanation,
    hasAnswered,
    question,
    fixedAnswers: shuffledAnswers,
    correctCount,
    totalAnswered: currentAnswers.length,
    handleAnswer,
    nextQuestion
  };
}
