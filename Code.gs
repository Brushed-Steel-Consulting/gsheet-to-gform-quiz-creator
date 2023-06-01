function onHomePage(e) {
  return createHomePage();
}

function createHomePage(completionMessage) {
  var section = CardService.newCardSection();

  if (completionMessage) {
    section.addWidget(
      CardService.newTextParagraph()
        .setText(completionMessage)
    );

    var returnButton = CardService.newTextButton()
    .setText('Process another GSheet')
    .setOnClickAction(
      CardService.newAction()
        .setFunctionName('onHomePage')
        .setParameters({ 'completionMessage': '' })
    );
    section.addWidget(returnButton);
  } else {
    var createQuizButton = CardService.newTextButton()
      .setText('Generate Quizzes')
      .setOnClickAction(
        CardService.newAction()
          .setFunctionName('createQuizFromSheet')
      );

    var baseQuizNameInput = CardService.newTextInput()
      .setFieldName('baseQuizName')
      .setTitle('Quiz Name')
      .setValue("Quiz");

    var shortDescriptionInput = CardService.newTextInput()
      .setFieldName('shortDescription')
      .setTitle('Quiz Description');

    var questionsPerQuizInput = CardService.newTextInput()
      .setFieldName('questionsPerQuiz')
      .setTitle('Questions per Quiz')
      .setValue("5");

    var answerDelimiterInput = CardService.newTextInput()
      .setFieldName('answerDelimiter')
      .setTitle('Multiple Choice Delimiter')
      .setValue("XX");

    var shuffleQuestionsCheckbox = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .addItem("Shuffle questions", "shuffle_questions", true)
      .setFieldName("shuffleQuestions");

    var shuffleAnswersCheckbox = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .addItem("Shuffle answers per question", "shuffle_answers", true)
      .setFieldName("shuffleAnswers");

    var createQuizButton = CardService.newTextButton()
      .setText('Create Quiz')
      .setOnClickAction(
        CardService.newAction()
          .setFunctionName('createQuizFromSheet')
      );

    var section = CardService.newCardSection()
      .addWidget(baseQuizNameInput)
      .addWidget(shortDescriptionInput)
      .addWidget(questionsPerQuizInput)
      .addWidget(answerDelimiterInput)
      .addWidget(shuffleQuestionsCheckbox)
      .addWidget(shuffleAnswersCheckbox)
      .addWidget(createQuizButton);
  }

  var card = CardService.newCardBuilder()
    .addSection(section)
    .build();

  return card;
}

