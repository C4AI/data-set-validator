(function ($) {
    "use strict";
    $(document).ready(function() {
        $('.select').select2({ width: '100%' });
    });
    $(window).one("load", function () {
        const iduser = testUser();
        const email = testEmail();

        $("#iduser").empty().append(iduser);
        $("#email").empty().append(email);

        $.ajax({
            type: 'GET',
            url: '/user/review',
            data: {'iduser': iduser},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {
                const {
                    sumscore,
                } = response.rows[0];

                $("#sumscore").empty().append(sumscore);

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

        $.ajax({
            type: 'GET',
            url: '/validate/all',
            data: {'iduser': iduser},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {
                $('#idvalidate').empty();
                $.each(response.rows, function (index, element) {
                    $('#idvalidate').append($('<option/>', {
                        value: element.idvalidate,
                        text: element.answeren
                    }));
                });
                $('#idvalidate').trigger("change");
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

    $(window).ajaxComplete(function () {
        const sumscore = parseInt($("#sumscore").text());
        if (sumscore >= score) {
            $("#btnContinuar").empty().append("Finalizar tarefa");
        }
    });
/*
    $('#idvalidate').on("change", function () {
        const iduser = testUser();

        $.ajax({
            type: 'GET',
            url: '/question-answer/article',
            data: {'iduser': iduser, 'idarticle': this.value},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {

                $('#idqa').empty();
                $.each(response.rows, function (index, element) {
                    $('#idqa').append($('<option/>', {
                        value: element.idqa,
                        text: element.questionen
                    }));
                });

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

    $('#btnEdit').on("click", function () {

        const idarticle = $("#idarticle").val()
        const idqa = $("#idqa").val()

        if (idarticle != null &&
            idqa != null &&
            idarticle.length > 0 &&
            idqa.length > 0
        ) {
            window.location.href =
                "7-question-answer-edit.html?idarticle=" + idarticle + "&idqa=" + idqa;
        } else {
            window.alert("Não há perguntas para edição.")
        }
    });

    $('#btnDelete').on("click", function () {

        const title = $("#idarticle option:selected").text()
        const qa = $("#idqa option:selected").text()

        const idartitle = $("#idarticle").val()
        const idqa = $("#idqa").val()

        if (idarticle != null &&
            idqa != null &&
            idarticle.length > 0 &&
            idqa.length > 0
        ) {
            if (window.confirm(
                "Confirma a remoção da pergunta "
                + '"' + qa + '"' +
                " referente ao texto "
                + '"' + title + '"' +
                " ? Essa ação é irreversível."
            )) {
                deleteQA(idartitle, idqa);
            }
        } else {
            window.alert("Não há perguntas para exclusão.")
        }

    });

    function deleteQA(idarticle, idqa) {
        const iduser = testUser();
        $.ajax({
            type: 'DElETE',
            url: '/question-answer',
            data: {'iduser': iduser, 'idarticle': idarticle, 'idqa': idqa},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {
                window.alert("Registro removido com sucesso!")
                window.location.href = './5-user.html'
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
    }
*/
    function testUser() {
        const localStorage = window.localStorage
        const iduser = localStorage.getItem('iduser')
        if (iduser == null || iduser.trim().length === 0) {
            window.location.href = './1-login.html'
            throw new Error('No user found');
        } else
            return iduser;
    }

    function testEmail() {
        const localStorage = window.localStorage
        const email = localStorage.getItem('email')
        if (email == null || email.trim().length === 0) {
            window.location.href = './1-login.html'
            throw new Error('No user found');
        } else
            return email;
    }

})(jQuery);