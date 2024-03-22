$(document).ready(function() {

    var answers = [];
    var questions = [];

    var userName;

    // Сохранение ответа, добавление в массив
    $('.test__wrapper').on('click', '.constructor-card__save', function(e) {
        e.preventDefault();

        var $card = $(this).closest('.constructor-card');
        var index = $('.constructor-card').index($card) - 1;
        
        var allFieldsFilled = checkEmptyFields($card);

        if (allFieldsFilled) {
            var answerData = {};

            answerData.questionText = $card.find('input[name="question-text"]').val(); // Текст вопроса
            
            var questionType = $card.find('select[name="type"]').val();
            answerData.questionType = questionType;

            switch(questionType) {
                case 'text':
                    answerData.answer = $card.find('input[name="answer-text"]').val();
                    break;
                case 'number':
                    answerData.answer = $card.find('input[name="answer-number"]').val();
                    break;
                case 'select':
                    answerData.answer = $card.find('select[name="answer-select"]').val();
                    break;
                case 'date':
                    answerData.answer = $card.find('input[name="answer-date"]').val();
                    break;
            }

            var questionIndex = index; // Индекс вопроса соответствует индексу ответа в массиве
            var question = questions[questionIndex]; // Получаем информацию о вопросе из списка вопросов
            console.log(question);
            if (question) {
                answerData.correct = question.correct; // Добавляем информацию о правильном ответе
                console.log('exec2');
            }

            // Добавление ответа в массив
            if (answers[index]) {
                answers.splice(index, 1, answerData);
                console.log('Replaced at:', index);
            } else {
                answers.push(answerData);
            }
            
            submitCheck();

            console.log('Answer saved:', answerData);
            console.log('All answers:', answers);
        } else {
            alert('Заполните все поля перед сохранением.');
        }
    });

    function checkEmptyFields($card) {
        var emptyFields = $card.find('input:visible').filter(function() {
            return $(this).val().trim() === '';
        });
        return emptyFields.length === 0;
    }

    // Загрузка JSON-файла
    $.getJSON("json/test.json", function(data) {
        // Обработка данных
        $(".test__test-name-field input").val(data.testName);
        questions = data.questions;
        questions.forEach(function(question, index) {
            var $questionCard = $("#question-template").clone().removeAttr("id").removeAttr("style");
            $questionCard.find(".constructor-card__number").text("Вопрос " + (index + 1) + ":");
            $questionCard.find(".constructor-card__field-text[name='question-text']").val(question.title);
            $questionCard.find("select[name='type']").val(question.type);
            if (question.type === "text") {
                $questionCard.find(".question--text").show();
            } else if (question.type === "number") {
                $questionCard.find(".question--number").show();
            } else if (question.type === "select") {
                $questionCard.find(".question--select").show();
                var $select = $questionCard.find(".question--select select");
                question.options.forEach(function(option) {
                    $select.append($("<option>", { value: option, text: option }));
                });
            } else if (question.type === "date") {
                $questionCard.find(".question--date").show();
            }
            $(".test__wrapper").append($questionCard);
        });
    });

    function checkUserName() {
        var userNameInput = $('input[name="user-name"]');
        return userNameInput.val().trim() !== '';
    }

    $('input[name="user-name"]').on('input', function() {
        submitCheck();
    });

    // Обработчик кнопки Подтвердить
    function submitCheck() {
        var isUserNameFilled = checkUserName();

        var emptyFields = $('.constructor-card:visible input:visible').filter(function() {
            return $(this).val().trim() === '';
        });

        if (emptyFields.length === 0 && isUserNameFilled && answers.length > 0) {
            $('.constructor__submit').show();
        } else {
            $('.constructor__submit').hide();
        }
    }

    $('.constructor__submit').on('click', function(e) {
        e.preventDefault();

        testName = $('input[name="test-name"]').val().trim();
        userName = $('input[name="user-name"]').val().trim();

        console.log('Название теста:', testName);
        console.log('Имя пользователя:', userName);
        console.log('Массив ответов:', answers);
        console.log('Форматирую объект');
        
        var answerData = {
            testName: testName,
            userName: userName,
            answers: answers
        };
    
        var answerDataJSON = JSON.stringify(answerData);
    
        console.log('JSON объект:', answerDataJSON);

        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(answerDataJSON, 'answers.json', 'text/plain');
    });

    window.addEventListener('beforeunload',
    function (e) {

        // Check if any of the input
        // fields are filled
        if (answers !== '' && userName !== '') {

            // Cancel the event and
            // show alert that the unsaved
            // changes would be lost
            e.preventDefault();
            e.returnValue = '';
        }
    });
});