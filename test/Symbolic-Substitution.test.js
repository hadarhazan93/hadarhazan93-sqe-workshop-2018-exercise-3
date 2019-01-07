import * as assert from 'assert';
import * as CFG from '../src/js/Creat-CFG';
/*
it('input one int', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('')
    );
});
*/

it('global whit len > 1', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','let w=2 +1;\n' +        'function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = 0;\n' +
        '    if (w < z) {\n' +        '        c = c + 5;\n' +        '    } else if ( w< z * 2) {\n' +
        '        c = c + x + 5;\n' +        '    } else {\n' +        '        c = c + z + 5;\n' +
        '    }\n' +        '    \n' +        '    return c;\n' +        '}\n');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op6=>operation: (7)\n' +            'return c|truePath\n' +            'op5=>operation: (6)\n' +
            'c = c + z + 5\n' +            '|truePath\n' +            'op4=>operation: (5)\n' +
            'c = c + x + 5\n' +            '\n' +            'cond2=>condition: (4)\n' +
            'w< z * 2|truePath\n' +            'op3=>operation: (3)\n' +            'c = c + 5\n' +
            '\n' +            'e1=>end: ------|truePath\n' +            'cond1=>condition: (2)\n' +
            'w < z|truePath\n' +            'op1=>operation: (1)\n' +            'a = x + 1\n' +
            'b = a + y\n' +            'c = 0\n' +            '|truePath\n' +            'op1->cond1\n' +            'cond1(yes)->op3\n' +            'op3->e1\n' +
            'cond1(no)->cond2\n' +            'cond2(yes)->op4\n' +            'op4->e1\n' +
            'cond2(no)->op5\n' +            'op5->e1\n' +            'e1->op6\n')    );
});
it('global array', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','let w = [1,2];\n' +        'function foo(){\n' +
        '    let a = [1,2];\n' +        '    let b = 7;\n' +        '    for( b=0 ; b < 2 ; b++){\n' +
        '    b=w[0];    \n' +        '    }\n' +        '    return 1;\n' +
        '}\n');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +            'op4=>operation: (4)\n' +
            'b = w[0]\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'b=0 ; b < 2 ; b++|truePath\n' +            'op3=>operation: (2)\n' +
            'NULL|truePath\n' +            'op1=>operation: (1)\n' +
            'a = [1,2]\n' +            'b = 7\n' +            '|truePath\n' +
            'op1->op3\n' +            'op3->cond1\n' +            'cond1(yes)->op4\n' +            'op4->op4\n' +
            'cond1(no)->op5\n')    );
});
it('decleration of an array and use it', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '    let a = [1,2];\n' +
        '    let b = 7;\n' +        '    for( b=0 ; b < 2 ; b++){\n' +        '    b=a[0];    \n' +
        '    }\n' +        '    return 1;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +            'op4=>operation: (4)\n' +
            'b = a[0]\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'b=0 ; b < 2 ; b++|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = [1,2]\n' +            'b = 7\n' +
            '|truePath\n' +            'op1->op3\n' +            'op3->cond1\n' +
            'cond1(yes)->op4\n' +            'op4->op4\n' +            'cond1(no)->op5\n')
    );
});
it('assinment from local array', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +
        '    let b = 1;\n' +        '    let c = [1,2];\n' +
        '    let a = c[0];\n' +        '    if (b< 1) {\n' +        '       b=2;\n' +
        '    }     \n' +        '    return c;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op4=>operation: (4)\n' +            'return c|truePath\n' +            'op3=>operation: (3)\n' +            'b = 2\n' +
            '\n' +            'e1=>end: ------|truePath\n' +            'cond1=>condition: (2)\n' +            'b< 1|truePath\n' +
            'op1=>operation: (1)\n' +            'b = 1\n' +            'c = [1,2]\n' +
            'a = c[0]\n' +            '|truePath\n' +            'op1->cond1\n' +
            'cond1(yes)->op3\n' +            'op3->e1\n' +            'cond1(no)->e1\n' +            'e1->op4\n')
    );
});
it('for', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '    let a = 7;\n' +        '    let b = 7;\n' +
        '    for( a=0 ; a < 2 ; a++){\n' +        '    b=1;    \n' +        '    }\n' +        '    return 1;\n' +
        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +
            'op4=>operation: (4)\n' +            'b = 1\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'a=0 ; a < 2 ; a++|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 7\n' +            'b = 7\n' +
            '|truePath\n' +            'op1->op3\n' +            'op3->cond1\n' +
            'cond1(yes)->op4\n' +            'op4->op4\n' +            'cond1(no)->op5\n')
    );
});

