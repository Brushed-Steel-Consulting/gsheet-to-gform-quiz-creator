# GSheet to GForm Quiz Creator
This project does only one thing: it takes a Google Sheet with questions in the format:
- Question
- Question type
- Answers
- Answer
- Required
- Points

And turns the content below that header into multiple Google Forms configured as quizzes.

The Forms are saved on the users GDrive in a folder named after the quiz. A single HTML file is also created that lists the URL to the actual functional submittable quizzes.

I can't get the icon to appear as I don't have a public place where I can put it. Sigh.

GPT-4's take on the documentation:
# Google Workspace Add-on: GSheet to GForm Quiz Generator

## Introduction
The GSheet to GForm Quiz Generator add-on is designed to help you easily create quizzes from a Google Sheet. Once installed, you can configure various settings for your quizzes, including the quiz name, description, number of questions per quiz, and shuffling of questions and answers.

## How to Use the Add-on

### 1. Install the add-on
Install the GSheet to GForm Quiz Generator add-on from the Google Workspace Marketplace.

### 2. Open the add-on in Google Sheets
Open the Google Sheet containing your quiz questions, and then click on the "Add-ons" icon in the right sidebar. Select "GSheet to GForm Quiz Generator" to open the add-on.

### 3. Configure quiz settings
Once the add-on is open, you will see a form with the following fields:

- **Quiz Name**: Enter a name for your quiz. This will be used as the base name for all generated quizzes.
- **Quiz Description**: Provide a short description of your quiz. This description will be visible to quiz takers.
- **Questions per Quiz**: Specify the number of questions you want in each quiz. The add-on will create multiple quizzes if necessary to accommodate all questions in the Google Sheet.
- **Shuffle questions**: Check this box to shuffle the order of questions in each quiz. This is enabled by default.
- **Shuffle answers per question**: Check this box to shuffle the order of answers for each question. This is enabled by default.

### 4. Press the "Create Quiz" button
After you have entered the required information and configured the settings, click the "Create Quiz" button to generate your quizzes.

### 5. Wait for quiz generation to complete
The add-on will now create quizzes based on your Google Sheet data, applying the settings you specified. This process may take a few moments, depending on the size of your sheet and the number of quizzes being generated.

### 6. Access the generated quizzes
Once the quiz generation is complete, you will see a message that says "Quiz generation is complete." The add-on will create a folder with the same name as your quiz in your Google Drive. Inside this folder, you will find the generated quizzes as Google Forms and an HTML file named "Published Quizzes.html." Open the HTML file to access the published URLs of your quizzes.

You can now share these URLs with your audience, or use them to embed the quizzes on a website or other platform.

### 7. Process another Google Sheet (optional)
If you wish to create quizzes from another Google Sheet, click the "Process another GSheet" button. This will return you to the initial form where you can enter new quiz settings and generate quizzes based on the data in the new sheet.

In this sample input file, the header consists of 6 columns:

- **Question**: The question text.
- **Type**: The question type, such as Multiple Choice (MC).
- **Possible Answers**: The possible answer choices, separated by a vertical bar (|).
- **Correct Answer**: The correct answer(s) for the question.
- **Required**: Whether the question is required or not (TRUE or FALSE).
- **Points**: The point value of the question.

| Question                          | Type | Possible Answers     | Correct Answer | Required | Points |
| --------------------------------- | ---- | -------------------- | -------------- | -------- | ------ |
| What is the capital of France?    | MC   | Paris\|London\|Rome  | Paris          | TRUE     | 1      |
| What colors is red?               | MC   | Red\|Blue\|Green     | Red            | TRUE     | 1      |
| What is 2 + 2?                    | MC   | 1\|2\|3\|4           | 4              | TRUE     | 1      |

