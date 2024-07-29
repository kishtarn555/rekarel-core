import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
export default {
    input: 'src/index.js',
    output: {
      file: 'bundle/bundle.cjs',
      format: 'cjs',
      name:"karel"
    },
    
    plugins: [
        commonjs(),
        nodeResolve()
    ]
  };