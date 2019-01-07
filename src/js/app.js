import $ from 'jquery';
import * as flowchart from 'flowchart.js';
import * as CFG from './Creat-CFG';

let set ={
    'line-color': 'black', 'element-color': 'black','font-size': 15, 'font-color': 'black',
    'x': 99, 'y': 0, 'yes-text': 'T', 'no-text': 'F',
    'line-width': 3, 'line-length': 60,'text-margin': 12, 'fill': '',
    'arrow-end': 'block', 'scale': 1,
    'symbols': { 'start': { 'font-color': 'black', 'element-color': 'green', 'fill': 'white', 'font-size': '18' },
        'end': { 'class': 'end-element', 'fill': '#A8D18D', 'font-size': '18', 'font-color': '#A8D18D'} },
    'flowstate': { 'truePath': {'fill': '#A8D18D', 'font-size': 15} }
};

$(document).ready(function () {
    $('#parse').click(() => {
        $('#cfg').text('');
        var argsInputToFunc, codeToCFG, codeToParse;
        argsInputToFunc = $('#args').val(), codeToParse = $('#codePlaceholder').val();
        codeToCFG = CFG.CFGstart(argsInputToFunc, codeToParse);
        flowchart.parse(codeToCFG).drawSVG('cfg', set);
    });
});

