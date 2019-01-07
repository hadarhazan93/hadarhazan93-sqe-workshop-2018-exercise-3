import * as esprima from 'esprima';
let Locals , codeFromUser,OpeningBracket = '[', Globals, argsInputToFunc, codeToParseFromUser;

function init(Function){
    codeToParseFromUser = Function;
}
export function returnArgs(inputs, Function){
    init(Function);
    argsInputToFunc = argsInputToFuncExtr(inputs,Function);
    Globals = GetGlobals();
    Locals = clearLocalArguments();
    return [Globals, Locals, argsInputToFunc];
}

function ToJsonVariableDeclaration(ExpVar){
    let x,init, dec =ExpVar.declarations,arr, ans, z,ToRetur = [],state, len= dec.length, loc;
    arr = ['variable declaration','','null'];
    for(x = 0; x < len; x++) {
        init = dec[x].init;
        state = {'Type': arr[0],'Condition': arr[1],'Line': dec[x].loc.start.line,'Value': arr[2],'Name': dec[x].id.name};
        loc =init.loc;
        if (init != null){
            z= splitedCodeAndStr(loc);
            state.Value = z;
            ans = [state];
        }
        else {
            ans = [state];
        }
        ans = [state];
        ToRetur = ToRetur.concat(ans);
    }
    return ToRetur;
}


function BinaryExpression(ExpBinaryExpression){
    let OP = ExpBinaryExpression.operator ,right = ExpBinaryExpression.right, left = ExpBinaryExpression.left , Arr;
    left = Ass(left);
    Arr = ['*' ,'/'];
    right = Ass(right);
    if( Arr.includes(OP)){
        left = ['('].concat(left).concat(')');
        right = ['('].concat(right).concat(')');
        return left.concat([ExpBinaryExpression.operator]).concat(right);
    }
    else
        return left.concat([ExpBinaryExpression.operator]).concat(right);
}

function ForStatement(expration){
    let inOne ,end = expration.update.loc.end, inSt, body, start = expration.loc.start , toReturn = [], colStrat = expration.init.loc.start, one = 1;
    inOne = codeFromUser.split('\n')[start.line-one];
    inSt = inOne.substring(colStrat.column, end.column);
    body = expration.body;
    toReturn.push({'Type': 'for statement','Line': expration.loc.start.line,'Condition': inSt, 'Name' : '','Value': '' });
    toReturn = toReturn.concat(getTable_codeAnalyzer(body));
    return toReturn;
}
function GetGlobalsLint(curr, dec, GlobalTill, index, expression, one) {
    let decCurr, w;
    if (curr.type === 'VariableDeclaration') {
        for (w = 0; w < dec.length; w++) {
            decCurr = dec[w];
            GlobalTill[decCurr.id.name] = Ass(decCurr);
            index = index + 1;
        }
    }
    else {
        if (expression.operator === '--')
            GlobalTill[expression.argument.name][0] -= one;
        else
            GlobalTill[expression.argument.name][0] += one;
        index = index + 1;

    }
    return [index, GlobalTill];
}

function ArrayExpression(ExpArrayExpression){
    let ass, elem = ExpArrayExpression.elements, y, arrayAns, ans = [], curr;
    for (y = 0; y < elem.length; y= y +1) {
        curr = elem[y];
        ass =Ass(curr);
        ans.push(ass[0]);
    }
    arrayAns = [ans];
    return arrayAns;
}
function GetGlobalsExtractedT(FunctionPar, j, arr, Glob) {
    let curr = FunctionPar[j];
    if (arr.includes(curr.type)) {
        Glob.push(curr);
    }
    return curr;
}

function GetGlobals() {
    let expression ,GlobalTill = {}, Glob = [],dec, FunctionPar,curr, len,index = 0,one =1, arr = ['VariableDeclaration','ExpressionStatement'], j;
    FunctionPar = esprima.parse(codeToParseFromUser), FunctionPar = FunctionPar.body, len =FunctionPar.length;
    for ( j = 0; j < len; j= j+1) {
        curr = GetGlobalsExtractedT(FunctionPar, j, arr, Glob);
    }
    len = Glob.length;
    while(index<len){
        curr =Glob[index],expression = curr.expression, dec = curr.declarations;
        let res = GetGlobalsLint(curr, dec, GlobalTill, index, expression, one);
        index = res[0];
        GlobalTill= res[1];
    }
    return GlobalTill;
}
function ArgumentsToP(Typ, Value){
    let ans ;
    if (Typ === 'bool'){ ans= (Value === 'true');}
    else if (Typ === 'string'){ans= Value; }
    else // num
        ans= Number(Value);
    return ans;
}


