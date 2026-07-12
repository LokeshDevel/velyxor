export type TypingState = 'idle' | 'running' | 'paused' | 'finished';
export type CharStatus = 'correct' | 'incorrect' | 'pending';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  elapsedTime: number; // in milliseconds
}

export class TypingEngine {
  private targetText: string;
  private charStatuses: CharStatus[];
  private currentPosition: number;
  private stats: TypingStats;

  constructor(targetText: string) {
    this.targetText = targetText;
    this.charStatuses = new Array(targetText.length).fill('pending');
    this.currentPosition = 0;
    this.stats = {
      wpm: 0,
      accuracy: 100,
      combo: 0,
      maxCombo: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: targetText.length,
      elapsedTime: 0,
    };
  }

  processKeystroke(char: string, elapsedTimeMs: number): { charStatus: CharStatus; stats: TypingStats } {
    if (this.isComplete()) {
      return { charStatus: 'pending', stats: this.stats };
    }

    this.stats.elapsedTime = elapsedTimeMs;

    // Handle backspace (we represent backspace as 'Backspace' or a special char if needed, 
    // but typically backspace is handled before calling processKeystroke. 
    // Wait, the prompt specifies handle backspace in the hook.
    // So this just processes normal chars.)

    const targetChar = this.targetText[this.currentPosition];
    const isCorrect = char === targetChar;

    const charStatus: CharStatus = isCorrect ? 'correct' : 'incorrect';
    this.charStatuses[this.currentPosition] = charStatus;

    if (isCorrect) {
      this.stats.correctChars++;
      this.stats.combo++;
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    } else {
      this.stats.incorrectChars++;
      this.stats.combo = 0; // reset combo
    }

    this.currentPosition++;

    this.stats.accuracy = this.calculateAccuracy(this.stats.correctChars, this.stats.correctChars + this.stats.incorrectChars);
    this.stats.wpm = this.calculateWPM(this.stats.correctChars, elapsedTimeMs);

    return { charStatus, stats: this.stats };
  }

  handleBackspace(): void {
    if (this.currentPosition > 0) {
      this.currentPosition--;
      const prevStatus = this.charStatuses[this.currentPosition];
      if (prevStatus === 'correct') {
        this.stats.correctChars--;
        // Combo is hard to accurately step back, we'll just leave it or reset it.
        // For simplicity, we just recalculate accuracy/wpm
      } else if (prevStatus === 'incorrect') {
        this.stats.incorrectChars--;
      }
      this.charStatuses[this.currentPosition] = 'pending';
      
      const totalAttempted = this.stats.correctChars + this.stats.incorrectChars;
      this.stats.accuracy = this.calculateAccuracy(this.stats.correctChars, totalAttempted);
    }
  }

  getCharStatuses(): CharStatus[] {
    return this.charStatuses;
  }

  getCurrentPosition(): number {
    return this.currentPosition;
  }

  getStats(): TypingStats {
    return this.stats;
  }

  calculateWPM(correctChars: number, elapsedTimeMs: number): number {
    if (elapsedTimeMs === 0) return 0;
    const minutes = elapsedTimeMs / 60000;
    const words = correctChars / 5;
    return Math.round(words / minutes);
  }

  calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
  }

  isComplete(): boolean {
    return this.currentPosition >= this.targetText.length;
  }

  reset(newText?: string): void {
    if (newText) {
      this.targetText = newText;
      this.stats.totalChars = newText.length;
    }
    this.charStatuses = new Array(this.targetText.length).fill('pending');
    this.currentPosition = 0;
    this.stats = {
      wpm: 0,
      accuracy: 100,
      combo: 0,
      maxCombo: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: this.targetText.length,
      elapsedTime: 0,
    };
  }
}
