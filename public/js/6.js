(function ($) {
    "use strict";
    $(window).one("load", function () {
        const iduser = testUser();
        const idvalidate = $.getUrlVar('idvalidate');

        $.ajax({
            type: 'GET',
            url: '/validate/one',
            data: {'idvalidate': idvalidate, 'iduser': iduser},
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (response) {
                const {
                    idvalidate,
                    idqa,
                    title,
                    abstract,
                    questionen,
                    questionpt,
                    answeren,
                    answerpt,
                    questionenv,
                    questionptv,
                    cannotuserparaphase,
                    istexttopic,
                    makessenseq,
                    makessensea,
                    translationquality,
                    canuseonlytextq,
                    typeq
                } = response.rows[0];

                $("#idvalidate").empty().val(idvalidate);
                $("#idqa").empty().val(idqa);

                $("#title").empty().append(title);
                $("#abstract").empty().append(abstract);

                $("#questionen").empty().val(questionen);
                $("#questionpt").empty().val(questionpt);
                $("#answeren").empty().val(answeren);
                $("#answerpt").empty().val(answerpt);

                $("#questionenv").empty().val(questionenv);
                $("#questionptv").empty().val(questionptv);

                //check-box
                $('#cannotuserparaphase')[0].checked = cannotuserparaphase === true;

                //radio-button
                if (istexttopic)
                    $('#istexttopicSim').prop('checked', 'checked');
                else
                    $('#istexttopicSim').prop('checked', 'checked');

                //radio-button by id
                if (istexttopic)
                    $('#canuseonlytextqSim').prop('checked', 'checked');
                else
                    $('#canuseonlytextqNao').prop('checked', 'checked');

                //radio-button by value

                $("input[name=makessenseq][value=" + makessenseq + "]").prop('checked', 'checked');
                $("input[name=makessensea][value=" + makessensea + "]").prop('checked', 'checked');
                $("input[name=translationquality][value=" + translationquality + "]").prop('checked', 'checked');

                $('#typeq option').eq(typeq).prop('selected', true);

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

    ///////////////////////////////////////////////////////

    function saveValidate() {

        const idvalidate = $("idvalidate").val();
        const idqa = $("idqa").val();
        const questionen = $("questionen").val();
        const questionpt = $("questionpt").val();
        const answeren = $("answeren").val();
        const answerpt = $("answerpt").val();
        const questionenv = $("questionenv").val();
        const questionptv = $("questionptv").val();
        const answerenv = $("answerenv").val();
        const answerptv = $("answerptv").val();
        const cannotuserparaphase = $("cannotuserparaphase").val();
        const istexttopic = $("istexttopic").val();
        const makessenseq = $("makessenseq").val();
        const makessensea = $("makessensea").val();
        const translationquality = $("translationquality").val();
        const canuseonlytextq = $("canuseonlytextq").val();
        const typeq = $("typeq").val();

        $.ajax({
            type: 'PUT',
            url: '/validate/',
            data: {
                'idvalidate': idvalidate,
                'idqa': idqa,
                'questionenv': questionen,
                'questionptv': questionpt,
                'answerenv': answeren,
                'answerptv': answerpt,
                'cannotuserparaphase': cannotuserparaphase,
                'istexttopic': istexttopic,
                'makessenseq': makessenseq,
                'makessensea': makessensea,
                'translationquality': translationquality,
                'canuseonlytextq': canuseonlytextq,
                'typeq': typeq,
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
        } else {
            window.alert("Existem erros de preenchimento, por favor verifique os campos.")
        }
        return check;
    });

    const input = $('.validate-input .input100');

    $('#cannotuserparaphase').on("click", function () {
        hideValidate(input);
    });

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

        const preenchido = $(input).val().trim() !== ''
        const marcado = $("#cannotuserparaphase").is(":checked")

        if (!(preenchido !== marcado))
            check = false;

        if (!check) {
            window.alert("Existem erros de preenchimento, por favor verifique os campos.")
        }
        return check;
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }

    $.extend({
        getUrlVars: function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar: function (name) {
            return $.getUrlVars()[name];
        }
    });

})(jQuery);