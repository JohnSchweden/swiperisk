import { useState, useCallback, useRef, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const shouldRestartRef = useRef(false);
  const lastErrorRef = useRef<string | null>(null);

  const startListening = useCallback(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Clean up previous instance
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    // Clear previous transcript
    setTranscript('');
    setError(null);
    lastErrorRef.current = null;
    
    // Mark for auto-restart
    shouldRestartRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[Speech] started');
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('[Speech] result received', event.results.length);
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result.transcript + ' ';
        } else {
          interimTranscript += result.transcript;
        }
      }

      if (finalTranscript) {
        console.log('[Speech] final:', finalTranscript);
        setTranscript(prev => prev + finalTranscript);
      } else if (interimTranscript) {
        console.log('[Speech] interim:', interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('[Speech] FULL ERROR:', JSON.stringify(event));
      console.log('[Speech] error type:', event.error);
      console.log('[Speech] error message:', event.message);
      lastErrorRef.current = event.error;
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[Speech] ended');
      console.log('[Speech] lastErrorRef:', lastErrorRef.current);
      // Auto-restart only on "no-speech" error (which happens when API thinks user stopped talking)
      // Don't restart on other errors - let user control manually
      if (shouldRestartRef.current && lastErrorRef.current === 'no-speech') {
        console.log('[Speech] no-speech detected, auto-restarting...');
        restartTimeoutRef.current = window.setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.log('[Speech] restart failed', e);
          }
        }, 100);
      } else if (shouldRestartRef.current) {
        console.log('[Speech] ended but NOT auto-restarting. Error was:', lastErrorRef.current);
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    console.log('[Speech] stopListening called');
    shouldRestartRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
  };
}
