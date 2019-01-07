import * as esprima from 'esprima';
import {returnArgs} from './symbolic-substitution-adjusted';

// the code!!
let flowchartCodeToReturn = '', sumOperator; // the code that i need to return // operation counter
let trueTrack, counterM; //counter to merge states in the code / / the true track that we are inside
let codeToParse;// code from user - string
let arratG ;
let localsArguments; // the local arguments from the code (from user)
let globalArguments; // the global arguments from function
let argsFromUser, countOfConditions;// arguments from user - string // amnont of conditions
let IndicesOfLocalArgs = {}, currState;
let tpyeIn;


function setArgs(argsSpited) {
    localsArguments = argsSpited[1];
    argsFromUser = argsSpited[2];
    globalArguments = argsSpited[0];
}

export function CFGstart(argsInputToFunc, codeToParseFromUser){
    codeToParse = codeToParseFromUser;
    sumOperator = 1,counterM = 1, trueTrack = false;
    tpyeIn = ['IfStatement', 'ForStatement', 'WhileStatement'];
    argsFromUser = '',countOfConditions = 1, countOfConditions = 1;
    arratG =['>', '+','!==',')', '*', '/', '(', '<', '===', '!=', '==','-'];
    globalArguments = {}, localsArguments = {};
    flowchartCodeToReturn = '', IndicesOfLocalArgs = {}, currState = 1;
    setArgs(returnArgs(argsInputToFunc, codeToParseFromUser));
    getFlowchartCode(esprima.parse(codeToParse, {loc: true}));
    return flowchartCodeToReturn;
}

function getFlowchartCode(parseCode){
    let toReturn ;
    let keyVal=0;
    for (const [key] of Object.entries(localsArguments)) {
        IndicesOfLocalArgs[key] = keyVal;
    }
    toReturn = createAndAddToFlowchartGraph(parseCode, false);
    return toReturn;
}
function createAndAddToFlowchartGraph(codeFromUserAfterParse, isInConditionBlock, reductionArgs, previousSituation){
    let type = codeFromUserAfterParse.type;
    let funcToGO = MatchTypeToFunction(type);
    return funcToGO(codeFromUserAfterParse, isInConditionBlock, reductionArgs, previousSituation);
}

// all the code from user - the main object
function Program(program, isInConditionBlock){
    let i , exp, toReturn = '', body = program.body;
    for(i = 0; i < body.length; i++) {
        exp = body[i];
        if(exp.type === 'FunctionDeclaration'){
            toReturn = toReturn + createAndAddToFlowchartGraph(exp, isInConditionBlock);
        }
    }
    return toReturn;
}
function FunctionDeclaration(code){
    let body= code.body;
    trueTrack = true;
    return createAndAddToFlowchartGraph(body);
}


function UpdateExpression(expression){
    let op = expression.operator, name = expression.argument.name;
    let toReturn = name + op + '\n';
    if(name in argsFromUser){
        if(op == '--')
            argsFromUser[name].value -= 1;
        else // ++
            argsFromUser[name].value += 1;
    }
    operatorOnGlob(op,name);
    return toReturn;
}

function operatorOnGlob(op, name) {
    let index = 0;
    if (name in globalArguments) {
        if (op === '--') {
            globalArguments[name][index] = [toString(parseInt(globalArguments[name][index]) - 1)];
        }
        // ++
        else {
            globalArguments[name][index] = [toString(parseInt(globalArguments[name][index]) + 1)];
        }
    }
}

function toString(s) {
    let toReturn = '' + s ;
    return toReturn;
}

function doParseOnCond(pCon){
    let len, i,Value, ans = [],PNane, index, lenV;
    len = pCon.length;
    for (i = 0; i < len; i++){
        index = pCon[i];
        if(index in argsFromUser){
            ans = ans.concat(argsFromUser[index].value);
        }
        else if(index in globalArguments){
            PNane = index, Value = globalArguments[PNane], lenV =Value.length;
            if (lenV <= 1){Value = Value[0];}
            else{ Value = doParseOnCond(Value);}
            ans = ans.concat(Value);
        }
        else
            ans = lint(ans, index);
    }
    return ans;
}
function VariableDeclaration(expression, isInConditionBlock, argsToReduce){
    let j, len = expression.declarations.length ,allDeclaration = '', nextDec;
    for(j = 0; j < len ; j++) {
        nextDec = nextVariableDeclaration(expression.declarations[j], isInConditionBlock, argsToReduce);
        allDeclaration = allDeclaration + nextDec + '\n';
    }
    return allDeclaration;
}

