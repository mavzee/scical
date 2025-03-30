import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('0');
  const [prevInput, setPrevInput] = useState('');
  const [isRadians, setIsRadians] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNumber = (num) => {
    if (input === '0' && num !== '.') {
      setInput(num);
    } else if (input === '-0' && num !== '.') {
      setInput('-' + num);
    } else {
      setInput(input + num);
    }
  };

  const handleOperator = (op) => {
    if (input.slice(-1) === op) return;
    setInput(input + op);
  };

  const handleFunction = (func) => {
    if (func === '±') {
      setInput(input.startsWith('-') ? input.slice(1) : '-' + input);
    } else if (func === 'π') {
      setInput(input === '0' ? Math.PI.toString() : input + Math.PI.toString());
    } else if (func === 'e') {
      setInput(input === '0' ? Math.E.toString() : input + Math.E.toString());
    } else {
      setInput(func + '(' + (input === '0' ? '' : input) + ')');
    }
  };

  const calculate = () => {
    try {
      const degToRad = (angle) => angle * Math.PI / 180;
      
      if (!isNaN(input)) {
        setPrevInput(input + ' =');
        return;
      }

      let expression = input
        .replace(/sin\(/g, isRadians ? 'Math.sin(' : '(Math.sin(degToRad(')
        .replace(/cos\(/g, isRadians ? 'Math.cos(' : '(Math.cos(degToRad(')
        .replace(/tan\(/g, isRadians ? 'Math.tan(' : '(Math.tan(degToRad(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      if (!isRadians) {
        expression = expression.replace(/(Math\.(sin|cos|tan))\(degToRad\(([^)]+)\)\)/g, '$1(degToRad($3))');
      }

      setPrevInput(input + ' =');
      const result = eval(expression);
      setInput(Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString());
    } catch (error) {
      setInput('Error');
    }
  };

  const clearAll = () => {
    setInput('0');
    setPrevInput('');
  };

  const backspace = () => {
    if (input.length === 1 || (input.length === 2 && input.startsWith('-'))) {
      setInput('0');
    } else {
      setInput(input.slice(0, -1));
    }
  };

  const toggleAngleMode = () => {
    setIsRadians(!isRadians);
  };

  return (
    <div className={`ph-container ${isMobile ? 'mobile' : ''}`}>
      <div className="ph-calculator">
        <div className="ph-display">
          <div className="ph-prev">{prevInput}</div>
          <div className="ph-current">{input}</div>
        </div>
        
        <div className="ph-angle-toggle">
          <button className="ph-angle-btn" onClick={toggleAngleMode}>
            {isRadians ? 'RAD' : 'DEG'}
          </button>
        </div>
        
        <div className="ph-buttons">
          <button className="ph-func-btn" onClick={clearAll}>AC</button>
          <button className="ph-func-btn" onClick={backspace}>⌫</button>
          <button className="ph-func-btn" onClick={() => handleFunction('√')}>√</button>
          <button className="ph-func-btn" onClick={() => handleOperator('^')}>^</button>
          <button className="ph-func-btn" onClick={() => handleOperator('(')}>(</button>
          
          <button className="ph-func-btn" onClick={() => handleFunction('sin')}>sin</button>
          <button className="ph-func-btn" onClick={() => handleFunction('cos')}>cos</button>
          <button className="ph-func-btn" onClick={() => handleFunction('tan')}>tan</button>
          <button className="ph-func-btn" onClick={() => handleOperator(')')}>)</button>
          <button className="ph-op-btn" onClick={() => handleOperator('/')}>÷</button>
          
          <button className="ph-func-btn" onClick={() => handleFunction('log')}>log</button>
          <button className="ph-func-btn" onClick={() => handleFunction('ln')}>ln</button>
          <button className="ph-func-btn" onClick={() => handleFunction('π')}>π</button>
          <button className="ph-func-btn" onClick={() => handleFunction('e')}>e</button>
          <button className="ph-op-btn" onClick={() => handleOperator('*')}>×</button>
          
          <button className="ph-num-btn" onClick={() => handleNumber('7')}>7</button>
          <button className="ph-num-btn" onClick={() => handleNumber('8')}>8</button>
          <button className="ph-num-btn" onClick={() => handleNumber('9')}>9</button>
          <button className="ph-func-btn" onClick={() => handleFunction('±')}>±</button>
          <button className="ph-op-btn" onClick={() => handleOperator('-')}>-</button>
          
          <button className="ph-num-btn" onClick={() => handleNumber('4')}>4</button>
          <button className="ph-num-btn" onClick={() => handleNumber('5')}>5</button>
          <button className="ph-num-btn" onClick={() => handleNumber('6')}>6</button>
          <button className="ph-num-btn" onClick={() => handleNumber('.')}>.</button>
          <button className="ph-op-btn" onClick={() => handleOperator('+')}>+</button>
          
          <button className="ph-num-btn" onClick={() => handleNumber('1')}>1</button>
          <button className="ph-num-btn" onClick={() => handleNumber('2')}>2</button>
          <button className="ph-num-btn" onClick={() => handleNumber('3')}>3</button>
          <button className="ph-equals-btn span-2" onClick={calculate}>=</button>
          
          <button className="ph-num-btn span-2" onClick={() => handleNumber('0')}>0</button>
          <button className="ph-op-btn" onClick={() => handleOperator('%')}>%</button>
        </div>
      </div>
    </div>
  );
}

export default App;