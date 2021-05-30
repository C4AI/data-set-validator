(function ($) {
    "use strict";
    $(window).one("load", function () {
        const iduser = testUser();
        $.ajax({
            type: 'GET',
            url: '/question-answer/validate/',
            data: {'iduser': iduser},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {
                if (response.rows.length === 1) {
                    const {
                        idqa,
                        title,
                        abstract,
                        questionen,
                        questionpt
                    } = response.rows[0];

                    $("#idqa").empty().append(idqa);
                    $("#title").empty().append(title);
                    $("#abstract").empty().append(abstract);
                    $("#questionen").empty().append(questionen);
                    $("#questionpt").empty().append(questionpt);
                } else {
                    window.location.href = './5-validate-question-answer.html'
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
            saveValidate()
        }
        return check;

    });

    function saveValidate() {
        const iduser = testUser();
        const idqa = $("#idqa").text()
        const answeren = $("#answeren").val()
        const answerpt = $("#answerpt").val()
        const canuseranswer = !$("#canuseranswer").is(":checked")

        $.ajax({
            type: 'POST',
            url: '/validate/',
            data: {
                'iduser': iduser,
                'idqa': idqa,
                'answeren': answeren,
                'answerpt': answerpt,
                'canuseranswer': canuseranswer
            },
            dataType: 'json',
            success: function (response) {
                window.location.href = './5-validate-question-answer.html'
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

    $('#canuseranswer').on("click", function () {
        hideValidate(input);
    });


    function validate(input) {
        const preenchido = $(input).val().trim() !== ''
        const marcado =  $("#canuseranswer").is(":checked")
        return preenchido !==marcado
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