function returnTypeextracted(type, bool, Argument, bs, n) {
    let ans;
    if (type)
        ans = type;
    if (bool.includes(Argument))
        ans = bs;
    else
        ans = n;
    return ans;
}

function returnType(Argument){
    let ansFirst = null, type, bool = ['true', 'false'],char =Argument.charAt(0), n = 'num', ans , bs = 'bool';
    if(char === OpeningBracket)
        ansFirst = 'array';
    if(char === '"' || char === '\'')
        ansFirst = 'string';
    type= ansFirst;
    ans = returnTypeextracted(type, bool, Argument, bs, n);
    return ans;
}
function splitedCodeAndStr(line){
    let col = line.end.column, zero = 1,rows, startLoc= line.start;
    rows = codeFromUser.split('\n');
    return rows[startLoc.line-zero].substring(startLoc.column, col);
}
function argsInputToFuncExtrLint(len, inputLen, inputs, ans, Names) {
    let j, values, Typ;
    for (j = 0; j < len; j++) {
        if (inputLen !== 0) {
            values = ArgumentsToP(returnType(inputs[j]), inputs[j]);
        }
        else {
            values = 0, Typ = 'num';
        }
        ans[Names[j]] = {'type': Typ, 'value': values};
    }
}
function IfStatement(allCode){
    let line, toReturn = [], codeAnalyzer,  cons =allCode.consequent, alter = allCode.alternate;
    line = allCode.loc.start.line;
    toReturn.push({'Type': 'else if statement','Line': line, 'Condition': splitedCodeAndStr(allCode.test.loc), 'Value': '', 'Name' : ''});
    toReturn = toReturn.concat(getTable_codeAnalyzer(cons));
    if (alter === null)
        return toReturn;
    else{
        codeAnalyzer = getTable_codeAnalyzer(alter);
        return toReturn.concat(codeAnalyzer);
    }
}
function getTable_codeAnalyzer(allCode) {
    let toReturn = [];
    return toReturn.concat(MatchTypeToFunction(allCode));
}
function MemberExpression(ExpMemberExpression){
    let pro = ExpMemberExpression.property.value, name = ExpMemberExpression.object.name +OpeningBracket;
    let end = ']', y = pro +end;
    return [name+y];
}
function extractedargsInputToFuncExtr(char, valExt, EXTvalue, NU, o, length) {
    if (char === ',') {
        valExt.push(EXTvalue);
        EXTvalue = NU;
    }
    else {
        EXTvalue = EXTvalue + char;
        if (o === length - 1)
            valExt.push(EXTvalue);
    }
    return EXTvalue;
}

function clearLocalArguments(){
    let parsedCode,arr = [], argumentsLocals = {},len,  userfunc, typeStrings;
    typeStrings =['assignment expression', 'variable declaration'];
    userfunc = codeToParseFromUser;
    parsedCode = esprima.parse(userfunc, {loc: true});
    parsedCode = parsedCode.body, len = parsedCode.length;
    return localExtracted(len,parsedCode, typeStrings, arr, argumentsLocals);
}
function VariableDeclaration(ExpVariableDeclaration){
    let x = ExpVariableDeclaration.declarations[0];
    return Ass(x);
}


function argsInputToFuncExtr(Args,f){
    let Arr,w, Names,temp, char,length, NU= '', ans = {}, inputs, string = OpeningBracket, valExt = [],o, EXTvalue = '', len, inputLen, l, s=/\s+/g;
    temp = f.split('function')[1];
    Arr = temp.split('{')[0].split('(')[1]; Arr = Arr.split(')')[0].split(',');    l =Arr.length;
    for (w = 0; w < l; w++)
        Arr[w] = Arr[w].replace(s, NU);
    Names = Arr, Args = Args.replace(s, NU), length =Args.length, len  =Names.length;
    for (o = 0; o < length; o = o +1) {
        char =Args.charAt(o);
        if(char !== string){ EXTvalue = extractedargsInputToFuncExtr(char, valExt, EXTvalue, NU, o, length); }
    }
    inputs =  valExt, inputLen =inputs.length;
    argsInputToFuncExtrLint(len, inputLen, inputs, ans, Names);
    return ans;
}

