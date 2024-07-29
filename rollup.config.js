import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
export default [{
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      name:"karel"
    },
    
    plugins: [
        commonjs(),
        nodeResolve()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'es',
      name:"karel"
    },
    
    plugins: [
        commonjs(),
        nodeResolve()
    ]
  }];