it('false if', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '    let a = 7;\n' +        '    let b = 7;\n' +
        '    if (a < 1) {\n' +        '        a=7;\n' +        '        b=7;\n' +
        '    }   \n' +        '    return 1;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op4=>operation: (4)\n' +            'return 1|truePath\n' +            'op3=>operation: (3)\n' +            'a = 7\n' +
            'b = 7\n' +            '\n' +            'e1=>end: ------|truePath\n' +
            'cond1=>condition: (2)\n' +            'a < 1|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 7\n' +            'b = 7\n' +
            '|truePath\n' +            'op1->cond1\n' +            'cond1(yes)->op3\n' +
            'op3->e1\n' +            'cond1(no)->e1\n' +            'e1->op4\n')
    );
});
it('extractedif', ()=> {
    let AfterCFG;
    AfterCFG = CFG.extractedif('IfStatement', true, 'x');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('x')
    );
});
it('input one int', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '   let a =1;\n' +        '   let c = 2;\n' +        '   while (a < c) {\n' +
        '       let y  =2;\n' +        '       c = a ;\n' +        '       a = 2;\n' +
        '   }\n' +        '   return 1;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +
            'op4=>operation: (4)\n' +            'y = 2\n' +            'c = a\n' +
            'a = 2\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'a < c|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 1\n' +            'c = 2\n' +
            '|truePath\n' +            'op1->op3\n' +            'op3->cond1\n' +
            'cond1(yes)->op4\n' +            'op4->op3\n' +            'cond1(no)->op5\n')
    );
});
it('global and inputs argument - ++, --', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('1','let w=1;\n' +
        'function foo(x){\n' +        '   let a =1;\n' +        '   let c = 2;\n' +        '   w++;\n' +        '   w--;\n' +        '   x--;\n' +        '   x++;\n' +
        '   while (a < c) {\n' +        '       c = a ;\n' +        '       a = 2;\n' +        '   }\n' +        '   return 1;\n' +
        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +            'op4=>operation: (4)\n' +
            'c = a\n' +            'a = 2\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'a < c|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 1\n' +            'c = 2\n' +
            'w++\n' +            'w--\n' +            'x--\n' +            'x++\n' +            '|truePath\n' +
            'op1->op3\n' +            'op3->cond1\n' +            'cond1(yes)->op4\n' +
            'op4->op3\n' +            'cond1(no)->op5\n')    );
});
it('global ++', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','let w=1;\n' +        'function foo(){\n' +
        '   let a =1;\n' +        '   let c = 2;\n' +        '   w++;\n' +        '   while (a < c) {\n' +
        '       c = a ;\n' +        '       a = 2;\n' +        '   }\n' +
        '   return 1;\n' +
        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +            'op4=>operation: (4)\n' +
            'c = a\n' +            'a = 2\n' +            '|truePath\n' +
            'cond1=>condition: (3)\n' +            'a < c|truePath\n' +            'op3=>operation: (2)\n' +
            'NULL|truePath\n' +            'op1=>operation: (1)\n' +            'a = 1\n' +
            'c = 2\n' +            'w++\n' +            '|truePath\n' +
            'op1->op3\n' +            'op3->cond1\n' +            'cond1(yes)->op4\n' +
            'op4->op3\n' +            'cond1(no)->op5\n')
    );
});
it('a--, a++', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +
        '   let a =1;\n' +        '   let c = 2;\n' +        '   a++;\n' +        '   a--;\n' +        '   while (a < c) {\n' +
        '       c = a ;\n' +        '       a = 2;\n' +        '   }\n' +
        '   return 1;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +
            'op4=>operation: (4)\n' +            'c = a\n' +           'a = 2\n' +
            '|truePath\n' +            'cond1=>condition: (3)\n' +            'a < c|truePath\n' +
            'op3=>operation: (2)\n' +            'NULL|truePath\n' +            'op1=>operation: (1)\n' +
            'a = 1\n' +            'c = 2\n' +            'a++\n' +            'a--\n' +            '|truePath\n' +
            'op1->op3\n' +            'op3->cond1\n' +            'cond1(yes)->op4\n' +
            'op4->op3\n' +
            'cond1(no)->op5\n')
    );
});
it('a--', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '   let a =1;\n' +
        '   let c = 2;\n' +        '   \n' +        '   while (a < c) {\n' +        '       c = a ;\n' +
        '       a = 2;\n' +        '       a--;\n' +        '   }\n' +
        '   return 1;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 1|truePath\n' +
            'op4=>operation: (4)\n' +            'c = a\n' +            'a = 2\n' +
            'a--\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'a < c|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 1\n' +
            'c = 2\n' +            '|truePath\n' +            'op1->op3\n' +
            'op3->cond1\n' +            'cond1(yes)->op4\n' +            'op4->op3\n' +
            'cond1(no)->op5\n')
    );
});
it('multiplication', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('true','function foo(x){\n' +        '   let a =1;\n' +        '   let c = 2 * x;\n' +
        '   \n' +        '   while (x) {\n' +        '       c = a ;\n' +        '   }\n' +
        '   return a;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return a|truePath\n' +
            'op4=>operation: (4)\n' +            'c = a\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'x|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +            'op1=>operation: (1)\n' +
            'a = 1\n' +            'c = 2 * x\n' +            '|truePath\n' +            'op1->op3\n' +            'op3->cond1\n' +
            'cond1(yes)->op4\n' +            'op4->op3\n' +            'cond1(no)->op5\n')
    );
});

