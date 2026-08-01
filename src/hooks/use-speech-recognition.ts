import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function useSpeechRecognition(lang = "en-US") {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const baseRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(Boolean(Ctor));
  }, []);

  const start = useCallback(
    (existingText = "") => {
      setError(null);
      const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!Ctor) {
        setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
        return;
      }
      const rec: SpeechRecognitionLike = new Ctor();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang;
      baseRef.current = existingText ? existingText.trim() + " " : "";
      setFinalTranscript(baseRef.current);
      setInterim("");

      rec.onresult = (event: any) => {
        let interimChunk = "";
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalChunk += t + " ";
          else interimChunk += t;
        }
        if (finalChunk) {
          baseRef.current += finalChunk;
          setFinalTranscript(baseRef.current);
        }
        setInterim(interimChunk);
      };
      rec.onerror = (e: any) => {
        setError(e?.error ? `Mic error: ${e.error}` : "Mic error");
        setIsListening(false);
      };
      rec.onend = () => {
        setIsListening(false);
        setInterim("");
      };

      try {
        rec.start();
        recRef.current = rec;
        setIsListening(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not start mic");
      }
    },
    [lang],
  );

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
  }, []);

  useEffect(() => () => recRef.current?.stop(), []);

  return { isListening, interim, transcript: finalTranscript, supported, error, start, stop };
}
