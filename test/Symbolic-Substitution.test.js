import assert from 'assert';
import {parseSymbolicSubstitution} from '../src/js/Symbolic-Substitution';

describe('The javascript Symbol-Substitution', () => {
    it('local variable', () => {
        let input = {};
        input['x'] = [];
        input['x'].push({'line': 0, 'conditions:': [], 'value:': 1});
        assert.equal(
            parseSymbolicSubstitution(input, 'function foo(x){\n' + 'let a= x + 1;\n' + 'return a;\n' +'}'),
            '<pre>function foo(x){</pre><pre>return (x + 1);</pre><pre> }</pre>'
        );
    });

    it('while not alon in the line', () => {
        assert.equal(
            parseSymbolicSubstitution({}, 'function foo()\n' +
                '{   while (1 < 2){\n' +
                '      return 1;\n' +
                '   }\n' +
                '}'),
            '<pre>function foo()</pre>' +
            '<pre>{   while (1 < 2){</pre>' +
            '<pre>      return 1;</pre>' +
            '<pre>    }</pre>' +
            '<pre> }</pre>'
        );
    });
    it('Update Expression', () => {
        assert.equal(
            parseSymbolicSubstitution({}, 'function foo(){\n' +
                '   let x =1;\n' +
                '   x++;\n' +
                '}'),
            '<pre>function foo(){</pre>' +
            '<pre> }</pre>'
        );
    });

    it('function', () => {
        assert.equal(
            parseSymbolicSubstitution({}, 'let x=5\n' +
                '; function foo(){\n' +
                '}'),
            '<pre>let x=5;</pre>' +
            '<pre>  function foo(){</pre>' +
            '<pre> }</pre>'
        );
    });

    it('input array', () => {
        let input = {};
        input['arr'] = [];
        input['arr'].push({'line': 0, 'conditions:': [], 'value:': [0,1]});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(arr){\n' +
                '    x = arr[1];\n' +
                '    return x;\n' +
                '}\n'
            ),
            '<pre>function foo(arr){</pre>' +
            '<pre>    return (arr[1]);</pre>' +
            '<pre> }</pre>'
        );
    });

    it('decleration outside function', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'let x \n' +
                '=5;\n' +
                'function foo(){\n' +
                '}'
            ),
            '<pre>let x=5;</pre>' +
            '<pre>function foo(){</pre>' +
            '<pre> }</pre>'
        );
    });

    it('variable decleration twice', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                'let x=1;\n' +
                'let x=2;\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre> }</pre>'
        );
    });
    it('Assignment Expression twice', () => {
        let input = {};
        input['x'] = [];
        input['x'].push({'line': 0, 'conditions:': [], 'value:': 3});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(x){\n' +
                'x=3;\n' +
                '}'
            ),
            '<pre>function foo(x){</pre>' +
            '<pre>x = 3;</pre>' +
            '<pre> }</pre>'
        );
    });

    it('Assignment Expression twice', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                'let x;\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre> }</pre>'
        );
    });

    it('input array and return spesific value from the array', () => {
        let input = {};
        input['arr'] = [];
        input['arr'].push({'line': 0, 'conditions:': [], 'value:': [6,7]});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(arr){\n' +
                '    return arr[0];\n' +
                '}\n'
            ),
            '<pre>function foo(arr){</pre>' +
            '<pre>    return arr[0];</pre>' +
            '<pre> }</pre>'
        );
    });
    it('if else statements, if statment, else statment', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function func(){\n' +
                '   var a = 1;\n' +
                '   if(a>5){\n' +
                '      return a+1;\n' +
                '   }\n' +
                '   else if(a<5){\n' +
                '      a=1\n' +
                '   }\n' +
                '   else{\n' +
                '      return a;\n' +
                '   }\n' +
                '}'
            ),
            '<pre>function func(){</pre>' +
            '<pre class=red>   if(1 > 5){</pre>' +
            '<pre>      return 1 + 1;</pre>' +
            '<pre>    }</pre>' +
            '<pre class=green>    else if(1 < 5){</pre>' +
            '<pre>    } else </pre>' +
            '<pre>       {</pre>' +
            '<pre>      return 1;</pre>' +
            '<pre>    }</pre>' +
            '<pre> }</pre>'
        );
    });
    it('if inside if', () => {
        let input = {};
        input['arr'] = [];
        input['arr'].push({'line': 0, 'conditions:': [], 'value:': [0,1]});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                '   let x=2;\n' +
                '   if(x>1){\n' +
                '      if(x>2){\n' +
                '         x=x+1;\n' +
                '      }\n' +
                '   }\n' +
                '   return x+1;\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre class=green>   if(2 > 1){</pre>' +
            '<pre class=red>      if(2 > 2){</pre>' +
            '<pre>       }</pre>' +
            '<pre>    }</pre>' +
            '<pre>   return 2 + 1;</pre>' +
            '<pre> }</pre>'
        );
    });

    it('if else', () => {
        let input = {};
        input['x'] = [];
        input['y'] = [];
        input['z'] = [];
        input['x'].push({'line': 0, 'conditions:': [], 'value:': '3'});
        input['y'].push({'line': 0, 'conditions:': [], 'value:': '5'});
        input['z'].push({'line': 0, 'conditions:': [], 'value:': '200'});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(x, y, z){\n' +
                '    let b = x + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                '}\n'
            ),
            '<pre>function foo(x,y,z)  {</pre>' +
            '<pre class=red>    if((x + y) < z){</pre>' +
            '<pre>        return x + y + z + (0 + 5);</pre>' +
            '<pre>     } else {</pre>' +
            '<pre>        return x + y + z + 0;</pre>' +
            '<pre>     }</pre>' +
            '<pre> }</pre>'
        );
    });
    it('Update Expression', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                '   let arr=[6,5];\n' +
                '   return arr[0];\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre>   return 6;</pre>' +
            '<pre> }</pre>'
        );
    });
    it('if whitout else', () => {
        let input = {};
        input['x'] = [];
        input['y'] = [];
        input['z'] = [];
        input['x'].push({'line': 0, 'conditions:': [], 'value:': 3});
        input['y'].push({'line': 0, 'conditions:': [], 'value:': 5});
        input['z'].push({'line': 0, 'conditions:': [], 'value:': 200});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(x, y, z){\n' +
                '   let w=1;\n' +
                '   let d= w + w +2;\n' +
                '   if(d < 10)\n' +
                '      return d;\n' +
                '}'
            ),
            '<pre>function foo(x,y,z)  {</pre>' +
            '<pre class=green>   if((1 + 1 + 2) < 10)</pre>' +
            '<pre>      return (1 + 1 + 2);</pre>' +
            '<pre> }</pre>'
        );
    });
    it('while statment', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                '    let a = 1;\n' +
                '    while( a < 5){\n' +
                '        a = a + 1;\n' +
                '    }\n' +
                '    return a;\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre>    while (1 < 5){</pre>' +
            '<pre>     }</pre>' +
            '<pre>    return 1;</pre>' +
            '<pre> }</pre>'
        );
    });

    it('array deceleration', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                '   let arr=[6,5];\n' +
                '   return arr;\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre>   return (6,5);</pre>' +
            '<pre> }</pre>'
        );
    });
    it('Update Expression', () => {
        let input = {};
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                '   let x =1;\n' +
                '   x=2;\n' +
                '   return x;\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre>   return 2;</pre>' +
            '<pre> }</pre>'
        );
    });
    it('boolean argument', () => {
        let input = {};
        input['arr'] = [];
        input['arr'].push({'line': 0, 'conditions:': [], 'value:': [0,1]});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(){\n' +
                '   let x =true;\n' +
                '   if(!x){}\n' +
                '}'
            ),
            '<pre>function foo(){</pre>' +
            '<pre class=red>   if(!(true)){}</pre>' +
            '<pre> }</pre>'
        );
    });
    it('input array', () => {
        let input = {};
        input['a'] = [];
        input['a'].push({'line': 0, 'conditions:': [], 'value:': [1,7,8,8,9]});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(a){\n' +
                '}'
            ),
            '<pre>function foo(a){</pre>' +
            '<pre> }</pre>'
        );
    });
    it('input array and use it in if', () => {
        let input = {};
        input['a'] = [];
        input['a'].push({'line': 0, 'conditions:': [], 'value:': [true]});
        assert.equal(
            parseSymbolicSubstitution(input,'function foo(a){\n' +
                '   if(a[0]) \n' +
                '   {\n' +
                '   }\n' +
                '}'
            ),
            '<pre>function foo(a){</pre><pre>   if(a[0])</pre><pre>   {</pre><pre>    }</pre><pre> }</pre>'
        );
    });

});