it('input string', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('\'hadar\'','function foo(x){\n' +        '   let a =1;\n' +
        '   let c = 2;\n' +        '   \n' +        '   while (a < c) {\n' +        '       c = a ;\n' +        '       a = 2;\n' +        '   }\n' +
        '   return x;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return x|truePath\n' +            'op4=>operation: (4)\n' +
            'c = a\n' +            'a = 2\n' +            '|truePath\n' +
            'cond1=>condition: (3)\n' +            'a < c|truePath\n' +
            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 1\n' +            'c = 2\n' +
            '|truePath\n' +            'op1->op3\n' +            'op3->cond1\n' +            'cond1(yes)->op4\n' +
            'op4->op3\n' +            'cond1(no)->op5\n')
    );
});

it('while whit ++', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('1,2,3','function foo(x, y, z){\n' +        '   let a = x + 1;\n' +
        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +
        '   while (a < z) {\n' +        '       c = a + b;\n' +        '        a++\n' +        '   }\n' +        '   \n' +
        '   return z;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return z|truePath\n' +
            'op4=>operation: (4)\n' +            'c = a + b\n' +
            'a++\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +
            'a < z|truePath\n' +            'op3=>operation: (2)\n' +            'NULL|truePath\n' +
            'op1=>operation: (1)\n' +            'a = x + 1\n' +
            'b = a + y\n' +            'c = 0\n' +            '|truePath\n' +
            'op1->op3\n' +            'op3->cond1\n' +            'cond1(yes)->op4\n' +
            'op4->op3\n' +            'cond1(no)->op5\n')
    );
});

