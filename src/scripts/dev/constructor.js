$(document).ready(function() {

    // Массив с вопросами
    var questions = [];

    var testName;

    // Валидация numbers
    $('.question--number input[name="answer-number"]').on('input', function() {
        // Удаляем все символы, кроме цифр и точки
        $(this).val($(this).val().replace(/[^\d.]/g, ''));
    });

    // Сохранение вопроса, добавление объекта в массив
    $('.constructor__wrapper').on('click', '.constructor-card__save', function(e) {
        e.preventDefault();

        var $card = $(this).closest('.constructor-card');
        var index = $('.constructor-card').index($card) - 1;
        
        var allFieldsFilled = checkEmptyFields($card);

        if (allFieldsFilled) {
            var questionData = {};

            questionData.title = $card.find('input[name="question-text"]').val();

            questionData.type = $card.find('select[name="type"]').val();

            if (questionData.type === 'select') {
                questionData.options = [];
                $card.find('input[name^="select"]').each(function(index, element) {
                    questionData.options.push($(element).val());
                });
                questionData.correct = $card.find('input[name="answer-select"]').val();
            } 
            else if (questionData.type === 'date') {
                questionData.correct = $card.find('input[type="date"]').val();
            }
            else if (questionData.type === 'number') {
                questionData.correct = $card.find('input[name="answer-number"]').val();
            }
            else if (questionData.type === 'text') {
                questionData.correct = $card.find('input[name="answer-text"]').val();
            }

            
            if (questions[index]) {
                questions.splice(index, 1, questionData);
                console.log('Replaced at:', index);
            } else {
                questions.push(questionData);
            }
            
            submitCheck();

            console.log('Question saved:', questionData);
            console.log('All questions:', questions);
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

    // Добавление карточки
    function addCard() {
        var newCard = $('#question-template').clone().removeAttr('id').removeAttr('style');
        
        var wrapper = $('.constructor__wrapper');
        
        wrapper.append(newCard);
        
        newCard.find('input[type="text"]').val('');
        newCard.find('select').val('text');
        
        newCard.find('.question').hide();
        newCard.find('.question--text').show();
    }
    
    // Изменение типа
    $('.constructor__wrapper').on('change', '.field__select', function() {
        var selectedValue = $(this).val();
        var $card = $(this).closest('.constructor-card');
        $card.find('.question').hide();
        $card.find('.question--' + selectedValue).show();
    });

    // Добавление карточки в вид
    $('.constructor__append').on('click', function(e) {
        e.preventDefault();
        addCard();
    });

    $('input[name="test-name"]').on('input', function() {
        submitCheck();
    });

    // Удаление карточки из вида и массива
    $('.constructor__wrapper').on('click', '.constructor-card__discard', function(e) {
        e.preventDefault();
        var $card = $(this).closest('.constructor-card');
        var index = $('.constructor-card').index($card) - 1; 

        questions.splice(index, 1);

        $card.remove(); 

        submitCheck();
        console.log('Question deleted');
        console.log('All questions:', questions);
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

    $('.constructor__submit').on('click', function(e) {
        e.preventDefault();

        testName = $('input[name="test-name"]').val().trim();

        console.log('Название теста:', testName);
        console.log('Массив вопросов:', questions);
        console.log('Форматирую объект');
        
        var testData = {
            testName: testName,
            questions: questions
        };
    
        var testDataJSON = JSON.stringify(testData);
    
        console.log('JSON объект:', testDataJSON);

        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(testDataJSON, 'test.json', 'text/plain');
    });

    window.addEventListener('beforeunload',
    function (e) {

        // Check if any of the input
        // fields are filled
        if (questions !== '' && testName !== '') {

            // Cancel the event and
            // show alert that the unsaved
            // changes would be lost
            e.preventDefault();
            e.returnValue = '';
        }
    });
});