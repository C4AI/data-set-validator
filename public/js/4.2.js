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
                        cannotuseranswer,
                        questionenv,
                        questionptv,
                        cannotuserparaphase,
                        answeren,
                        answerpt,

                        actualstep
                    } = response.rows[0];

                    switch (actualstep + 1) {
                        case 3:
                            window.location.href = './4.3-validate-question.html'
                            break;
                        case 2:
                            $("#idvalidate").empty().append(idvalidate);
                            $("#idqa").empty().append(idqa);

                            $("#answerenv").empty().append(answerenv);
                            $("#answerptv").empty().append(answerptv);
                            $("#cannotuseranswer").empty().append(cannotuseranswer);

                            $("#questionenv").empty().append(questionenv);
                            $("#questionptv").empty().append(questionptv);
                            $("#cannotuserparaphase").empty().append(cannotuserparaphase);

                            $("#title").empty().append(title);
                            $("#abstract").empty().append(abstract);

                            $("#questionen").empty().append(questionen);
                            $("#questionpt").empty().append(questionpt);
                            $("#answeren").empty().append(answeren);
                            $("#answerpt").empty().append(answerpt);
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


    $('#btnEnviar').on("click", function () {
        if (validate())
            updateValidate()
    });

    function validate() {

        var check = true;

        $("input:radio").each(function () {
            var name = $(this).attr("name");
            if ($("input:radio[name=" + name + "]:checked").length === 0) {
                check = false;
            }
        });
        $("option:selected:disabled").each(function () {
            check = false;
        });

        if (!check) {
            alert('Por favor, você somente poderá enviar suas respostas depois de responder todas as perguntas desta tela.');
        }
        return check;
    }

    function updateValidate() {
        const idvalidate = $("#idvalidate").text();
        const iduser = testUser();
        const idqa = $("#idqa").text();

        const answerenv = $("#answerenv").text();
        const answerptv = $("#answerptv").text();
        const cannotuseranswer = Boolean($("#cannotuseranswer").text());

        const questionenv = $("#questionenv").text();
        const questionptv = $("#questionptv").text();
        const cannotuserparaphase = Boolean($("#cannotuserparaphase").text());

        /*validando*/

        const istexttopic = $("#istexttopic input[type='radio']:checked").val();
        const canuseonlytextq = $("#canuseonlytextq input[type='radio']:checked").val();
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
                'cannotuseranswer': cannotuseranswer,

                'questionen': questionenv,
                'questionpt': questionptv,
                'cannotuserparaphase': cannotuserparaphase,

                'istexttopic': istexttopic,
                'makessenseq': makessenseq,
                'makessensea': makessensea,
                'translationquality': translationquality,
                'canuseonlytextq': canuseonlytextq,
                'typeq': typeq,

                'iscomplete': false,
                'actualstep': 2

            },
            dataType: 'json',
            success: function (response) {
                window.location.href = './4.3-validate-question.html'
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

})(jQuery);