function Ass(ExpAssignment){
    let type = ExpAssignment.type;
    if (type === 'ArrayExpression'){
        return ArrayExpression(ExpAssignment);
    }
    else if (type === 'UnaryExpression'){
        let a = ExpAssignment.argument;
        let op = ExpAssignment.operator, arg = Ass(a);
        return [op].concat(arg);
    }
    else if (type === 'BinaryExpression'){
        return BinaryExpression(ExpAssignment);
    }
    else if (type === 'VariableDeclaration'){
        return VariableDeclaration(ExpAssignment);
    }
    else
        return AdjustFunction2(ExpAssignment);

}
function MatchTypeToFunction2(type,allCode){
    if(type === 'AssignmentExpression'){
        return [{'Type': 'assignment expression', 'Line': allCode.left.loc.start.line,'Value': splitedCodeAndStr(allCode.right.loc), 'Name': splitedCodeAndStr(allCode.left.loc), 'Condition': ''}];
    }
    else if(type === 'BlockStatement'){
        let i, body = allCode.body,statements = [];
        for(i=0; i<body.length; i++){
            statements = statements.concat(getTable_codeAnalyzer(body[i]));
        }
        return statements;
    }
    ///UpdateExpression
    else{
        return [{ 'Type' : 'update statement','Line' : allCode.loc.start.line, 'Value' : allCode.operator ,'Condition' : '', 'Name' : allCode.argument.name }];
    }
}
function AdjustFunction2(ExpAssignment) {
    let type = ExpAssignment.type;
    if (type === 'Literal'){
        let raw = ExpAssignment.raw;
        return [raw];
    }
    else if (type === 'VariableDeclarator'){
        let init = ExpAssignment.init;
        if(init)
            return Ass(init);    }
    else if (type === 'MemberExpression'){
        return MemberExpression(ExpAssignment);
    }
    //Identifier
    else{
        let name = ExpAssignment.name;
        return [name];
    }
}


function ff(name, x) {
    if (!argsInputToFunc[name] && !Globals[name]) {
        x = true;
    }
    return x;
}

function FunctionDeclaration(expression){
    let i, param =expression.params, declaration, toReturn = [], paramCurr;
    declaration = {'Type': 'function declaration','Condition': '','Value': '' ,'Line': expression.id.loc.start.line, 'Name': expression.id.name };
    toReturn.push(declaration);
    for(i = 0; i < param.length; i++) {
        paramCurr = param[i];
        toReturn.push({'Type': 'variable declaration','Line': paramCurr.loc.start.line,'Condition': '','Value': '','Name': paramCurr.name});
    }
    return toReturn.concat(getTable_codeAnalyzer(expression.body));
}
function localExtracted(len, parsedCode, typeStrings, arr, argumentsLocals) {
    let  mapFunc,x = false, w, curr, val, name, type, currExpration, valueOfArguments;
    mapFunc = extractedLnt(len, parsedCode);
    for (w = 0; w < mapFunc.length; w++) {
        curr = mapFunc[w], val = curr.Value, name = curr.Name, type = curr.Type;
        if (typeStrings.includes(type)) {
            x = ff(name, x);
            if (x) {
                currExpration = esprima.parse('let ' + name + ' = ' + val).body[0];
                valueOfArguments = arr.concat(Ass(currExpration));
                if (!argumentsLocals[name])
                    argumentsLocals[name] = [{value: valueOfArguments, location: curr.Line}];
                else
                    argumentsLocals[name].push({value: valueOfArguments, location: curr.Line});
            }
        }
    }
    return argumentsLocals;
}


function extractedLnt(len, parsedCode) {
    let mapFunc, y;
    for (y = 0; y < len; y++) {
        if (parsedCode[y].type === 'FunctionDeclaration') {
            codeFromUser = codeToParseFromUser;
            mapFunc = getTable_codeAnalyzer(parsedCode[y]);        }
    }
    return mapFunc;
}

function MatchTypeToFunction(allCode){
    let type =allCode.type;
    if(type === 'IfStatement'){
        return IfStatement(allCode);
    }
    else if(type === 'ExpressionStatement'){
        return getTable_codeAnalyzer(allCode.expression);
    }
    else if(type === 'ReturnStatement'){
        return [{'Type': 'return statement','Condition': '','Value': splitedCodeAndStr(allCode.argument.loc),'Line': allCode.loc.start.line,'Name': ''}];
    }
    else if(type === 'ForStatement'){
        return ForStatement(allCode);
    }
    else {
        return MatchTypeToFunction1(type,allCode);
    }
}
function MatchTypeToFunction1(type,allCode){
    if(type === 'WhileStatement'){
        let ToReturn = {'Name': '', 'Value': '','Line': allCode.loc.start.line,'Condition': splitedCodeAndStr(allCode.test.loc),'Type': 'while statement' };
        return [ToReturn].concat(getTable_codeAnalyzer(allCode.body));
    }
    else if(type === 'FunctionDeclaration'){
        return FunctionDeclaration(allCode);
    }
    else if(type === 'VariableDeclaration'){
        return ToJsonVariableDeclaration(allCode);
    }
    else {
        return MatchTypeToFunction2(type,allCode);
    }
}


