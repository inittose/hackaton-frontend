$(document).ready(function() {

    var answers = [];

    var userName;

    //Сохранение ответа, добавление в массив
    // Сохранение ответа, добавление в массив
    $('.test__wrapper').on('click', '.constructor-card__save', function(e) {
        e.preventDefault();

        var $card = $(this).closest('.constructor-card');
        var index = $('.constructor-card').index($card) - 1;
        
        var allFieldsFilled = checkEmptyFields($card);

        if (allFieldsFilled) {
            var answerData = {};

            answerData.title = $card.find('input[name="question-text"]').val();
            
            // Добавление ответа в зависимости от типа вопроса
            var $input = $card.find('input:visible');
            var answer = $input.val(); // Получение ответа из поля
            answerData.answer = answer;

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
        var questions = data.questions;
        questions.forEach(function(question, index) {
            var $questionCard = $("#question-template").clone().removeAttr("id").removeAttr("style");
            $questionCard.find(".constructor-card__number").text("Вопрос " + (index + 1) + ":");
            $questionCard.find(".constructor-card__field-text[name='question-text']").val(question.title);
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

    function checkTestName() {
        var testNameInput = $('input[name="test-name"]');
        return testNameInput.val().trim() !== '';
    }

    // Обработчик кнопки Подтвердить
    function submitCheck() {
        var isTestNameFilled = checkTestName();

        var emptyFields = $('.constructor-card:visible input:visible').filter(function() {
            return $(this).val().trim() === '';
        });

        if (emptyFields.length === 0 && isTestNameFilled && questions.length > 0) {
            $('.constructor__submit').show();
        } else {
            $('.constructor__submit').hide();
        }
    }
});