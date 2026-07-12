export type GameMode = 'classic' | 'zen' | 'timeAttack' | 'endless' | 'quotes' | 'code';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand",
  "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government",
  "company", "number", "group", "problem", "fact", "ability", "absence", "academy", "account", "accuse",
  "achieve", "acquire", "address", "advance", "advice", "against", "airline", "airport", "alcohol", "alive",
  "already", "analyse", "ancient", "another", "anxiety", "anybody", "anyways", "apology", "apparel", "appear",
  "apple", "applied", "appoint", "approve", "archive", "arrange", "arrival", "article", "assault", "assume"
];

export const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Always forgive your enemies; nothing annoys them so much.", author: "Oscar Wilde" }
];

export const codeSnippets = [
  "function helloWorld() {\n  console.log('Hello, world!');\n}",
  "const sum = (a, b) => a + b;\nconsole.log(sum(5, 10));",
  "import React, { useState } from 'react';\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n};",
  "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)",
  "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    console.log(`${this.name} makes a noise.`);\n  }\n}",
  "list_comp = [x**2 for x in range(10) if x % 2 == 0]\nprint(list_comp)",
  "const fetchData = async (url) => {\n  try {\n    const response = await fetch(url);\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n  }\n};",
  "let observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add('visible');\n    }\n  });\n});",
  "@dataclass\nclass Point:\n    x: float\n    y: float\n\np = Point(1.5, 2.5)",
  "export const shuffleArray = (array) => {\n  for (let i = array.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [array[i], array[j]] = [array[j], array[i]];\n  }\n  return array;\n};"
];

export function getRandomWords(count: number, difficulty: Difficulty): string[] {
  let filteredWords = commonWords;
  if (difficulty === 'easy') {
    filteredWords = commonWords.filter(w => w.length <= 4);
  } else if (difficulty === 'medium') {
    filteredWords = commonWords.filter(w => w.length > 4 && w.length <= 7);
  } else if (difficulty === 'hard') {
    filteredWords = commonWords.filter(w => w.length > 7);
  }
  
  // If the filter returns too few words, fallback to all words
  if (filteredWords.length < 10) {
    filteredWords = commonWords;
  }

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    result.push(filteredWords[randomIndex]);
  }
  return result;
}

export function getRandomQuote(): { text: string; author: string } {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getRandomCodeSnippet(): string {
  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
}

export function generateText(mode: GameMode, difficulty: Difficulty): string {
  switch (mode) {
    case 'quotes':
      return getRandomQuote().text;
    case 'code':
      return getRandomCodeSnippet();
    case 'timeAttack':
    case 'endless':
    case 'classic':
    case 'zen':
    default:
      // generate a paragraph of random words
      return getRandomWords(50, difficulty).join(' ');
  }
}
