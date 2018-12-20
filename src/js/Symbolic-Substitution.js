import * as esprima from 'esprima';

let SymSubCode;
let Arguments;

const parse = (functionIn) => {
    return esprima.parseScript(functionIn, {loc: true});
};

// this function creat item whit the type that he need to handle with
function MatchTypeToFunction(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition){
    let Type = theCureentElement.type;
    if (Type === 'BlockStatement')
        return BlockStatement(SyVariables,theCureentElement, InFunc, ArrayOfCondition);
    else if (Type === 'ExpressionStatement')
        return MatchTypeToFunction(SyVariables, theCureentElement.expression, LineInCode, InFunc, ArrayOfCondition);
    else
        return MatchTypeToFunction2(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition);
}

function MatchTypeToFunction2(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition) {
    let Type = theCureentElement.type;
    if (Type === 'UnaryExpression')
        return UnaryExpression(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition);
    else if (Type === 'Identifier')
        return Identifier(SyVariables, theCureentElement, ArrayOfCondition);
    else if (Type === 'ArrayExpression'){
        let elements = [], CureentElement, element = theCureentElement.elements;
        for (CureentElement in element){
            let cure = element[CureentElement] , val = cure.value;
            elements.push(val); }
        return elements; }
    else
        return MatchTypeToFunction3(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition);
}

function MatchTypeToFunction3(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition) {
    let Type = theCureentElement.type;
    if (Type === 'VariableDeclaration')
        return VariableDeclaration(SyVariables, theCureentElement, InFunc, ArrayOfCondition);
    else if (Type === 'MemberExpression')
        return MemberExpression(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition);
    else if (Type === 'AssignmentExpression')
        return AssignmentExpression(SyVariables, theCureentElement, InFunc, ArrayOfCondition);
    //Literal
    else
        return MatchTypeToFunction4(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition);
}

function MatchTypeToFunction4(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition) {
    let Type = theCureentElement.type;
    if (Type === 'UpdateExpression')
        return MatchTypeToFunction(SyVariables, theCureentElement.argument, LineInCode, InFunc, ArrayOfCondition) + theCureentElement.operator;
    else if (Type === 'ReturnStatement')
        return ReturnStatement(SyVariables, theCureentElement, InFunc, ArrayOfCondition);
    else if (Type === 'IfStatement')
        return IfStatement(SyVariables, theCureentElement, InFunc, ArrayOfCondition, 'if');
    else
        return MatchTypeToFunction5(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition);
}

function MatchTypeToFunction5(SyVariables, theCureentElement, LineInCode, InFunc, ArrayOfCondition) {
    let Type = theCureentElement.type;
    if (Type === 'WhileStatement')
        return WhileStatement(SyVariables, theCureentElement, InFunc, ArrayOfCondition);
    else if (Type === 'BinaryExpression'){
        let Lelem = theCureentElement.left , Relem = theCureentElement.right ;
        let left = MatchTypeToFunction(SyVariables, Lelem, LineInCode, InFunc, ArrayOfCondition);
        let right = MatchTypeToFunction(SyVariables, Relem, LineInCode, InFunc, ArrayOfCondition);
        let operator = theCureentElement.operator;
        let str = left;
        str= str + ' ' + operator + ' ' + right;
        return str;
    }
    else
        return theCureentElement.raw;
}

function WhileStatement(SyVariables, element, insideFunction, ArrayOfconditions){
    let bodyElem = element.body, RowString = 'while' ,column = element.loc.start.column, LineInCode = element.loc.start.line, testElem = element.test;
    ArrayOfconditions.push(LineInCode);
    RowString = RowString + ' (' + MatchTypeToFunction(SyVariables, testElem, LineInCode, insideFunction, ArrayOfconditions) + ')';
    if(!(LineInCode in SymSubCode)) {
        SymSubCode[LineInCode] = {};
        SymSubCode[LineInCode][column] = RowString;
    }
    else
        SymSubCode[LineInCode][column] = RowString;
    MatchTypeToFunction(SyVariables, bodyElem, LineInCode, insideFunction, ArrayOfconditions);
    ArrayOfconditions.pop();
}

