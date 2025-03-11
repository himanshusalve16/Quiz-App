# Dynamic Quiz Application

A responsive web-based quiz application with multiple-choice questions and a time-based reward system.

## Features

- Interactive quiz with multiple-choice questions
- Time-based scoring system (answer quickly for more points)
- Visual timer with color changes as time runs out
- Immediate feedback on correct/incorrect answers
- Final score summary with performance evaluation
- Responsive design that works on desktop and mobile devices

## How It Works

1. Start the quiz by clicking the "Start Quiz" button
2. Answer each question by clicking on one of the options
3. Each question has a 10-second timer
4. Correct answers earn:
   - 10 base points
   - Up to 10 bonus points based on how quickly you answer
5. After completing all questions, you'll see your final score with:
   - Base score from correct answers
   - Time bonus points
   - Total score
   - Performance evaluation message

## Time-Based Reward System

The quiz implements a time-based scoring system:
- Each question has a 10-second timer
- The faster you answer correctly, the more bonus points you earn
- Maximum time bonus is 10 points (when answering immediately)
- Minimum time bonus is 1 point (when answering just before time runs out)
- No time bonus if you answer incorrectly or time runs out

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS, no frameworks)

## How to Run

Simply open the `index.html` file in any modern web browser.

## Customization

You can easily customize the quiz by modifying the `questions` array in the `script.js` file. Each question object should have:
- `question`: The question text
- `options`: An array of possible answers
- `correctAnswer`: The index of the correct answer in the options array (0-based)

## License

This project is open source and available for personal and educational use. 