(function ($) {
    "use strict";

    $(window).one("load", function () {
        const iduser = testUser();
        $.ajax({
            type: 'GET',
            url: '/validate',
            data: {'iduser': iduser},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {
                if (response.rows.length === 1) {
                    const {
                        idvalidate,
                        idqa,
                        title,
                        abstract,
                        questionen,
                        questionpt,
                        answerenv,
                        answerptv,
                        canuseranswer,
                        answeren,
                        answerpt
                    } = response.rows[0];
                    $("#idvalidate").empty().append(idvalidate);
                    $("#idqa").empty().append(idqa);

                    $("#answerenv").empty().append(answerenv);
                    $("#answerptv").empty().append(answerptv);
                    $("#canuseranswer").empty().append(canuseranswer);

                    $("#title").empty().append(title);
                    $("#abstract").empty().append(abstract);

                    $("#questionen").empty().append(questionen);
                    $("#questionpt").empty().append(questionpt);
                    $("#answeren").empty().append(answeren);
                    $("#answerpt").empty().append(answerpt);

                } else {
                    window.location.href = './4-validate-question-answer.html'
                }
            },
            error: function (jqXHR, xhr, textStatus, errorThrown) {
                if (textStatus !== '') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    }
                    return;
                }
                if (xhr.status === 500) {
                    //handle error
                    console.log(textStatus, errorThrown);

                } else {
                    console.log(textStatus, errorThrown);
                }
            }
        });
    });
//////////////////////////////////////////////////////////////////////////////////

    /*==================================================================
  [ Validate ]*/
    var input = $('.validate-input .input100');

    $('#btnEnviar').on("click", function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) === false) {
                showValidate(input[i]);
                check = false;
            }
        }

        if (check) {
            updateValidate()
        }
        return check;

    });

    function updateValidate() {
        const idvalidate = $("#idvalidate").text();
        const iduser = testUser();
        const idqa = $("#idqa").text();

        const answerenv = $("#answerenv").text();
        const answerptv = $("#answerptv").text();
        const canuseranswer = $("#canuseranswer").text();

        const istexttopic = $("#istexttopic").is(":checked")
        const canuseonlytextq = $("#canuseonlytextq").is(":checked")

        const makessenseq = $("#makessenseq input[type='radio']:checked").val();
        const makessensea = $("#makessensea input[type='radio']:checked").val();
        const translationquality = $("#translationquality input[type='radio']:checked").val();

        const typeq = $("#typeq option:selected").text()

        $.ajax({
            type: 'PUT',
            url: '/validate/',
            data: {
                'idvalidate': idvalidate,
                'iduser': iduser,
                'idqa': idqa,

                'answeren': answerenv,
                'answerpt': answerptv,
                'canuseranswer': canuseranswer,

                'istexttopic': istexttopic,
                'makessenseq': makessenseq,
                'makessensea': makessensea,
                'translationquality': translationquality,
                'canuseonlytextq': canuseonlytextq,
                'typeq': typeq

            },
            dataType: 'json',
            success: function (response) {
                window.location.href = './6-user.html'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }

    function testUser() {
        const localStorage = window.localStorage
        const iduser = localStorage.getItem('iduser')
        if (iduser == null || iduser.trim().length === 0) {
            window.location.href = './1-login.html'
            throw new Error('No user found');
        } else
            return iduser;
    }

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).val().trim() === '') {
            return false;
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);