function FunctionDeclaration(SyVariables, theCureentElement, conditions){
    let isFunc = true, location = 0, CureentElement;
    let col = theCureentElement.loc.start.column, Body = theCureentElement.body;
    let LineOfCode = theCureentElement.loc.start.line;
    let Name = theCureentElement.id.name;
    let lineCodeOut = 'function ' + Name + '(';
    for (CureentElement in theCureentElement.params){
        location = location + 1;
        let cure = theCureentElement.params[CureentElement];
        Name = cure.name;
        Arguments.push(Name);
        if(location < theCureentElement.params.length)
            lineCodeOut = lineCodeOut + Name + ',';
        else
            lineCodeOut = lineCodeOut + Name + ')';
    }
    if (location === 0) {lineCodeOut = lineCodeOut + ')';}
    insertToSymSubCode(LineOfCode, col, lineCodeOut);
    MatchTypeToFunction(SyVariables, Body, LineOfCode, isFunc, conditions);
}

function BlockStatement(SyVariables, theCureentElement, insideFunction, conditions){
    let LineInCode = theCureentElement.loc.start.line, CureentElement;
    let endLine = theCureentElement.loc.end.line, endColumn = theCureentElement.loc.end.column;
    let startColumn =theCureentElement.loc.start.column , startString = '{', endString = '}';
    if(!(LineInCode in SymSubCode)) {
        SymSubCode[LineInCode] = {};
        SymSubCode[LineInCode][startColumn] = startString;
    }
    else
        SymSubCode[LineInCode][startColumn] = startString;
    for (CureentElement in theCureentElement.body){
        let cure = theCureentElement.body[CureentElement];
        MatchTypeToFunction(SyVariables, cure, LineInCode, insideFunction, conditions);
    }
    insertToSymSubCode(endLine, endColumn, endString);
}

function insertToSymSubCode(line, col, stringIn){
    if(!(line in SymSubCode)) {
        SymSubCode[line] = {};
        SymSubCode[line][col] = stringIn;
    }
    else
        SymSubCode[line][col] = stringIn;
}

function Identifier(SyVariables, theCureentElement, cond){
    let name = theCureentElement.name, IsIn = false;
    // check if the element (x) is in arguments, if not push it to array
    for (let i=0; i< Arguments.length ; i++){
        if (Arguments[i] === name)
            IsIn = true;
    }
    if (IsIn)
        return name;
    else {
        let value = valueOfVariable(name ,cond, SyVariables, false);
        if (isNumeric(value))
            name = value;
        else
            name = '(' + value + ')';
    }
    return name;
}

function isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
}

/*
 let count =0, valString = '';
if (Array.isArray(Val) && Val[0] === '['){
    for (let c in Val){
        if (Val[c] === '['){
            count++;
            valString = valString + Val[c];
        }
        else if (Val[c] === ']'){
            valString = valString.substr(0,count-1);
            valString = valString + Val[c];
        }
        else{
            count= count+2;
            valString = valString + Val[c] + ',';
        }
    }
    Val = valString;
}
*/
function VariableDeclaration(SyVariables, theCureentElement, insideFunction, ArrayOfConditions){
    let toReturn = '', LineInCode = theCureentElement.loc.start.line,  Elemkind = theCureentElement.kind + ' ';
    for (let CureentElement in theCureentElement.declarations){
        let cureDeclar = theCureentElement.declarations[CureentElement];
        let Val, init = cureDeclar.init, Name = cureDeclar.id.name;
        if(init != null)
            Val = MatchTypeToFunction(SyVariables, init, LineInCode, insideFunction, ArrayOfConditions);
        else
            Val = '';
        SyVariables[Name] = [];
        SyVariables[Name].push({ 'line': LineInCode, 'conditions': [...ArrayOfConditions], 'value': Val });
        if(!insideFunction){
            Arguments.push(Name);
            toReturn = toReturn + Name + '=' + Val;
            toReturn = toReturn + ';';
        }
    }
    if(!insideFunction)
        insertToSymSubCode(LineInCode, theCureentElement.loc.start.column, Elemkind + toReturn);
}

function valueOfVariable(Name, conditions, SyVariables, ifArray, place){
    let closestLine = '', variableValues='';
    if (ifArray) {
        if (SyVariables[Name][0].value !== undefined) {
            variableValues = SyVariables[Name][0].value[place];
            closestLine = String(variableValues);
        }
    }
    else
        closestLine = valueOfVariable2(Name, conditions, SyVariables);
    return closestLine;
}