it('if ,elseis, else ans inputs arguments', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '    let a=1;\n' +
        '    if (a<2) {\n' +        '        a=7;\n' +        '     }\n' +        '    else{\n' +
        '        a=2;\n' +        '    }\n' +        '    return 2;\n' +        '    }');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 2|truePath\n' +
            'op4=>operation: (4)\n' +            'a = 2\n' +            '\n' +
            'op3=>operation: (3)\n' +
            'a = 7\n' +            '|truePath\n' +            'e1=>end: ------|truePath\n' +
            'cond1=>condition: (2)\n' +            'a<2|truePath\n' +            'op1=>operation: (1)\n' +
            'a = 1\n' +            '|truePath\n' +            'op1->cond1\n' +            'cond1(yes)->op3\n' +
            'op3->e1\n' +            'cond1(no)->op4\n' +            'op4->e1\n' +            'e1->op5\n')
    );
});
it('input one int', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('true','function foo(x){\n' +        '   let a =1;\n' +        '   let c = 0;\n' +
        '   \n' +        '   while (x) {\n' +        '       c = a ;\n' +        '   }\n' +        '   return a;\n' +
        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return a|truePath\n' +            'op4=>operation: (4)\n' +
            'c = a\n' +            '|truePath\n' +            'cond1=>condition: (3)\n' +            'x|truePath\n' +
            'op3=>operation: (2)\n' +            'NULL|truePath\n' +            'op1=>operation: (1)\n' +
            'a = 1\n' +            'c = 0\n' +            '|truePath\n' +            'op1->op3\n' +
            'op3->cond1\n' +            'cond1(yes)->op4\n' +            'op4->op3\n' +            'cond1(no)->op5\n')
    );
});
it('if ,elseis, else ans inputs arguments', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '    let a=1;\n' +
        '    if (a<2) {\n' +        '        a=7;\n' +        '     }\n' +        '    else{\n' +
        '        a=2;\n' +        '    }\n' +        '    return 2;\n' +        '    }');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return 2|truePath\n' +
            'op4=>operation: (4)\n' +            'a = 2\n' +            '\n' +
            'op3=>operation: (3)\n' +
            'a = 7\n' +            '|truePath\n' +            'e1=>end: ------|truePath\n' +
            'cond1=>condition: (2)\n' +            'a<2|truePath\n' +            'op1=>operation: (1)\n' +
            'a = 1\n' +            '|truePath\n' +            'op1->cond1\n' +            'cond1(yes)->op3\n' +
            'op3->e1\n' +            'cond1(no)->op4\n' +            'op4->e1\n' +            'e1->op5\n')
    );
});


