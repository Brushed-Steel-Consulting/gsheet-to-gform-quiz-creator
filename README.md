# GSheet to GForm Quiz Creator
This project does only one thing: it takes a Google Sheet with questions in the format:
- Question
- Question type
- Answers
- Answer
- Required
- Points
- Right/Wrong Answer Feedback

And turns the content below that header into multiple Google Forms configured as quizzes.

The Forms are saved on the users GDrive in a folder named after the quiz. A single HTML file is also created that lists the URL to the actual functional submittable quizzes.

GPT-4's take on the documentation:
# Google Apps Script Quiz Generator

The Google Apps Script Quiz Generator is a tool that creates quizzes from Google Sheets data and configures them using the Google Forms API.

## Description

The Quiz Generator is composed of a few different Google Apps Script (GAS) functions:

- `onHomePage(e)`: This function is used to generate the home page card. This function receives an event object `e` as a parameter, which it passes to the `createHomePage` function.

- `createHomePage(completionMessage)`: This function builds the main page of the app. It takes an optional parameter `completionMessage` that, if present, adds a completion message and a "Process another GSheet" button to the returned card.

- `createQuizFromSheet(e)`: This is the main function of the app. It takes an event object `e` as a parameter. This function uses the form input data contained in `e` to generate quizzes based on the data in the current active Google Sheet. It creates a new Google Form for each quiz, configures each form to be a quiz, creates questions based on the sheet data, and adds the questions to the form. It also moves the created forms into a new folder in Google Drive.

- `saveHtmlToDrive(htmlContent, folder)`: This function saves the given HTML content as a new file in the given Google Drive folder. It's used to save a list of links to the created quizzes.

- `createRadioItem(question, shuffleAnswers, possibleAnswers, actualAnswer, isRequired, points, index, explanation)`: This helper function creates an object representing a multiple-choice question that can be added to a Google Form.

- `createCheckboxItem(question, shuffleAnswers, possibleAnswers, actualAnswers, isRequired, points, index, answerDelimiter, explanation)`: This helper function creates an object representing a checkbox question that can be added to a Google Form.

## Usage

To use this script, you need to attach it to a Google Sheet containing quiz questions. The Google Sheet should have the following structure:

- Question Text
- Question Type ("RADIO" for multiple choice, "CHECKBOX" for checkbox)
- Possible Answers (separated by a delimiter)
- Actual Answer(s)
- Whether the question is required (True/False)
- The number of points the question is worth
- Explanation text for the question

Each quiz question should be represented by a separate row in the sheet.

The form inputs in `createQuizFromSheet(e)` are:

- baseQuizName: The base name for the quizzes.
- shortDescription: A short description of the quizzes.
- questionsPerQuiz: The number of questions per quiz.
- answerDelimiter: The delimiter used to separate possible answers in the Google Sheet.
- shuffleQuestions: A boolean indicating whether to shuffle the order of the questions in the quiz.
- shuffleAnswers: A boolean indicating whether to shuffle the order of the answers for each question.

## Limitations

- The Google Forms API used in this script is limited to Google Workspace accounts. If you are using a personal Google account, you will need to find an alternative method to add questions to the form.
- Error handling in the script is fairly basic. If an error occurs while creating a form or adding a question to a form, you will need to manually check the Google Apps Script logs to find the cause of the error.
- The script does not currently support question types other than multiple-choice and checkbox. To add support for other question types, you will need to create additional helper functions similar to `createRadioItem` and `createCheckboxItem`.

# Input File Format

The script is designed to work with Google Sheets, where each row represents a different quiz question and its relevant information. The column structure of the sheet should be as follows:

1. **Question Text**: The text of the question to be asked.
2. **Question Type**: The type of the question. It supports "RADIO" for single answer (multiple choice) and "CHECKBOX" for multiple answers.
3. **Possible Answers**: The possible answers for the question. Multiple answers should be separated by a predefined delimiter (for example, "XX").
4. **Actual Answer(s)**: The correct answer(s) for the question. In the case of multiple answers, these should be separated by the same delimiter as the possible answers.
5. **IsRequired**: Indicates whether the question is mandatory. This should be either "True" or "False".
6. **Points**: The number of points the question is worth in the quiz.
7. **Explanation**: The explanation or feedback provided upon answering the question.

## Example

Here's an example of what your Google Sheet might look like:

| Question Text        | Question Type | Possible Answers         | Actual Answer | IsRequired | Points | Explanation                    |
|----------------------|---------------|--------------------------|---------------|------------|--------|--------------------------------|
| What's 2+2?         | RADIO         | 3XX4XX5XX6               | 4             | True       | 1      | The sum of 2 and 2 is 4.       |
| Select prime numbers | CHECKBOX      | 2XX3XX4XX5XX6XX7XX8XX9XX10 | 2XX3XX5XX7    | True       | 2      | 2, 3, 5, and 7 are prime numbers. |

In this example, "XX" is used as the delimiter to separate possible answers and actual answers for checkbox questions. Please adjust the delimiter according to your needs.

It is important to ensure that the input file adheres to this structure to make sure the script functions as expected.