function valueOfVariable2(Name, conditions, SyVariables) {
    let closestLine = '', ContainConditions = true, variable, x;
    let variableValues = SyVariables[Name];
    for (variable in variableValues) {
        let val = variableValues[variable].value, condition = variableValues[variable].conditions;
        for (x in condition) {
            if (!conditions.includes(condition[x]))
                ContainConditions = false;
        }
        if (ContainConditions)
            closestLine = val;
    }
    return closestLine;
}

function IfStatement(SyVariables, currentElem, insideFunction, ifCondition, type){
    let LineInCode = currentElem.loc.start.line, stringToReturn = type, conElement = currentElem.test, nextElem =  currentElem.consequent;
    let insideCondition = '(' +  MatchTypeToFunction(SyVariables, conElement, LineInCode, insideFunction, ifCondition) + ')';
    stringToReturn = stringToReturn + insideCondition;
    ifCondition.push(LineInCode);
    if(type !== 'if')
        insertToSymSubCode(LineInCode, currentElem.loc.start.column-4, stringToReturn);
    else
        insertToSymSubCode(LineInCode, currentElem.loc.start.column, stringToReturn);
    MatchTypeToFunction(SyVariables, nextElem, LineInCode, insideFunction, ifCondition);
    ifCondition.pop();
    IfStatement2(SyVariables, currentElem, insideFunction, ifCondition);
    return stringToReturn;
}

function IfStatement2(SyVariables, currentElem, insideFunction, ifCondition) {
    let toCha = currentElem.alternate, LineInCode = currentElem.loc.start.line, nextElem =  currentElem.consequent;
    if(toCha !== undefined && toCha !== null)
        if(toCha.type !== 'IfStatement'){
            LineInCode = nextElem.loc.end.line;
            ifCondition.push(LineInCode);
            let column = nextElem.loc.end.column + 2 , stringElse = 'else ';
            insertToSymSubCode(LineInCode, column, stringElse);
            MatchTypeToFunction(SyVariables, toCha, LineInCode, insideFunction, ifCondition);
            ifCondition.pop();
        }
        else
            IfStatement(SyVariables, toCha, insideFunction, ifCondition, 'else if');
}

function MemberExpression(SyVariables, currentElem, LineInCode, insideFunction, conditions){
    let elemToMatch = currentElem.property, Name = currentElem.object.name , value = 'hadar',ifArray =true;
    let place = MatchTypeToFunction(SyVariables, elemToMatch, LineInCode, insideFunction, conditions);
    let variable = currentElem.object.name;
    if(!Arguments.includes(variable))
        value = valueOfVariable(Name, conditions, SyVariables, ifArray, place);
    if (value !== 'hadar')
        variable = value;
    else
        variable = variable + '[' + place + ']';
    return variable;
}

function ReturnStatement(SyVariables, currentElem, insideFunction, ArrayOfConditions){
    let arg = currentElem.argument, colu = currentElem.loc.start.column, LineInCode = currentElem.loc.start.line;
    let value = 'return ' + MatchTypeToFunction(SyVariables, arg, LineInCode, insideFunction, ArrayOfConditions);
    insertToSymSubCode(LineInCode, colu,  value + ';');
}

function UnaryExpression(SyVariables, currentElem, LineInCode, insideFunction, conditions){
    let argument = MatchTypeToFunction(SyVariables, currentElem.argument, LineInCode, insideFunction, conditions);
    return currentElem.operator + argument;
}

function AssignmentExpression(SyVariables, element, insideFunction, ArrayOfconditions){
    let col = element.loc.start.column, name = element.left.name, LineInCode = element.loc.start.line, conditionString =[...ArrayOfconditions];
    let Value = MatchTypeToFunction(SyVariables, element.right, LineInCode, insideFunction, ArrayOfconditions);
    if(!(name in SyVariables))
        SyVariables[name] = [];
    SyVariables[name].push({'line': LineInCode, 'conditions': conditionString, 'value': Value});
    if(Arguments.includes(name))
        insertToSymSubCode(LineInCode, col, name + ' = ' + Value + ';');
}