it('input one int', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('1,2,7','function foo(x, y, z){\n' +        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +        '    let c = 0;\n' +        '    \n' +        '    if (b < z) {\n' +
        '        c = c + 5;\n' +        '    } else if (b < z * 2) {\n' +        '        c = c + x + 5;\n' +        '    } else {\n' +
        '        c = c + z + 5;\n' +
        '    }\n' +
        '    \n' +
        '    return c;\n' +
        '}\n');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op6=>operation: (7)\n' +            'return c|truePath\n' +
            'op5=>operation: (6)\n' +            'c = c + z + 5\n' +            '\n' +            'op4=>operation: (5)\n' +            'c = c + x + 5\n' +
            '\n' +            'cond2=>condition: (4)\n' +            'b < z * 2\n' +            'op3=>operation: (3)\n' +
            'c = c + 5\n' +            '|truePath\n' +            'e1=>end: ------|truePath\n' +            'cond1=>condition: (2)\n' +
            'b < z|truePath\n' +            'op1=>operation: (1)\n' +            'a = x + 1\n' +
            'b = a + y\n' +            'c = 0\n' +            '|truePath\n' +            'op1->cond1\n' +            'cond1(yes)->op3\n' +            'op3->e1\n' +            'cond1(no)->cond2\n' +            'cond2(yes)->op4\n' +            'op4->e1\n' +            'cond2(no)->op5\n' +            'op5->e1\n' +
            'e1->op6\n')    );
});
it('while', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('1,2,3','function foo(x, y, z){\n' +        '   let a = x + 1;\n' +
        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z) {\n' +        '       c = a + b;\n' +        '   }\n' +        '   \n' +
        '   return z;\n' +        '}');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return z|truePath\n' +            'op4=>operation: (4)\n' +            'c = a + b\n' +
            '|truePath\n' +            'cond1=>condition: (3)\n' +            'a < z|truePath\n' +
            'op3=>operation: (2)\n' +            'NULL|truePath\n' +            'op1=>operation: (1)\n' +            'a = x + 1\n' +            'b = a + y\n' +
            'c = 0\n' +            '|truePath\n' +            'op1->op3\n' +
            'op3->cond1\n' +            'cond1(yes)->op4\n' +            'op4->op3\n' +
            'cond1(no)->op5\n' )
    );
});
it('global and use it', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','let w =7;\n' +        'function foo(x, y, z){\n' +        '   let a = w + 1;\n' +
        '   let c = 0;\n' +        '   \n' +        '   while (a < z) {\n' +        '       c = a ;\n' +
        '   }\n' +        '   \n' +        '   return z;\n' +        '}\n');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op5=>operation: (5)\n' +            'return z|truePath\n' +            'op4=>operation: (4)\n' +
            'c = a\n' +            '\n' +            'cond1=>condition: (3)\n' +            'a < z|truePath\n' +
            'op3=>operation: (2)\n' +            'NULL|truePath\n' +            'op1=>operation: (1)\n' +
            'a = w + 1\n' +            'c = 0\n' +            '|truePath\n' +            'op1->op3\n' +
            'op3->cond1\n' +            'cond1(yes)->op4\n' +            'op4->op3\n' +
            'cond1(no)->op5\n')
    );
});
it('input one int', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('','function foo(){\n' +        '    let a = 1;\n' +
        '    if (a < 0) {\n' +        '        a = 3;\n' +        '    }\n' +
        '    return 1;\n' +        '}\n');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op4=>operation: (4)\n' +            'return 1|truePath\n' +            'op3=>operation: (3)\n' +
            'a = 3\n' +            '\n' +            'e1=>end: ------|truePath\n' +            'cond1=>condition: (2)\n' +            'a < 0|truePath\n' +
            'op1=>operation: (1)\n' +            'a = 1\n' +            '|truePath\n' +
            'op1->cond1\n' +
            'cond1(yes)->op3\n' +            'op3->e1\n' +            'cond1(no)->e1\n' +
            'e1->op4\n')
    );
});

it('globals', ()=> {
    let AfterCFG;
    AfterCFG = CFG.CFGstart('1,2,3','let w=2;\n' +        'function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = 0;\n' +
        '    \n' +        '    if (b < z) {\n' +        '        c = c + 5;\n' +
        '    } else if (b < z * 2) {\n' +        '        c = c + x + 5;\n' +        '    } else {\n' +
        '        c = c + z + 5;\n' +        '    }\n' +        '    \n' +
        '    return c;\n' +        '}\n');
    assert.equal(
        JSON.stringify(AfterCFG),
        JSON.stringify('op6=>operation: (7)\n' +            'return c|truePath\n' +
            'op5=>operation: (6)\n' +            'c = c + z + 5\n' +
            '\n' +            'op4=>operation: (5)\n' +            'c = c + x + 5\n' +            '|truePath\n' +
            'cond2=>condition: (4)\n' +            'b < z * 2|truePath\n' +            'op3=>operation: (3)\n' +
            'c = c + 5\n' +            '\n' +            'e1=>end: ------|truePath\n' +
            'cond1=>condition: (2)\n' +            'b < z|truePath\n' +            'op1=>operation: (1)\n' +            'a = x + 1\n' +
            'b = a + y\n' +            'c = 0\n' +            '|truePath\n' +            'op1->cond1\n' +
            'cond1(yes)->op3\n' +            'op3->e1\n' +            'cond1(no)->cond2\n' +            'cond2(yes)->op4\n' +
            'op4->e1\n' +            'cond2(no)->op5\n' +            'op5->e1\n' +            'e1->op6\n')    );
});