// Main function to create a quiz from the sheet data
function createQuizFromSheet(e) {
  var combinedHtmlContent = '<html><head></head><body><h1>Links to the ready-to-go quizzes</h1>';
  var baseQuizName = e.formInput.baseQuizName;
  var shortDescription = e.formInput.shortDescription;
  var questionsPerQuiz = parseInt(e.formInput.questionsPerQuiz);
  var answerDelimiter = e.formInput.answerDelimiter;
  var shuffleQuestions = e.formInput.shuffleQuestions == "shuffle_questions";
  var shuffleAnswers = e.formInput.shuffleAnswers == "shuffle_answers";

  var folderName = baseQuizName;
  var quizFolder = DriveApp.createFolder(folderName);

  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var questionData = data.slice(1);
  var numberOfQuizzes = Math.ceil(questionData.length / questionsPerQuiz);

  for (var quizIndex = 0; quizIndex < numberOfQuizzes; quizIndex++) {
    var quizName = baseQuizName + ' - Quiz ' + (quizIndex + 1);

    // Create a new form with the quiz name
    var newForm = FormApp.create(quizName);
    newForm.setDescription(shortDescription);
    newForm.setShuffleQuestions(shuffleQuestions);

    var newFormId = newForm.getId();

    // Set up the OAuth2 authentication
    var oauthToken = ScriptApp.getOAuthToken();

    // Set form description and configure it as a quiz
    apiUrl = 'https://forms.googleapis.com/v1/forms/' + newFormId + ':batchUpdate';
    options = {
      'method': 'post',
      'headers': {
        'Authorization': 'Bearer ' + oauthToken
      },
      'contentType': 'application/json',
      'payload': JSON.stringify({
        'requests': [
          {
            'updateSettings': {
              'settings': {
                'quizSettings': {
                  'isQuiz': true
                }
              },
              'updateMask': '*'
            }
          }
        ]
      })
    };
    UrlFetchApp.fetch(apiUrl, options);

    // Prepare items to create using the Google Forms API
    var start = quizIndex * questionsPerQuiz;
    var end = start + questionsPerQuiz;
    var quizItems = questionData.slice(start, end);

    var items = quizItems.map(function (row, index) {
      var question = row[0];
      var questionType = row[1];
      var possibleAnswers = row[2].split(answerDelimiter);
      var actualAnswer = row[3];
      var isRequired = row[4];
      var points = row[5];
      var explanationWhenRight = row[6];
      var explanationWhenWrong = row[7];
      console.info('explanationWhenRight:', explanationWhenRight);
      console.info('explanationWhenWrong:', explanationWhenWrong);

      // Use the helper functions based on the question type
      console.info('questionType:', questionType);
      if (questionType === "RADIO") {
        return createRadioItem(question, shuffleAnswers, possibleAnswers, actualAnswer, isRequired, points, index, explanationWhenRight, explanationWhenWrong);
      } else if (questionType === "CHECKBOX") {
        return createCheckboxItem(question, shuffleAnswers, possibleAnswers, actualAnswer, isRequired, points, index, answerDelimiter, explanationWhenRight, explanationWhenWrong);
      }
    });

    try {
      // Create items using the Google Forms API
      options.payload = JSON.stringify({ requests: items });
      options.muteHttpExceptions = true; // Add this line to mute exceptions
      var res = UrlFetchApp.fetch(apiUrl, options);

      if (res.getResponseCode() === 200) {
        console.log(res.getContentText());

        // Collect the published URL
        var formUrl = newForm.getPublishedUrl();

        // Shorten the URL
        var shortUrl = newForm.shortenFormUrl(formUrl);

        // Add the shortened URL to the combined HTML content
        combinedHtmlContent += '<p><a href="' + shortUrl + '">' + baseQuizName + ' - Quiz ' + (quizIndex + 1) + '</a></p>';

        try {
          var formFile = DriveApp.getFileById(newFormId);
          var parentFolder = formFile.getParents().next();
          parentFolder.removeFile(formFile);
          quizFolder.addFile(formFile);
          console.log('Form moved to the folder:', newFormId);
        } catch (error) {
          console.error('An error occurred while moving the form:', error);
          // Add retry logic here, if needed
        }
      } else {
        console.error('Error:', res.getResponseCode(), res.getContentText());
        // Handle the error based on the response code and content
      }

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle other types of errors
    }
  }

  // Save the combined HTML content to Google Drive
  combinedHtmlContent += '</body></html>';
  saveHtmlToDrive(combinedHtmlContent, quizFolder);

  // Return the completion message as navigation action
  var action = CardService.newAction()
    .setFunctionName('onHomePage')
    .setParameters({ 'completionMessage': 'Quiz generation is complete' });

  var nav = CardService.newNavigation().pushCard(createHomePage('Quiz generation is complete'));
  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();

}

// Save HTML content to Google Drive
function saveHtmlToDrive(htmlContent, folder) {
  var fileName = 'Published Quizzes.html';
  var mimeType = 'text/html';

  var file = folder.createFile(fileName, htmlContent, mimeType);

  return file.getUrl();
}

function createRadioItem(question, shuffleAnswers, possibleAnswers, actualAnswer, isRequired, points, index, explanationWhenRight, explanationWhenWrong) {
  console.info('Start: createRadioItem()');

  return {
    createItem: {
      item: {
        title: question,
        questionItem: {
          question: {
            choiceQuestion: {
              options: possibleAnswers.map(function (value) {
                return { value: value };
              }),
              shuffle: shuffleAnswers,
              type: 'RADIO'
            },
            grading: {
              correctAnswers: {
                answers: [{ value: actualAnswer }]
              },
              whenRight: {
                text: explanationWhenRight
              },
              whenWrong: {
                text: explanationWhenWrong
              },
              pointValue: points
            }
          }
        }
      },
      location: { index }
    }
  };
}

function createCheckboxItem(question, shuffleAnswers, possibleAnswers, actualAnswers, isRequired, points, index, answerDelimiter, explanationWhenRight, explanationWhenWrong) {
  console.info('Start: createCheckboxItem()');
  var actualAnswersArray = actualAnswers.split(answerDelimiter);
  return {
    createItem: {
      item: {
        title: question,
        questionItem: {
          question: {
            choiceQuestion: {
              options: possibleAnswers.map(function (value) {
                return { value: value };
              }),
              shuffle: shuffleAnswers,
              type: 'CHECKBOX'
            },
            grading: {
              correctAnswers: {
                answers: [{ value: actualAnswer }]
              },
              whenRight: {
                text: explanationWhenRight
              },
              whenWrong: {
                text: explanationWhenWrong
              },
              pointValue: points
            }
          }
        }
      },
      location: { index }
    }
  };
}