function parseSymbolicSubstitution(SyVariables, functionIn){
    let AlreadyParsed = parse(functionIn);
    let cure, LineInCode = 0 , Body = AlreadyParsed.body , CurrentElement;
    Arguments =[], SymSubCode = {};
    for (CurrentElement in Body){
        cure = Body[CurrentElement];
        if(cure.type !== 'FunctionDeclaration')
            MatchTypeToFunction(SyVariables, cure, LineInCode, false, []);
        else
            FunctionDeclaration(SyVariables, cure, []);
    }
    // the parse and -take of the local variables- is end
    return PrintAfterParse(SyVariables);
}

/**
 * this function is going to paint the lines if it is needed, and to return the all code
 * @return {string}
 */
function PrintAfterParse(SyVariables){
    let x, index, TrueOrFalseLine, TheLine, ArgumentsSring = '', codeToPrint = '';
    for (index in Arguments){
        let arg = Arguments[index];
        let Val = valueOfVariable(arg, [], SyVariables, false);
        ArgumentsSring =ArgumentsSring + 'let ' + arg + ' = ' + Val + '; ';
    }
    for(x in SymSubCode){
        TrueOrFalseLine = null;
        TheLine = createRowString(SymSubCode[x]);
        if(TheLine.includes('if'))
            TrueOrFalseLine = RedOrGreen(TheLine, SyVariables);
        else
            ArgumentsSring = ArgumentsSring + TheLine;
        codeToPrint = PrintAfterParse2(TrueOrFalseLine, codeToPrint, TheLine);
    }
    return codeToPrint;
}

/**
 * @return {string}
 */
function PrintAfterParse2(TrueOrFalseLine, codeToPrint, TheLine) {
    if(TrueOrFalseLine === false)
        codeToPrint= codeToPrint + '<pre class=red>' + TheLine + '</pre>';
    else if(TrueOrFalseLine === true)
        codeToPrint= codeToPrint + '<pre class=green>' + TheLine + '</pre>';
    else
        codeToPrint= codeToPrint + '<pre>' + TheLine + '</pre>';
    return codeToPrint;
}

function RedOrGreen(TheLine, SyVariables) {
    let spitedCondition, condition = getCondition(TheLine, SyVariables), stringWhiteoutArgs = '', temp;
    spitedCondition = condition.split(' ');
    for (let c in spitedCondition){
        if (Arguments.includes(spitedCondition[c]) && spitedCondition[c] in SyVariables)
            stringWhiteoutArgs = stringWhiteoutArgs + SyVariables[spitedCondition[c]][0].value;
        else
            stringWhiteoutArgs = stringWhiteoutArgs + ' ' +spitedCondition[c];
    }
    if (stringWhiteoutArgs.includes('[')){
        temp = stringWhiteoutArgs.split(' ');
        stringWhiteoutArgs = RedOrGreen2(temp, SyVariables);
    }
    return eval(stringWhiteoutArgs);
}

/**
 * @return {string}
 */
function RedOrGreen2(temp, SyVariables) {
    let i, value, iSplit, Name, place, stringWhitoutArgsWithArray = '';
    for(i in temp){
        if ((typeof temp[i]) === 'string' && temp[i].includes('[')){
            iSplit = temp[i].split('[');
            Name =  iSplit[0];
            place = iSplit[1].split(']')[0];
            value = valueOfVariable(Name, {}, SyVariables, true, place);
            stringWhitoutArgsWithArray = stringWhitoutArgsWithArray + value;
        }
        else
            stringWhitoutArgsWithArray = stringWhitoutArgsWithArray + temp[i];
    }
    return stringWhitoutArgsWithArray;
}

function getCondition(TheLine, SyVariables){
    let i = 0, str = '';
    while (i < TheLine.length && TheLine.charAt(i) !== 'i') {
        i++;
    }
    TheLine = TheLine.substring(i);
    if (TheLine.endsWith('{'))
        str = '}';
    else
        str = '{}';
    TheLine = TheLine + str;
    let parsedLine = parse(TheLine);
    // we send the binaryexpretion to MatchTypeToFunction
    return MatchTypeToFunction(SyVariables, parsedLine.body[0].test, 0, false);
}

function createRowString(lineElements){
    let line = '';
    for(let column in lineElements){
        while(line.length < column)
            line = line + ' ';
        line = line + lineElements[column];
    }
    return line;
}

export{parseSymbolicSubstitution, valueOfVariable};
