import { useState, useRef, useCallback } from 'react';
import { PersonalityType } from '../types';
import { getRoast } from '../services/geminiService';

export function useRoast(personality: PersonalityType | null) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleRoast = useCallback(async () => {
    if (!input || !personality) return;
    setIsLoading(true);
    try {
      const roast = await getRoast(input, personality);
      setOutput(roast);
    } catch (e) {
      setOutput("Roast service unavailable. The auditors are busy.");
    }
    setIsLoading(false);
  }, [input, personality]);

  const reset = useCallback(() => {
    setInput('');
    setOutput(null);
    setIsLoading(false);
  }, []);

  return {
    input,
    setInput,
    output,
    outputRef,
    isLoading,
    handleRoast,
    reset
  };
}