function calculationsubstring(calculation) {
    let parse, RT, s1 =/\( / , s2 ='g';
    parse =  esprima.parse(calculation);
    calculation = parse.body[0];
    calculation = compExpBinar(calculation.expression);
    calculation = replaceExpToArr(calculation);
    calculation = calculation.join(' ');
    RT = new RegExp(s1, s2);
    calculation = calculation.replace(RT, '(');
    RT = new RegExp(s1, s2);
    calculation = calculation.replace(RT, ')');
    return calculation;
}
// if we will need let a; or let x; --> only decleration. so we use ->> if(init)
function nextVariableDeclaration(variable, isInConditionBlock, argsToReduce){
    let row,init = variable.init, loc =init.loc, start= loc.start, generate, name = variable.id.name, toReturn = '';
    row = codeToParse.split('\n')[start.line-1];
    if (isInConditionBlock) {
        IndicesOfLocalArgs[name] = 0;
        argsToReduce.push(name);
    }
    generate = row.substring(start.column, loc.end.column);
    toReturn = toReturn + name + ' = ' + generate;
    return toReturn;
}

function extractedME(currentStateToGraph, previousState, Sname) {
    sumOperator = sumOperator + 1;
    concatStateToCFG('operation', currentStateToGraph, 'op' + sumOperator);
    concatEegeToCFG(previousState, 'op' + sumOperator);
    Sname = 'op' + sumOperator;

    return Sname;
}
function WhileStatement(Exp, isInBlockCondition, decrementArgs, PrevState){
    let ans,t, op ='operation',body, stateCondition = 'cond', tempBool = false,con,on,  loc = Exp.test.loc, cod= 'condition' ,Empty = 'NULL', str = CodeToStr(loc), EmptyMode= 'op';
    decrementArgs = [], t = true,body = Exp.body, ans = ValueOfObject(calculationsubstring(str)), on = '(no)', sumOperator = sumOperator +1, EmptyMode = EmptyMode + sumOperator;
    concatStateToCFG(op, Empty, EmptyMode);
    concatEegeToCFG(PrevState, EmptyMode);
    stateCondition = stateCondition + countOfConditions;
    concatStateToCFG(cod, str, stateCondition), concatEegeToCFG(EmptyMode, stateCondition);
    if (trueTrack && ans)
        tempBool = t;
    con = stateCondition + '(yes)', trueTrack = tempBool, countOfConditions= countOfConditions +1;
    concatEegeToCFG(createAndAddToFlowchartGraph(body, t, decrementArgs, con), EmptyMode);
    clearArgs();
    on = stateCondition + on;
    return on;
}

function extractedBlockStatement(types, type, Sname, op, currentStateToGraph, previousState, Code, isInConditionBlock, argsToReduce, isItTrue) {
    if (types.includes(type)) {
        Sname = 'op' + sumOperator;
        sumOperator++;
        concatStateToCFG(op, currentStateToGraph, Sname);
        concatEegeToCFG(previousState, Sname);
        Sname = createAndAddToFlowchartGraph(Code, isInConditionBlock, argsToReduce, Sname);
        trueTrack = isItTrue, currentStateToGraph = '', previousState = Sname;
    }
    if (!tpyeIn.includes(type))
        currentStateToGraph = currentStateToGraph + createAndAddToFlowchartGraph(Code, isInConditionBlock, argsToReduce, previousState);
    return [Sname, currentStateToGraph, previousState];
}

function extractedIfStatement(currentStateToGraph, Sname, previousState) {
    Sname = 'op' + sumOperator;
    sumOperator++;
    concatStateToCFG('operation', currentStateToGraph, Sname);
    concatEegeToCFG(previousState, Sname);
    previousState = Sname;
    return [Sname, previousState];
}

export function extractedif(type, isInConditionBlock, lastS) {
    let ret;
    if (type === tpyeIn[0] && isInConditionBlock) {
        ret = lastS;
    }
    return ret;
}

function extracted(type, isInConditionBlock, lastS, Sname, currentStateToGraph, previousState) {
    let ret;
    ret = extractedif(type, isInConditionBlock, lastS);
    Sname = extractedME(currentStateToGraph, previousState, Sname);
    if (isInConditionBlock)
        ret = Sname;
    return [ret, Sname];
}

function BlockStatement(expression, isInConditionBlock, argsToReduce, previousState){
    let retE, types ,Code, i,lastS , body = expression.body, op = 'operation', string ='', Sname=string, currentStateToGraph = string, isItTrue = trueTrack,type;
    types = [tpyeIn[2], tpyeIn[1]];
    for(i=0; i< body.length; i++){
        Code = body[i];
        type = Code.type;
        retE = extractedBlockStatement(types, type, Sname, op, currentStateToGraph, previousState, Code, isInConditionBlock, argsToReduce, isItTrue);
        Sname =  retE[0], currentStateToGraph = retE[1] , previousState = retE[2];
        if(type === tpyeIn[0]) {
            const __ret = extractedIfStatement(currentStateToGraph, Sname, previousState);
            Sname= __ret[0], previousState = __ret[1];
            lastS = createAndAddToFlowchartGraph(Code, isInConditionBlock, argsToReduce, previousState);
            currentStateToGraph = string, trueTrack = isItTrue, previousState = 'e' + (counterM - 1), Sname = string;
        }
    }
    const lintO = extracted(type, isInConditionBlock, lastS, Sname, currentStateToGraph, previousState);
    return lintO[0];
}
function ValueOfObject(theCon){
    let con, ans, n= ' ' ,esp = esprima.parse(theCon), j=0;
    con = doParseOnCond(compExpBinar(esp.body[j].expression));
    con = con.join(n);
    ans  = eval(con);
    return ans;

}
function extractedb(decrementArgs, alt, boolT, boolO) {
    if (!decrementArgs) {
        decrementArgs = [];
    }
    if (alt !== null){
        if (alt.type === tpyeIn[0]) {
            boolT = true;
        }
    }
    if (alt === null) {
        boolO = true;
    }
    return [decrementArgs, boolT, boolO];
}

function BinaryExpression(Exp){
    let ans, left = Exp.left,right = Exp.right, operator = Exp.operator;
    let str = ['*','/'];
    left = compExpBinar(left);
    right = compExpBinar(right);
    if(str.includes(operator)){
        left = ['('].concat(left).concat(')');
        right = ['('].concat(right).concat(')');
        ans= left.concat([operator]).concat(right);
    }
    else
        ans= left.concat([operator]).concat(right);
    return ans;
}

function extractedT(boolO, Nm, boolT, value, alt, decrementArgs, Latest, exprationIf, Name, isInBlockCondition) {
    let cou;
    if (boolO) {
        AddEdge(Nm);
    }
    else if (boolT) {
        trueTrack = !value;
        compElseIfExp(Nm, alt);
    }
    else {
        elseOrElseif(value, decrementArgs, Latest, exprationIf, Name);
    }
    if (!isInBlockCondition) {
        cou = counterM +1 ;
    }
    else
        cou = counterM;
    counterM =cou;
}


function IfStatement(exprationIf, isInBlockCondition, decrementArgs, ServicesStat){
    let e, Nm,boolT =false, Latest,alt =exprationIf.alternate, toR, retE, tempBool,end = '=>end:',boolO = boolT, test = exprationIf.test,t, theCon,sin = '------', value ,c, Name , strCoded =CodeToStr(test.loc) , strC = 'condition', n;
    Name = 'cond' + countOfConditions ,c =exprationIf.consequent, tempBool = false,t =true,n =Name + '(yes)', theCon = calculationsubstring(strCoded), value = ValueOfObject(theCon), e= 'e';
    retE = extractedb(decrementArgs, alt, boolT, boolO);
    decrementArgs = retE[0], boolT = retE[1], boolO = retE[2] ;
    countOfConditions= countOfConditions +1;
    concatStateToCFG(strC, strCoded, Name), concatEegeToCFG(ServicesStat, Name);
    flowchartCodeToReturn = e + counterM +end + ' ' + sin + '|truePath\n' + flowchartCodeToReturn;
    Nm =Name + '(no)';
    if (trueTrack && value){tempBool = t;}
    trueTrack =tempBool, Latest = createAndAddToFlowchartGraph(c , t, decrementArgs, n ), AddEdge(Latest);
    if (!isInBlockCondition){
        toR = Name + '(no)';
        clearArgs(decrementArgs);
    }
    else
        toR = Name + '(no)';
    extractedT(boolO, Nm, boolT, value, alt, decrementArgs, Latest, exprationIf, Name, isInBlockCondition);
    return toR;
}

function CodeToStr(Line){
    let  row , srt = '\n' ,colEnd =Line.end.column , rows = codeToParse.split(srt), start = Line.start;
    row= rows[start.line-1];
    return row.substring(start.column, colEnd);
}

function clearArgs(Arguments){
    let name, len, i, one =1, x, Locals;
    if(Arguments) {
        len = Arguments.length;
        for (i = 0; i < len; i++) {
            name = Arguments[i], Locals = localsArguments[name], x = IndicesOfLocalArgs[name];
            Locals.splice(x, one);
            IndicesOfLocalArgs[name] = IndicesOfLocalArgs[name] - one;
        }
    }
}

function ForStatement(expration, isInBlockCondition, decrementArgs, PrevState){
    let stateCondition ,stateConditionNo, Statement,end, line, one,stateConditionYes, oper ='op'  , start,body, ends , startc ='cond' ,nul = 'NULL' , t = true;
    ends = '\n', end = expration.update.loc.end,body = expration.body, start =expration.init.loc.start, one =1 ,line = expration.loc.start.line;
    Statement= codeToParse.split(ends)[line - one];
    Statement = Statement.substring(start.column, end.column);
    decrementArgs = [], sumOperator = sumOperator +1 ;
    concatStateToCFG('operation', nul, oper + sumOperator), concatEegeToCFG(PrevState, oper + sumOperator);
    stateCondition = startc + countOfConditions , stateConditionYes = '(yes)' , stateConditionNo = stateCondition + '(no)';
    countOfConditions++;
    concatStateToCFG(startc + 'ition', Statement, stateCondition);
    concatEegeToCFG(oper+ sumOperator, stateCondition);
    concatEegeToCFG(createAndAddToFlowchartGraph(body, t, decrementArgs, stateCondition + stateConditionYes), oper+ sumOperator);
    clearArgs();
    return stateConditionNo;
}

function AssignmentExpression(expration, isInBlockCondition, decrementArgs){
    let string ,y, r = expration.right, value, Name =expration.left,central, end = '\n';
    Name = Name.name, string= ' ',   value = replaceExpToArr(compExpBinar(r));
    central = RemoveIrrelevantFromArray(compExpBinar(r)).join(string);
    if(Name in localsArguments){
        y =localsArguments[Name];
        if(isInBlockCondition){
            IndicesOfLocalArgs[Name] = IndicesOfLocalArgs[Name] + 1;
            decrementArgs.push(Name);
            y[IndicesOfLocalArgs[Name]].value = value;
        }
        else {
            y[IndicesOfLocalArgs[Name]].value = value;
        }
        central = ' = ' + central;
    }
    else
        central = ' = ' + central;
    return Name +central + end;
}

function MatchTypeToFunction(type){
    if (type == 'Program' )
        return Program;
    else if(type == 'FunctionDeclaration')
        return FunctionDeclaration;
    else if(type == tpyeIn[2])
        return WhileStatement;
    else
        return MatchTypeToFunction2(type);
}

function MatchTypeToFunction2(type){
    if(type == tpyeIn[1])
        return ForStatement;
    else if(type == tpyeIn[0])
        return IfStatement;
    else if(type == 'AssignmentExpression')
        return AssignmentExpression;
    else if(type == 'UpdateExpression')
        return UpdateExpression;
    else
        return MatchTypeToFunction3(type);
}

function MatchTypeToFunction3(type){
    if(type == 'BlockStatement')
        return BlockStatement;
    else if(type == 'VariableDeclaration')
        return VariableDeclaration;
    else if(type == 'ReturnStatement')
        return ReturnStatement;
    else
        return ExpressionStatement;
}

function ExpressionStatement(exp, isInBlockCondition, decrementArgs, PrevState){
    let newExpration = exp.expression;
    return createAndAddToFlowchartGraph(newExpration, isInBlockCondition, decrementArgs, PrevState);
}


function concatEegeToCFG(previousState, Sname) {
    let pState;
    Sname =  '->' + Sname +'\n';
    if(previousState) {
        pState = flowchartCodeToReturn + previousState;
        flowchartCodeToReturn = pState + Sname;
    }
}

function AddEdge(StateP){
    let the, strO = '->e' , strT ='\n';
    the = StateP + strO + counterM + strT;
    flowchartCodeToReturn = flowchartCodeToReturn +  the;
}

function compElseIfExp(previousState, expration){
    let str, loc = expration.test.loc,one =1 ,Name, condition, fullNameNo ,value,t=true ,Arguments = [], fullName, con = expration.consequent, Latest;
    Name = 'cond' + countOfConditions, str = CodeToStr(loc), condition = calculationsubstring(str), value = ValueOfObject(condition);
    countOfConditions = countOfConditions + one , fullName = Name + '(yes)', fullNameNo = Name + '(no)';
    concatStateToCFG('condition', str, Name), concatEegeToCFG(previousState, Name);
    trueTrack = trueTrack && ValueOfObject(condition), Latest = createAndAddToFlowchartGraph(con, t, Arguments, fullName), AddEdge(Latest), clearArgs(Arguments);
    elseOrElseif(value, Arguments, Latest, expration, Name);
    return fullNameNo;
}

function elseOrElseif(exp, Arguments, Latest, ExpretionIf, name) {
    let t , L ,alt = ExpretionIf.alternate, nm= name + '(no)';
    Arguments = [], trueTrack = !exp, t= true;
    L = createAndAddToFlowchartGraph(alt, t, Arguments, nm), clearArgs(Arguments), AddEdge(L);
}

function ReturnStatement(expration){
    let loc =expration.argument.loc ;
    return 'return ' + CodeToStr(loc);
}

function concatStateToCFG(Stype, Sbody, Sname){
    Sname = Sname + '=>', Stype = Stype + ': (';
    let n = '\n', True= '|truePath' , state = Sname + Stype + currState;
    currState= currState +1;
    if(!trueTrack)
        flowchartCodeToReturn = state + ')\n' + Sbody + n + flowchartCodeToReturn;
    else
        flowchartCodeToReturn =  state + ')\n' + Sbody + True+ n + flowchartCodeToReturn;
}
// indexStart = 0 -- to f function
function RemoveIrrelevantFromArray(valueArray){
    let inside, i, x ,op = ['+', '-'],one =1 , len = valueArray.length,ans = [], a = ['0', 0];
    for (i = 0; i < len ; i++) {
        inside = valueArray[i];
        if( a.includes(inside)){
            if (len === one)
                ans = ans.concat(inside);
            else{
                x = f1(i, ans, op, valueArray, len, one, inside);
                ans = x[0], i = x[1];
            }
        }
        else
            ans = f(inside,ans);
    }
    return ans;
}

function f1(i, ans, op, valueArray, len, one, inside) {
    if (i === 0)
        i = i +1;
    else
        ans = ans.concat(inside);
    return [ans,i];

}
function f(inside,ans) {
    if(inside === ')'){
        ans = ans.concat([inside]);
    }
    else if(inside === '('){
        ans = ans.concat(inside);
    }
    else
        ans = ans.concat([inside]);
    return ans;
}

function MemberExp(type, ob, p, ans) {
    let x;
    if (type === 'MemberExpression') {
        if (ob.name in localsArguments) {
            x = ArrayValue(ob.name, p.value);
        }
        else {
            x = '' + ob.name + '[' + p.value + ']';
        }
        ans = ans.concat(x);
        //continue;
    }
    return ans;
}

function replaceExpToArr(Exp) {
    let i, len = Exp.length,val, p, ans = [], spe, Nexpration, type, ob;
    for (i = 0; i < len; i++){
        spe = Exp[i];
        if(spe in localsArguments){
            val = localsArguments[spe][IndicesOfLocalArgs[spe]];
            ans = ans.concat(replaceExpToArr(val.value));
            continue;
        }
        else if (!arratG.includes(spe) && spe !== '='){
            Nexpration = esprima.parse(''+spe).body[0], Nexpration = Nexpration.expression,p= Nexpration.property, ob = Nexpration.object, type =Nexpration.type;
            ans = MemberExp(type, ob, p, ans);
        }
        ans = ans.concat(spe);
    }
    return RemoveIrrelevantFromArray(ans);
}



function compExpBinar(exp){
    let type = exp.type, name = exp.name, row = exp.raw ;
    if (type === 'Identifier')
        return [name];
    else if (type === 'VariableDeclaration')
        return compExpBinar(exp.declarations[0]);
    else if (type === 'UnaryExpression'){
        let op = exp.operator, arg = compExpBinar(exp.argument);
        return [op].concat(arg);
    }
    else if (type === 'Literal')
        return row;
    else
        return compExpBinar2(exp);
}

function compExpBinar2(exp) {
    let type = exp.type;
    if (type === 'MemberExpression'){
        let n = exp.object.name, val = exp.property.value, ans = n + '[' + val +']';
        return [ans];
    }
    else { //'BinaryExpression'
        return BinaryExpression(exp);
    }

}


function lint(ans, index){
    if (!arratG.includes(index)){
        ans = ans.concat(index);
    }
    else
        ans = ans.concat(index);
    return ans;
}

function ArrayValue(nameOfValue, exVal) {
    let ans, LocnameOfValue, l,z =0;
    l =localsArguments[nameOfValue];
    LocnameOfValue = l[IndicesOfLocalArgs[nameOfValue]].value[z];
    ans = LocnameOfValue[exVal];
    return ans;
}





