import $ from 'jquery';
import {parseSymbolicSubstitution} from './Symbolic-Substitution';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let inputToFunc = {};
        $('tr.Args').each(function() {
            let argumentName = $(this).find('#Name').val(), argumentValue = $(this).find('#Value').val(), type = whatIsTheType(argumentValue);
            inputToFunc[argumentName] = [], argumentValue = argValue(argumentValue);
            inputToFunc[argumentName].push({'value': argumentValue, 'type': type, 'line': 0, 'conditions': []});
        });
        let ToParse = $('#codePlaceholder').val(), functionAfterSB = parseSymbolicSubstitution(inputToFunc, ToParse);
        $('#transformedCode').html(functionAfterSB);
    });

    $('#allArgs').click(() => {
        $('#args').append(
            '<tr class="Args"><td><label>Name: <input id="Name" type="text"></label></td>' +
            '<td><label>Value: <input id="Value" type="text"></label></td></tr>'
        );
    });
});
function argValue(argumentValue) {
    let toReturnArgValue;
    if(argumentValue.charAt(0) === '['){
        let len = argumentValue.length - 1;
        let array = argumentValue.substring(1, len).replace(/ /g,'');
        toReturnArgValue = array.split(',');
    }
    return toReturnArgValue;
}
function whatIsTheType(argumentValue) {
    if(argumentValue.charAt(0) === '[')
        return 'array';
    else if(argumentValue === 'false')
        return 'bool';
    else
        return whatIsTheType2(argumentValue);
}

function whatIsTheType2(argumentValue) {
    if (argumentValue === 'true')
        return 'bool';
    else if(argumentValue.charAt(0) === '\\"')
        return 'string';
    else if(argumentValue.charAt(0) === '\'')
        return 'string';
    else
        return 'num';
}

