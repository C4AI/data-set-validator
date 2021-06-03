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
                if (response.rows.length === 1 ) {
                    const {
                        idvalidate,
                        idqa,

                        title,
                        abstract,
                        questionen,
                        questionpt,

                        answerenv,
                        answerptv,
                        cannotuseranswer,

                        actualstep,

                        istexttopic,
                        makessenseq,
                        makessensea,
                        translationquality,
                        canuseonlytextq,
                        typeq

                    } = response.rows[0];

                    switch (actualstep + 1) {
                        case 3:
                            $("#idvalidate").empty().append(idvalidate);
                            $("#idqa").empty().append(idqa);

                            $("#title").empty().append(title);
                            $("#abstract").empty().append(abstract);
                            $("#questionen").empty().append(questionen);
                            $("#questionpt").empty().append(questionpt);

                            $("#answerenv").empty().append(answerenv);
                            $("#answerptv").empty().append(answerptv);
                            $("#cannotuseranswer").empty().append(cannotuseranswer);

                            $("#istexttopic").empty().append(istexttopic);
                            $("#makessenseq").empty().append(makessenseq);
                            $("#makessensea").empty().append(makessensea);
                            $("#translationquality").empty().append(translationquality);
                            $("#canuseonlytextq").empty().append(canuseonlytextq);
                            $("#typeq").empty().append(typeq);

                            break;
                        case 2:
                            window.location.href = './4.2-validate-answer.html'
                            break;
                        default:
                            window.location.href = './4.1-validate-answer.html'
                    }

                } else {
                    window.location.href = './4.1-validate-answer.html'
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
        const cannotuseranswer = Boolean($("#cannotuseranswer").text());

        const istexttopic = Boolean($("#istexttopic").text());
        const makessenseq = $("#makessenseq").text();
        const makessensea = $("#makessensea").text();
        const translationquality = $("#translationquality").text();
        const canuseonlytextq =Boolean( $("#canuseonlytextq").text());
        const typeq = $("#typeq").text();

        /*validando*/

        const questionenv = $("#questionenv").val();
        const questionptv = $("#questionptv").val();
        const cannotuserparaphase = Boolean($("#cannotuserparaphase").text());

        $.ajax({
            type: 'PUT',
            url: '/validate/',
            data: {
                'idvalidate': idvalidate,
                'iduser': iduser,
                'idqa': idqa,

                'answeren': answerenv,
                'answerpt': answerptv,
                'cannotuseranswer': cannotuseranswer,

                'questionen': questionenv,
                'questionpt': questionptv,
                'cannotuserparaphase': cannotuserparaphase,

                'istexttopic' : istexttopic,
                'makessenseq' : makessenseq,
                'makessensea' : makessensea,
                'translationquality' : translationquality,
                'canuseonlytextq' : canuseonlytextq,
                'typeq' : typeq,

                'iscomplete': true,
                'actualstep': 3
            },
            dataType: 'json',
            success: function (response) {
                window.location.href = './5-user.html'
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

    $('#cannotuseranswer').on("click", function () {
        hideValidate(input);
    });

    function validate(input) {
        const preenchido = $(input).val().trim() !== ''
        const marcado = $("#cannotuserparaphase").is(":checked")
        return preenchido !== marcado
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